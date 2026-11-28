import type { ValidateError } from 'async-validator'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import type { DataObject } from './use-data-request'
import { createEventHook } from '@vueuse/core'
import { cloneDeep } from 'es-toolkit/object'
import { isEqual, isPlainObject } from 'es-toolkit/predicate'
import { computed, ref, toRaw, toValue, watch } from 'vue'

/**
 * 表单清空规则配置
 * 用于指定不同类型值或指定字段清空后的默认值
 * @template T 表单值类型
 */
export type UseNaiveFormClearRules<T extends DataObject = DataObject> = {
  /** 字符串类型的默认值，默认 null */
  string?: string | null
  /** 数字类型的默认值，默认 null */
  number?: number | null
  /** 布尔类型的默认值，默认 null */
  boolean?: boolean | null
} & {
  /** 按字段名指定的清空值，优先级高于类型默认值（string/number/boolean 为类型保留键） */
  [K in Exclude<keyof T, 'string' | 'number' | 'boolean'>]?: unknown
}

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | JSONValue[]

/**
 * 递归清空 JSON 兼容对象的每个字段
 * 遍历 plain object 的自有键，优先使用按字段名指定的清空值，其余按 string/number/boolean 类型默认值重置
 * 字段级规则只匹配当前对象层级的键，更深层对象使用类型默认值；数组直接清空
 * Date / Map / Set / File 等非 JSON 兼容值保持原样不处理
 * @template T 仅支持 JSON 兼容值（string | number | boolean | null | 数组 | 普通对象）
 * @param obj 要清空的目标对象，会被原地修改
 * @param rules 可选的类型默认值与字段级清空值，不传则使用内置默认值（string=null / number=null / boolean=null）
 */
function clearObjectValues<T extends JSONValue>(obj: T, rules?: UseNaiveFormClearRules): T {
  const { string: _string = null, number: _number = null, boolean: _boolean = null, ...fieldRules } = rules ?? {}
  const typeRules = { string: _string, number: _number, boolean: _boolean } as UseNaiveFormClearRules

  if (Array.isArray(obj)) {
    obj.length = 0
    return obj
  }

  if (isPlainObject(obj)) {
    const record = obj as Record<string, unknown>
    for (const key in record) {
      if (fieldRules[key] !== undefined) {
        record[key] = cloneDeep(fieldRules[key])
        continue
      }
      const val = record[key]
      if (val !== undefined && val !== null) {
        record[key] = clearObjectValues(val as JSONValue, typeRules)
      }
    }
    return obj
  }

  if (typeof obj === 'string')
    return _string as T
  if (typeof obj === 'number')
    return _number as T
  if (typeof obj === 'boolean')
    return _boolean as T

  return obj
}

function normalizeUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    const list = value as unknown[]
    for (let i = 0; i < list.length; i++)
      list[i] = normalizeUndefined(list[i])
    return value
  }

  if (isPlainObject(value)) {
    const record = value as Record<string, unknown>
    for (const key in record)
      record[key] = normalizeUndefined(record[key])
    return value
  }

  return (value === undefined ? null : value) as T
}

function assignDeep(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]
    if (isPlainObject(sourceValue) && isPlainObject(targetValue))
      assignDeep(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>)
    else
      target[key] = sourceValue
  }
}

function omitEmpty<T>(value: T): T {
  if (Array.isArray(value))
    return value.map(item => omitEmpty(item)) as T

  if (isPlainObject(value)) {
    const record = value as Record<string, unknown>
    const result: Record<string, unknown> = {}
    for (const key in record) {
      const item = record[key]
      if (item === null || item === undefined)
        continue
      const cleaned = omitEmpty(item)
      if (Array.isArray(cleaned) && cleaned.length === 0)
        continue
      if (isPlainObject(cleaned) && Object.keys(cleaned).length === 0)
        continue
      result[key] = cleaned
    }
    return result as T
  }

  return value
}

/**
 * 表单规则类型
 * 支持两种写法：
 * 1. 字段键直接写 T 的 key（类型安全）：`{ name: [{ required: true }] }`
 * 2. Naive UI 点路径（兼容深层嵌套）：`{ 'user.name': [{ required: true }] }`
 * @template T 表单值类型
 */
export type UseNaiveFormRules<T extends DataObject> = FormRules & Partial<Record<keyof T, FormItemRule | FormItemRule[] | FormRules>>

/**
 * 表单配置选项
 * @template T 表单值类型
 */
export type UseNaiveFormOptions<T extends DataObject> = {
  /** 表单初始值，支持响应式引用或普通值 */
  values?: MaybeRefOrGetter<T>
  /** 表单验证规则，支持响应式引用或普通值 */
  rules?: MaybeRefOrGetter<UseNaiveFormRules<T>>
  /** 表单清空规则，支持按类型默认值或按字段名指定，支持响应式引用或普通值 */
  clearRules?: MaybeRefOrGetter<UseNaiveFormClearRules<T>>
}

/**
 * 用于处理 Naive UI 表单的组合式 API
 * @template T 表单值类型
 * @param formInstRef 表单实例引用
 * @param options 配置选项
 * @returns 表单操作对象
 * @example
 * ```ts
 * const formRef = ref<FormInst>()
 * const { formValues, formRules, formProps, validate, reset, clear } = useNaiveForm(formRef, {
 *   values: { name: '', age: 0 },
 *   rules: { name: { required: true, message: '请输入姓名' } }
 * })
 * ```
 */
export function useNaiveForm<T extends DataObject = DataObject>(formInstRef: TemplateRef<FormInst>, options?: UseNaiveFormOptions<T>) {
  const { values, rules, clearRules } = options ?? {}

  let cacheValue = normalizeUndefined(cloneDeep(toValue(values) ?? {})) as T

  const onUpdateValueEvent = createEventHook<[T]>()
  const onValidatedEvent = createEventHook<[T]>()

  const formValuesRef = ref(cloneDeep(cacheValue)) as Ref<T>
  watch(() => toValue(values), (newValues) => {
    formValuesRef.value = normalizeUndefined(cloneDeep(newValues) ?? {}) as T
    onUpdateValueEvent.trigger(toRaw(formValuesRef.value))
  }, { deep: true })

  const formRulesRef = ref(toValue(rules)) as Ref<UseNaiveFormRules<T>>
  watch(() => toValue(rules), (newRules) => {
    formRulesRef.value = newRules ?? {} as UseNaiveFormRules<T>
  }, { deep: true })

  const formProps = computed(() => ({
    model: formValuesRef.value,
    rules: formRulesRef.value,
  }))

  /**
   * 设置表单值
   * @param value - 要设置的值
   * @example
   * ```ts
   * setValue({ name: '张三' })
   * ```
   */
  function setValue(value: Partial<T>) {
    Object.assign(formValuesRef.value, normalizeUndefined(cloneDeep(value)))
  }

  /**
   * 验证表单
   * @returns 验证结果 Promise
   * @example
   * ```ts
   * try {
   *   await validate()
   * } catch (errors) {
   *   console.log(errors)
   * }
   * ```
   */
  async function validate(): Promise<{ warnings?: ValidateError[][] }> {
    if (!formInstRef.value)
      throw new Error('useNaiveForm: formInstRef is not found.')
    const res = await formInstRef.value.validate()
    onValidatedEvent.trigger(toRaw(formValuesRef.value))
    return res
  }

  /**
   * 验证指定字段
   * 封装 Naive UI FormInst 的局部校验能力，支持单字段或点路径校验嵌套字段
   * @param path 字段路径，支持 keyof T 或 Naive UI 点路径字符串；传数组同时校验多字段
   * @returns 验证结果 Promise
   * @example
   * ```ts
   * // 校验单字段
   * await validateField('name')
   * // 校验嵌套字段
   * await validateField('user.name')
   * // 同时校验多字段
   * await validateField(['name', 'age'])
   * ```
   */
  function validateField(path: string | string[]): Promise<{ warnings?: ValidateError[][] }> {
    if (!formInstRef.value)
      throw new Error('useNaiveForm: formInstRef is not found.')
    return formInstRef.value.validate(undefined, [path].flat())
  }

  /**
   * 重置表单验证状态
   * @example
   * ```ts
   * resetValidation()
   * ```
   */
  function resetValidation() {
    formInstRef.value?.restoreValidation()
  }

  /**
   * 清空表单值
   * 先按类型默认值清空，再用 clearRules 中按字段名配置的值覆盖
   * @example
   * ```ts
   * clear()
   * ```
   */
  function clear() {
    clearObjectValues(formValuesRef.value, toValue(clearRules))
  }

  /**
   * 重新保存表单快照
   * 将当前 formValues 深拷贝覆盖 cacheValue，让后续 resetForm / reset 恢复到最新快照
   * @example
   * ```ts
   * const { resetForm, updateCache, setValue } = useNaiveForm(formRef, {
   *   values: { name: '', age: 0 }
   * })
   * setValue({ name: '张三' })
   * updateCache()
   * // 之后 resetForm 会恢复 { name: '张三', age: 0 }
   * ```
   */
  function updateCache() {
    cacheValue = normalizeUndefined(cloneDeep(formValuesRef.value))
  }

  /**
   * 重置表单值到快照状态
   * 先把当前所有字段按 clearRules 清空（数组清空、对象递归清空），再用快照深度覆盖
   * 这样快照中不存在的新增字段会被清成 null 而不是 undefined，避免 Naive UI 受控组件把 undefined 视为非受控值导致不更新
   * @example
   * ```ts
   * resetForm()
   * ```
   */
  function resetForm() {
    clearObjectValues(formValuesRef.value, toValue(clearRules))
    assignDeep(formValuesRef.value, cloneDeep(cacheValue) as Record<string, unknown>)
    normalizeUndefined(formValuesRef.value)
  }

  /**
   * 重置表单验证状态和值
   * @example
   * ```ts
   * reset()
   * ```
   */
  function reset() {
    resetValidation()
    resetForm()
  }

  const dirty = computed(() => !isEqual(omitEmpty(formValuesRef.value), omitEmpty(cacheValue)))

  return {
    formInst: formInstRef,
    formValues: formValuesRef,
    formRules: formRulesRef,
    formProps,
    dirty,
    setValue,
    validate,
    validateField,
    updateCache,
    resetValidation,
    resetForm,
    reset,
    clear,
    onValidated: onValidatedEvent.on,
    onUpdateValue: onUpdateValueEvent.on,
  }
}

/**
 * useNaiveForm 返回类型
 * @template T 表单值类型
 */
export type UseNaiveFormReturns<T extends DataObject = DataObject> = ReturnType<typeof useNaiveForm<T>>
