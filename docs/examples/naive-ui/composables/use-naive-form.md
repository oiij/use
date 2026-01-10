# UseNaiveForm

## Demo

<demo vue="./demos/use-naive-form.vue" title="UseNaiveForm" />

## Types

```ts
type ClearRules = {
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}
type FormType = Record<string, unknown>
type NaiveFormRules<T extends FormType> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>> | undefined
type NaiveFormOptions<T extends FormType> = {
  rules?: NaiveFormRules<T>
  clearRules?: ClearRules
}
declare function useNaiveForm<T extends FormType>(value: T, options?: NaiveFormOptions<T>): {
  formRef: vue0.Ref<FormInst | undefined, FormInst | undefined>
  formValue: vue0.Reactive<T> extends infer T_1 ? T_1 extends vue0.Reactive<T> ? T_1 extends (() => infer R) ? Readonly<vue0.Ref<R, R>> : T_1 extends vue0.Ref<any, any> ? T_1 : vue0.Ref<vue0.UnwrapRef<T_1>, vue0.UnwrapRef<T_1>> : never : never
  rules: NaiveFormRules<T>
  formProps: {
    ref: vue0.Ref<FormInst | undefined, FormInst | undefined>
    model: vue0.Reactive<T>
    rules: NaiveFormRules<T>
  }
  validate: () => Promise<{
    warnings: async_validator10.ValidateError[][] | undefined
  }> | undefined
  resetValidation: () => void
  resetForm: () => void
  reset: () => void
  clear: () => void
}
type NaiveFormReturns = ReturnType<typeof useNaiveForm>
```
