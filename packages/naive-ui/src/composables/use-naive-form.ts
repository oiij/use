/**
 * 用于处理 Naive UI 表单的组合式 API
 * 提供表单值管理、验证、重置等功能
 */
import type { ValidateError } from 'async-validator'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import type { DataObject } from './use-data-request'
import { createEventHook } from '@vueuse/core'
import { cloneDeep } from 'es-toolkit/object'
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

/**
 * JSON 数据类型
 * 用于递归处理对象结构
 */
type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | JSONValue[]

/**
 * 检查值是否为对象类型
 * @param value 要检查的值
 * @returns 是否为对象类型
 */
function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 清空对象值
 * @param obj 要清空的对象
 * @param rules 清空规则
 * @returns 清空后的对象
 */
function clearObjectValues<T extends JSONValue>(obj: T, rules?: UseNaiveFormClearRules): T {
  const { string: _string = '', number: _number = null, boolean: _boolean = false } = rules ?? {}

  if (Array.isArray(obj)) {
    obj.length = 0
    return obj
  }

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
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
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
function deepMerge(target: DataObject = {}, source: DataObject = {}): DataObject {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (isObject(sourceValue) && isObject(targetValue)) {
        deepMerge(targetValue, sourceValue)
      }
      else {
        target[key] = sourceValue
      }
    }
  }
  return target
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
 */
export function useNaiveForm<T extends DataObject = DataObject>(formInstRef: TemplateRef<FormInst>, options?: UseNaiveFormOptions<T>) {
  const { value, rules, clearRules } = options ?? {}

  // 缓存初始值，用于重置表单
  const cacheValue = cloneDeep(toValue(value) ?? {})

  // 表单值引用
  const formValueRef = ref(toValue(value) ?? {}) as Ref<T>

  // 监听值变化，保持响应式
  watchEffect(() => {
    formValueRef.value = toValue(value) ?? {} as T
  })

  // 表单规则引用
  const formRulesRef = ref(toValue(rules)) as Ref<UseNaiveFormRules<T>>

  // 监听规则变化，保持响应式
  watchEffect(() => formRulesRef.value = toValue(rules) ?? {} as UseNaiveFormRules<T>)

  // 表单属性，用于绑定到表单组件
  const formProps = {
    model: reactive(formValueRef.value),
    rules: reactive(formRulesRef.value),
  }

  // 验证事件钩子
  const onValidatedEvent = createEventHook<[T]>()

  /**
   * 设置表单值
   * @param _value 要设置的值
   */
  function setValue(_value: Partial<T>) {
    Object.assign(formValueRef.value, _value)
  }

  /**
   * 验证表单
   * @returns 验证结果Promise
   */
  function validate() {
    return new Promise<{ warnings?: ValidateError[][] }>((resolve, reject) => {
      if (!formInstRef.value) {
        return reject(new Error('useNaiveForm: formInstRef is not found.'))
      }
      formInstRef.value.validate().then((res) => {
        // 触发验证成功事件
        onValidatedEvent.trigger(toRaw(toValue(formValueRef)))
        return resolve(res)
      }).catch(reject)
    })
  }

  /**
   * 重置表单验证状态
   */
  function resetValidation() {
    formInstRef.value?.restoreValidation()
  }

  /**
   * 清空表单值
   */
  function clear() {
    clearObjectValues(formValueRef.value, clearRules)
  }

  /**
   * 重置表单值到初始状态
   */
  function resetForm() {
    clear()
    const _cacheValue = cloneDeep(cacheValue)
    deepMerge(formValueRef.value, _cacheValue)
  }

  /**
   * 重置表单验证状态和值
   */
  function reset() {
    resetValidation()
    resetForm()
  }

  return {
    /** 表单实例引用 */
    formInst: formInstRef,
    /** 表单值引用 */
    formValue: formValueRef,
    /** 表单规则引用 */
    formRules: formRulesRef,
    /** 表单属性，用于绑定到表单组件 */
    formProps,
    /** 设置表单值 */
    setValue,
    /** 验证表单 */
    validate,
    /** 重置表单验证状态 */
    resetValidation,
    /** 重置表单值到初始状态 */
    resetForm,
    /** 重置表单验证状态和值 */
    reset,
    /** 清空表单值 */
    clear,
    /** 验证成功事件 */
    onValidated: onValidatedEvent.on,
  }
}

/**
 * useNaiveForm 返回类型
 * @template T 表单值类型
 */
export type UseNaiveFormReturns<T extends DataObject = DataObject> = ReturnType<typeof useNaiveForm<T>>
