# PresetForm 配置表单

## Demo

<demo vue="./demos/preset-form.vue" title="PresetForm" />

## Types

```ts
export type PresetFormExposeRefs<V extends Record<string, any>> = Pick<NaiveFormReturns<V>, 'formValue' | 'formRef' | 'formRules' | 'formProps'> & {}
export type PresetFormExposeActions<V extends Record<string, any>> = Pick<NaiveFormReturns<V>, 'validate' | 'resetValidation' | 'resetForm' | 'reset' | 'clear' | 'onValidated'> & {
  setValue: (value: Partial<V>) => void
}
export type PresetFormOptions<V extends Record<string, any>> = (PresetInputOptions & {
  key?: keyof V
  gridItemProps?: GridItemProps
  render?: (refs: PresetFormExposeRefs<V>, actions: PresetFormExposeActions<V>) => VNode
})[]
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
