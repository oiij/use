import type { ValidateError } from 'async-validator'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import type { Ref } from 'vue'
import { createEventHook } from '@vueuse/core'
import { ref, toRaw, toRef, toValue } from 'vue'

export type NaiveFormClearRules = & {
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | JSONValue[]
function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function clearObjectValues<T extends JSONValue>(obj: T, rules?: NaiveFormClearRules): T {
  const { string: _string = '', number: _number = null, boolean: _boolean = false } = rules ?? {}

  if (Array.isArray(obj)) {
    obj.length = 0
    return obj
  }

  if (typeof obj === 'object' && obj !== null) {
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

function deepMerge(target: Record<string, any> = {}, source: Record<string, any> = {}): Record<string, any> {
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
export type NaiveFormRules<T extends Record<string, any>> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>
export type NaiveFormOptions<T extends Record<string, any>> = & {
  rules?: NaiveFormRules<T>
  clearRules?: NaiveFormClearRules
}

export function useNaiveForm<T extends Record<string, any> = Record<string, any>>(value?: T | Ref<T>, options?: NaiveFormOptions<T>) {
  const { rules, clearRules } = options ?? {}
  const cacheValue = structuredClone(toRaw(toValue(value)))
  const formValue = ref(toValue(value ?? {})) as Ref<T>
  const formRules = rules
  const formRef = ref<FormInst>()
  const formProps = {
    ref: formRef,
    model: formValue,
    rules: formRules,
  }
  const onValidatedEvent = createEventHook<[T]>()
  function validate() {
    return new Promise<{ warnings?: ValidateError[][] }>((resolve, reject) => {
      if (!formRef.value) {
        return reject(new Error('useNaiveForm: formRef is not found.'))
      }
      formRef.value.validate().then((res) => {
        onValidatedEvent.trigger(toRaw(toValue(formValue)))
        return resolve(res)
      }).catch(reject)
    })
  }
  function resetValidation() {
    formRef.value?.restoreValidation()
  }
  function clear() {
    clearObjectValues(formValue.value, clearRules)
  }
  function resetForm() {
    clear()
    const _cacheValue = structuredClone(cacheValue)
    deepMerge(formValue.value, _cacheValue)
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
export type NaiveFormReturns<T extends Record<string, any> = Record<string, any>> = ReturnType<typeof useNaiveForm<T>>
