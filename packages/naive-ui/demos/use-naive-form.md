# UseNaiveForm

## Demo

<demo vue="./use-naive-form.vue" title="UseNaiveForm" />

## Types

```ts
// #region src/composables/use-naive-form.d.ts
type NaiveFormClearRules = {
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}
type NaiveFormRules<T extends DataObject> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>
type NaiveFormOptions<T extends DataObject> = {
  rules?: NaiveFormRules<T> | Ref<NaiveFormRules<T>>
  clearRules?: NaiveFormClearRules
}
declare function useNaiveForm<T extends DataObject = DataObject>(formRef: TemplateRef<FormInst>, value?: T | Ref<T>, options?: NaiveFormOptions<T>): {
  formRef: Readonly<vue1743.ShallowRef<FormInst | null>>
  formValue: Ref<T, T>
  formRules: Ref<Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>, Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>>
  formProps: {
    model: vue1743.Reactive<T>
    rules: vue1743.Reactive<Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>>
  }
  setValue: (_value: Partial<T>) => void
  validate: () => Promise<{
    warnings?: ValidateError[][]
  }>
  resetValidation: () => void
  resetForm: () => void
  reset: () => void
  clear: () => void
  onValidated: _vueuse_core1323.EventHookOn<[T]>
}
type NaiveFormReturns<T extends DataObject = DataObject> = ReturnType<typeof useNaiveForm<T>>
// #endregion
export { NaiveFormClearRules, NaiveFormOptions, NaiveFormReturns, NaiveFormRules, useNaiveForm }
```
