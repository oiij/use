import type { ValidateError } from 'async-validator'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import type { DataObject } from './use-data-request'
import { createEventHook } from '@vueuse/core'
import { cloneDeep } from 'es-toolkit/object'
import { isPlainObject } from 'es-toolkit/predicate'
import { reactive, ref, toRaw, toValue, watchEffect } from 'vue'

/**
 * 表单清空规则配置
 * 用于指定不同类型值的清空后的默认值
 */
export type UseNaiveFormClearRules = {
  /** 字符串类型的默认值 */
  string?: string | null
  /** 数字类型的默认值 */
  number?: number | null
  /** 布尔类型的默认值 */
  boolean?: boolean | null
}

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | JSONValue[]

function clearObjectValues<T extends JSONValue>(obj: T, rules?: UseNaiveFormClearRules): T {
  const { string: _string = '', number: _number = null, boolean: _boolean = false } = rules ?? {}

  if (Array.isArray(obj)) {
    obj.length = 0
    return obj
  }

  if (isPlainObject(obj)) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = clearObjectValues(obj[key], rules)
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

/**
 * 表单规则类型
 * @template T 表单值类型
 */
export type UseNaiveFormRules<T extends DataObject> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>

/**
 * 表单配置选项
 * @template T 表单值类型
 */
export type UseNaiveFormOptions<T extends DataObject> = {
  /** 表单初始值，支持响应式引用或普通值 */
  value?: MaybeRefOrGetter<T>
  /** 表单验证规则，支持响应式引用或普通值 */
  rules?: MaybeRefOrGetter<UseNaiveFormRules<T>>
  /** 表单清空规则 */
  clearRules?: UseNaiveFormClearRules
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
 * const { formValue, formRules, formProps, validate, reset, clear } = useNaiveForm(formRef, {
 *   value: { name: '', age: 0 },
 *   rules: { name: { required: true, message: '请输入姓名' } }
 * })
 * ```
 */
export function useNaiveForm<T extends DataObject = DataObject>(formInstRef: TemplateRef<FormInst>, options?: UseNaiveFormOptions<T>) {
  const { value, rules, clearRules } = options ?? {}

  const cacheValue = cloneDeep(toValue(value) ?? {})

  const formValueRef = ref(toValue(value) ?? {}) as Ref<T>
  watchEffect(() => {
    formValueRef.value = toValue(value) ?? {} as T
  })

  const formRulesRef = ref(toValue(rules)) as Ref<UseNaiveFormRules<T>>
  watchEffect(() => {
    formRulesRef.value = toValue(rules) ?? {} as UseNaiveFormRules<T>
  })

  const formProps = {
    model: reactive(formValueRef.value),
    rules: reactive(formRulesRef.value),
  }

  const onValidatedEvent = createEventHook<[T]>()

  /**
   * 设置表单值
   * @param value - 要设置的值
   * @example
   * ```ts
   * setValue({ name: '张三' })
   * ```
   */
  function setValue(value: Partial<T>) {
    Object.assign(formValueRef.value, value)
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
  function validate() {
    if (!formInstRef.value) {
      throw new Error('useNaiveForm: formInstRef is not found.')
    }
    return new Promise<{ warnings?: ValidateError[][] }>((resolve, reject) => {
      formInstRef.value?.validate().then((res) => {
        onValidatedEvent.trigger(toRaw(toValue(formValueRef)))
        return resolve(res)
      }).catch(reject)
    })
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
   * @example
   * ```ts
   * clear()
   * ```
   */
  function clear() {
    clearObjectValues(formValueRef.value, clearRules)
  }

  /**
   * 重置表单值到初始状态
   * @example
   * ```ts
   * resetForm()
   * ```
   */
  function resetForm() {
    clear()
    Object.assign(formValueRef.value, cloneDeep(cacheValue))
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

  return {
    formInst: formInstRef,
    formValue: formValueRef,
    formRules: formRulesRef,
    formProps,
    setValue,
    validate,
    resetValidation,
    resetForm,
    reset,
    clear,
    onValidated: onValidatedEvent.on,
  }
}

/**
 * useNaiveForm 返回类型
 * @template T 表单值类型
 */
export type UseNaiveFormReturns<T extends DataObject = DataObject> = ReturnType<typeof useNaiveForm<T>>
