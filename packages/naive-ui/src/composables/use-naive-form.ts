import type { ValidateError } from 'async-validator'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import type { DataObject } from './use-data-request'
import { createEventHook } from '@vueuse/core'
import { cloneDeep } from 'es-toolkit/object'
import { reactive, ref, toRaw, toValue, watchEffect } from 'vue'

export type UseNaiveFormClearRules = {
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}

type JSONValue = string | number | boolean | null | { [x: string]: JSONValue } | JSONValue[]
function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function clearObjectValues<T extends JSONValue>(obj: T, rules?: UseNaiveFormClearRules): T {
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
export type UseNaiveFormRules<T extends DataObject> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>
export type UseNaiveFormOptions<T extends DataObject> = {
  value?: MaybeRefOrGetter<T>
  rules?: MaybeRefOrGetter<UseNaiveFormRules<T>>
  clearRules?: UseNaiveFormClearRules
}

export function useNaiveForm<T extends DataObject = DataObject>(formRef: TemplateRef<FormInst>, options?: UseNaiveFormOptions<T>) {
  const { value, rules, clearRules } = options ?? {}
  const cacheValue = cloneDeep(toValue(value) ?? {})

  const formValue = ref(toValue(value) ?? {}) as Ref<T>
  watchEffect(() => {
    formValue.value = toValue(value) ?? {} as T
  })
  const formRules = ref(toValue(rules)) as Ref<UseNaiveFormRules<T>>
  watchEffect(() => formRules.value = toValue(rules) ?? {} as UseNaiveFormRules<T>)

  const formProps = {
    model: reactive(formValue.value),
    rules: reactive(formRules.value),
  }
  const onValidatedEvent = createEventHook<[T]>()

  function setValue(_value: Partial<T>) {
    Object.assign(formValue.value, _value)
  }
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
    const _cacheValue = cloneDeep(cacheValue)
    deepMerge(formValue.value, _cacheValue)
  }
  function reset() {
    resetValidation()
    resetForm()
  }

  return {
    formRef,
    formValue,
    formRules,
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
export type UseNaiveFormReturns<T extends DataObject = DataObject> = ReturnType<typeof useNaiveForm<T>>
