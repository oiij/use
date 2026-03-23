# PresetForm 配置表单

## 功能描述

**PresetForm** 是一个功能强大的配置表单组件，提供了完整的表单配置能力，包括动态表单生成、字段校验、布局控制、自定义渲染等特性。它基于 Naive UI 的 Form 组件和 PresetInput 组件实现，为 Vue 应用提供了灵活的表单配置解决方案。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/naive-ui

# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui
```

## 依赖

- `vue`: ^3.0.0
- `naive-ui`: ^2.0.0

## 基本使用

<demo vue="./preset-form.vue" title="PresetForm" />

## API

### `<PresetForm />`

配置表单组件。

#### Props

| 属性        | 类型                | 说明         |
| ----------- | ------------------- | ------------ |
| `values`    | `object`            | 表单值       |
| `options`   | `PresetFormOptions` | 配置表单选项 |
| `rules`     | `NaiveFormRules`    | 表单校验规则 |
| `formProps` | `FormProps`         | Form 配置    |
| `gridProps` | `GridProps`         | Grid 配置    |

#### Events

| 事件        | 参数         | 说明           |
| ----------- | ------------ | -------------- |
| `validated` | `(value: V)` | 校验成功时触发 |

## PresetFormOptionItem 配置

| 属性        | 类型                                           | 说明       |
| ----------- | ---------------------------------------------- | ---------- |
| `key`       | `keyof V`                                      | 字段键名   |
| `label`     | `string \| (() => string)`                     | 标签       |
| `required`  | `boolean \| (() => boolean)`                   | 是否必填   |
| `collapsed` | `boolean \| (() => boolean)`                   | 是否折叠   |
| `span`      | `string \| number \| (() => string \| number)` | 栅格占位   |
| `hidden`    | `boolean \| (() => boolean)`                   | 是否隐藏   |
| `rule`      | `FormRules \| FormItemRule`                    | 校验规则   |
| `props`     | `FormItemGiProps`                              | 表单项配置 |
| `render`    | `(params) => VNode`                            | 自定义渲染 |

## 类型定义

```ts
export type PresetFormOptionItem<V> = PresetInputOptions & {
  /**
   * 字段键名
   */
  key?: keyof V
  /**
   * 标签
   */
  label?: string | (() => string)
  /**
   * 是否必填
   */
  required?: boolean | (() => boolean)
  /**
   * 是否折叠
   */
  collapsed?: boolean | (() => boolean)
  /**
   * 栅格占位
   */
  span?: string | number | (() => string | number)
  /**
   * 是否隐藏
   */
  hidden?: boolean | (() => boolean)
  /**
   * 校验规则
   */
  rule?: FormRules | FormItemRule | FormItemRule[]
  /**
   * 表单项配置
   */
  props?: FormItemGiProps & ClassStyle
  /**
   * 自定义渲染
   */
  render?: (params: PresetFormExpose<V>) => VNode | null
}

export type PresetFormOptions<V> = PresetFormOptionItem<V>[]

export type PresetFormProps<V> = {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps & ClassStyle
  gridProps?: GridProps & ClassStyle
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { PresetForm } from '@oiij/naive-ui'
import { ref } from 'vue'

const values = ref({
  name: '',
  age: null,
  email: ''
})

const options = [
  { key: 'name', label: '姓名', type: 'input' },
  { key: 'age', label: '年龄', type: 'input-number' },
  { key: 'email', label: '邮箱', type: 'input' }
]

function handleValidated(value) {
  console.log('表单数据:', value)
}
</script>

<template>
  <PresetForm
    v-model:values="values"
    :options="options"
    @validated="handleValidated"
  />
</template>
```

### 带校验规则

```vue
<script setup>
import { PresetForm } from '@oiij/naive-ui'
import { ref } from 'vue'

const values = ref({
  name: '',
  email: ''
})

const options = [
  {
    key: 'name',
    label: '姓名',
    type: 'input',
    required: true
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    rule: { type: 'email', message: '请输入正确的邮箱' }
  }
]
</script>

<template>
  <PresetForm v-model:values="values" :options="options" />
</template>
```

### 自定义渲染

```vue
<script setup>
import { PresetForm } from '@oiij/naive-ui'
import { NButton } from 'naive-ui'
import { h, ref } from 'vue'

const values = ref({ name: '' })

const options = [
  { key: 'name', label: '姓名', type: 'input' },
  {
    render: ({ validate, reset }) => {
      return h('div', { style: { display: 'flex', gap: '10px' } }, [
        h(NButton, { type: 'primary', onClick: validate }, () => '提交'),
        h(NButton, { onClick: reset }, () => '重置')
      ])
    }
  }
]
</script>

<template>
  <PresetForm v-model:values="values" :options="options" />
</template>
```
