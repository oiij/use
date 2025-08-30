# PresetForm 配置表单

## Demo

<demo vue="./demos/preset-form.vue" title="PresetForm" />

## Types

```ts
export type PresetFormExpose<V extends DataObject = DataObject> = NaiveFormReturns<V>
export type PresetFormOptionItem<V extends DataObject = DataObject> = PresetInputOptions & {
  key?: keyof V
  label?: string | (() => string)
  required?: boolean | (() => boolean)
  collapsed?: boolean | (() => boolean)
  span?: string | number | (() => string | number)
  hidden?: boolean | (() => boolean)
  rule?: FormRules | FormItemRule | FormItemRule[]
  props?: FormItemGiProps & ClassStyle
  render?: (params: PresetFormExpose<V>) => VNode | null
}
export type PresetFormOptions<V extends DataObject = DataObject> = PresetFormOptionItem<V>[]
export type PresetFormProps<V extends DataObject = DataObject> = & {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps & ClassStyle
  gridProps?: GridProps & ClassStyle
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

## Emits

| Name      | Type               | Description    |
| --------- | ------------------ | -------------- |
| validated | (value: V) => void | 校验成功时触发 |
