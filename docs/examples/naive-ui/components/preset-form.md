# PresetForm 配置表单

## Demo

<demo vue="./demos/preset-form.vue" title="PresetForm" />

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
