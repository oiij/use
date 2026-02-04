# PresetForm 配置表单

## 功能描述

**PresetForm** 是一个功能强大的配置表单组件，提供了完整的表单配置能力，包括动态表单生成、字段校验、布局控制、自定义渲染等特性。它基于 Naive UI 的 Form 组件和 PresetInput 组件实现，为 Vue 应用提供了灵活的表单配置解决方案。

## 安装

```bash
# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui

# 使用 pnpm
pnpm add @oiij/naive-ui
```

## 基本使用

<demo vue="./preset-form.vue" title="PresetForm" />

## API

### Props

| Name      | Type              | Default | Description    |
| --------- | ----------------- | ------- | -------------- |
| values    | Object            | -       | 文本输入的值。 |
| options   | PresetFormOptions | -       | 配置表单选项   |
| rules     | NaiveFormRules    | -       | 表单校验规则   |
| formProps | FormProps         | -       | Form配置       |
| gridProps | GridProps         | -       | Grid配置       |

### Emits

| Name      | Type               | Description    |
| --------- | ------------------ | -------------- |
| validated | (value: V) => void | 校验成功时触发 |

## 类型定义

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

export type PresetFormProps<V extends DataObject = DataObject> = {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps & ClassStyle
  gridProps?: GridProps & ClassStyle
}
```
