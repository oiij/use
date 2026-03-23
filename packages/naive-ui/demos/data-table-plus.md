# DataTablePlus 数据表格增强

## 功能描述

**DataTablePlus** 是一个功能强大的数据表格增强组件，提供了完整的数据管理能力，包括远程数据请求、搜索、分页、排序、筛选、行点击事件等特性。它基于 Naive UI 的 DataTable 组件和 VueHooks Plus 的 useRequest 实现，为 Vue 应用提供了高效的数据表格解决方案。

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

<demo vue="./data-table-plus.vue" title="DataTablePlus" />

## API

### `<DataTablePlus />`

增强数据表格组件。

#### Props

| 属性             | 类型                          | 说明             |
| ---------------- | ----------------------------- | ---------------- |
| `api`            | `(params: P) => Promise<D>`   | 异步接口方法     |
| `defaultParams`  | `object`                      | 默认参数         |
| `manual`         | `boolean`                     | 是否手动触发请求 |
| `title`          | `string`                      | 标题             |
| `columns`        | `DataTableColumns`            | 数据表格的列     |
| `fields`         | `DataTablePlusFields`         | 内置参数的字段   |
| `search`         | `SearchInputProps \| boolean` | 搜索框配置       |
| `pagination`     | `PaginationProps \| boolean`  | 分页配置         |
| `dataTableProps` | `DataTableProps`              | 数据表格配置     |
| `requestOptions` | `UseRequestOptions`           | 请求配置         |
| `requestPlugins` | `UseRequestPlugin[]`          | 请求插件配置     |

#### Events

| 事件             | 参数                                                           | 说明               |
| ---------------- | -------------------------------------------------------------- | ------------------ |
| `before`         | `(params: P[])`                                                | 数据加载前         |
| `success`        | `(data: D, params: P[])`                                       | 数据加载完成       |
| `error`          | `(error: Error, params: P[])`                                  | 数据加载失败       |
| `finally`        | `(params: P[], data?: D, err?: Error)`                         | 数据加载完成或失败 |
| `clickRow`       | `(row: R, index: number, event: MouseEvent, currentData: R[])` | 行点击事件         |
| `contextMenuRow` | `(row: R, index: number, event: MouseEvent, currentData: R[])` | 右键菜单事件       |

## 类型定义

```ts
export type DataTablePlusFields = DataRequestFields & {
  filter?: string
  sorter?: string
  rowKey?: string
  search?: string
  children?: string
}

export type DataTablePlusProps<P, D, R> = {
  api?: (params: P) => Promise<D>
  defaultParams?: P
  manual?: boolean
  title?: string
  columns?: DataTableColumns<R>
  fields?: DataTablePlusFields
  search?: SearchInputProps | boolean
  pagination?: PaginationProps | boolean
  dataTableProps?: DataTableProps
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { DataTablePlus } from '@oiij/naive-ui'

const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '地址', key: 'address' }
]

async function fetchData(params) {
  const res = await fetch('/api/users', { body: JSON.stringify(params) })
  return res.json()
}
</script>

<template>
  <DataTablePlus
    :api="fetchData"
    :columns="columns"
    :search="true"
    :pagination="true"
  />
</template>
```

### 带搜索和分页

```vue
<script setup>
import { DataTablePlus } from '@oiij/naive-ui'

const columns = [
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' }
]

async function fetchData(params) {
  return await api.getUsers(params)
}
</script>

<template>
  <DataTablePlus
    :api="fetchData"
    :columns="columns"
    :search="{ placeholder: '搜索用户' }"
    :pagination="{ pageSize: 10 }"
  />
</template>
```
