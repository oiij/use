# PresetForm 配置表单

## Demo

<demo vue="./demos/preset-form.vue" title="PresetForm" />

## Types

```ts
export type PresetFormExposeRefs<V extends Record<string, any> = Record<string, any>> = Pick<NaiveFormReturns<V>, 'formValue' | 'formRef' | 'formRules'>
export type PresetFormExposeActions<V extends Record<string, any> = Record<string, any>> = Pick<NaiveFormReturns<V>, 'validate' | 'resetValidation' | 'resetForm' | 'reset' | 'clear' | 'onValidated'> & {
  setValues: (value: Partial<V>) => void
}
export type PresetFormOptions<V extends Record<string, any> = Record<string, any>> = (PresetInputOptions & {
  key?: keyof V
  label?: string | boolean | (FormItemProps & {
    style?: CSSProperties
    class?: string
  })
  rules?: FormRules | FormItemRule | FormItemRule[]
  collapsed?: boolean
  gridItemProps?: GridItemProps
  render?: (refs: PresetFormExposeRefs<V>, actions: PresetFormExposeActions<V>) => VNode
})[]
export interface PresetFormProps<V extends Record<string, any> = Record<string, any>> {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps
  gridProps?: GridProps
  flexProps?: FlexProps
  layout?: 'grid' | 'flex' | ['grid' | 'flex']
}
```

## Props

| Name      | Type              | Default | Description    |
| --------- | ----------------- | ------- | -------------- |
| values    | Object            | -       | 文本输入的值。 |
| options   | PresetFormOptions | -       | 配置表单选项   |
| rules     | NaiveFormRules    | -       | 表单校验规则   |
| formProps | FormProps         | -       | Form配置       |
| gridProps | GridProps         | -       | Grid配置       |
| flexProps | FlexProps         | -       | Flex配置       |
| layout    | 'grid' or 'flex'  | -       | 布局方式       |

## Emits

| Name      | Type               | Description    |
| --------- | ------------------ | -------------- |
| validated | (value: V) => void | 校验成功时触发 |
