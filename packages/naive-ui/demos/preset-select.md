# PresetSelect 配置选择器

## 功能描述

**PresetSelect** 是一个功能强大的配置选择器组件，提供了完整的选择器配置能力，包括远程数据请求、分页加载、防抖搜索、多选支持、自定义选项格式化等特性。它基于 Naive UI 的 Select 组件和 VueHooks Plus 的 useRequest 实现，为 Vue 应用提供了高效的选择器配置解决方案。

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
- `vue-hooks-plus`: ^2.0.0

## 基本使用

<demo vue="./preset-select.vue" title="PresetSelect" />

## API

### `<PresetSelect />`

配置选择器组件。

#### Props

| 属性             | 类型                         | 说明             |
| ---------------- | ---------------------------- | ---------------- |
| `api`            | `(params: P) => Promise<D>`  | 异步接口方法     |
| `value`          | `PresetSelectValue`          | 选择器的值       |
| `fallbackLabel`  | `string`                     | 无数据时的占位符 |
| `defaultParams`  | `object`                     | 默认参数         |
| `manual`         | `boolean`                    | 是否手动触发请求 |
| `multiple`       | `boolean`                    | 是否多选         |
| `disabled`       | `boolean`                    | 是否禁用         |
| `debounce`       | `boolean \| number`          | 防抖时间         |
| `optionFormat`   | `OptionFormat`               | 选项格式化函数   |
| `fields`         | `PresetSelectFields`         | 内置参数的字段   |
| `pagination`     | `PaginationProps \| boolean` | 分页配置         |
| `selectProps`    | `SelectProps`                | 选择器配置       |
| `requestOptions` | `UseRequestOptions`          | 请求配置         |
| `requestPlugins` | `UseRequestPlugin[]`         | 请求插件配置     |

#### Events

| 事件              | 参数                                   | 说明               |
| ----------------- | -------------------------------------- | ------------------ |
| `before`          | `(params: P[])`                        | 数据加载前         |
| `success`         | `(data: D, params: P[])`               | 数据加载完成       |
| `error`           | `(error: Error, params: P[])`          | 数据加载失败       |
| `finally`         | `(params: P[], data?: D, err?: Error)` | 数据加载完成或失败 |
| `update:value`    | `(val: PresetSelectValue)`             | 值更新时           |
| `update:page`     | `(page: number)`                       | 页码更新时         |
| `update:pageSize` | `(pageSize: number)`                   | 每页数量更新时     |

## 类型定义

```ts
export type PresetSelectValue = string | number | (string | number)[] | null

export type OptionFormat<R> = (row: R) => SelectOption | SelectGroupOption | false | undefined | null

export type PresetSelectFields = DataRequestFields & {
  label?: string
  value?: string
  rowKey?: string
  search?: string
  children?: string
}

export type PresetSelectProps<V, P, D, R> = {
  api?: (params: P) => Promise<D>
  value?: V
  fallbackLabel?: string
  defaultParams?: P
  manual?: boolean
  multiple?: boolean
  disabled?: boolean
  debounce?: boolean | number
  optionFormat?: OptionFormat<R>
  fields?: PresetSelectFields
  selectProps?: SelectProps
  pagination?: PaginationProps | boolean
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { PresetSelect } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')

async function fetchData(params) {
  const res = await fetch('/api/users', { body: JSON.stringify(params) })
  return res.json()
}
</script>

<template>
  <PresetSelect
    v-model:value="value"
    :api="fetchData"
    :option-format="(row) => ({ label: row.name, value: row.id })"
  />
</template>
```

### 多选

```vue
<script setup>
import { PresetSelect } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref([])

async function fetchData(params) {
  return await api.getUsers(params)
}
</script>

<template>
  <PresetSelect
    v-model:value="value"
    :api="fetchData"
    :multiple="true"
    :option-format="(row) => ({ label: row.name, value: row.id })"
  />
</template>
```

### 带搜索

```vue
<script setup>
import { PresetSelect } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')

async function fetchData(params) {
  return await api.searchUsers(params)
}
</script>

<template>
  <PresetSelect
    v-model:value="value"
    :api="fetchData"
    :debounce="300"
    :fields="{ search: 'keyword' }"
    :option-format="(row) => ({ label: row.name, value: row.id })"
  />
</template>
```
