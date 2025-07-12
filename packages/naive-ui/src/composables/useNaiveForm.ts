import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import type { Ref } from 'vue'
import { createEventHook } from '@vueuse/core'
import { reactive, ref, toRaw, toRef, toValue } from 'vue'

export interface NaiveFormClearRules {
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | JSONValue[]
function clearObjectValues<T extends JSONValue>(obj: T, rules?: NaiveFormClearRules): T {
  const { string: _string = '', number: _number = null, boolean: _boolean = false } = rules ?? {}
  // 处理数组类型
  if (Array.isArray(obj)) {
    obj.length = 0 // 清空数组
    return obj
  }

  // 处理普通对象
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = clearObjectValues(obj[key], rules)
      }
    }
    return obj
  }

  // 处理基本数据类型（直接返回对应空值）
  if (typeof obj === 'string')
    return _string as T
  if (typeof obj === 'number')
    return _number as T
  if (typeof obj === 'boolean')
    return _boolean as T
  // 其他类型（如 null、undefined、Symbol）保持不变
  return obj
}
export type NaiveFormRules<T extends Record<string, any>> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>
export interface NaiveFormOptions<T extends Record<string, any>> {
  rules?: NaiveFormRules<T>
  clearRules?: NaiveFormClearRules
}
export function useNaiveForm<T extends Record<string, any>>(value?: T, options?: NaiveFormOptions<T>) {
  const { rules, clearRules } = options ?? {}
  const formValue = reactive(value ? structuredClone(toRaw(value)) : {} as T)
  const formRules = rules

  const formRef = ref<FormInst>()
  const formProps = {
    ref: formRef,
    model: formValue,
    rules: formRules,
  }
  const onValidatedEvent = createEventHook<[T]>()
  function validate() {
    return formRef.value?.validate().then(() => onValidatedEvent.trigger(toRaw(toValue(formValue))))
  }
  function resetValidation() {
    formRef.value?.restoreValidation()
  }
  function clear() {
    clearObjectValues(formValue, clearRules)
  }
  function resetForm() {
    clear()
    Object.assign(formValue, structuredClone(value))
  }
  function reset() {
    resetValidation()
    resetForm()
  }

  return {
    formRef,
    formValue: toRef(formValue) as Ref<T>,
    formRules,
    formProps,
    validate,
    resetValidation,
    resetForm,
    reset,
    clear,
    onValidated: onValidatedEvent.on,
  }
}
export type NaiveFormReturns<T extends Record<string, any>> = ReturnType<typeof useNaiveForm<T>>
