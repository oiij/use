# PresetSelect 配置选择器

## 功能描述

**PresetSelect** 是一个功能强大的配置选择器组件，提供了完整的选择器配置能力，包括远程数据请求、分页加载、防抖搜索、多选支持、自定义选项格式化等特性。它基于 Naive UI 的 Select + `useDataRequest` 实现，支持 list / count 字段点路径解析（如后端返回 `{ data: { items: [], total: 10 } }`）。

## 安装

```bash
pnpm add @oiij/naive-ui
# or
npm install @oiij/naive-ui
# or
yarn add @oiij/naive-ui
```

## 依赖

- `vue`: ^3.0.0
- `naive-ui`: ^2.0.0
- `vue-hooks-plus`: ^2.0.0
- `es-toolkit`: ^1.0.0

## 基本使用

<demo vue="./preset-select.vue" title="PresetSelect" />

## API

### `<PresetSelect />`

#### Props

| 属性             | 类型                                                  | 说明                                                                                                   |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `api`            | `(params: P) => Promise<D>`                           | 异步接口方法，接收一个参数对象                                                                         |
| `value`          | `PresetSelectValue`                                   | 选择器的值（支持 `v-model:value`）                                                                     |
| `fallbackLabel`  | `string \| ((val: string \| number) => SelectOption)` | 字符串作为所有缺失项的统一占位文案，函数可按值返回选项                                                 |
| `defaultParams`  | `Partial<P>`                                          | 默认请求参数；内置 page / pageSize 会在此值之后作为兜底，用户显式传入不会被覆盖                        |
| `manual`         | `boolean`                                             | 是否手动触发请求，默认 `false`                                                                         |
| `multiple`       | `boolean`                                             | 是否多选                                                                                               |
| `disabled`       | `boolean`                                             | 是否禁用                                                                                               |
| `debounce`       | `boolean \| number`                                   | 搜索防抖时间（毫秒）；传 `true` 使用默认 500ms                                                         |
| `optionFormat`   | `OptionFormat<R>`                                     | 把响应列表项格式化为 Naive UI SelectOption / SelectGroupOption / false（过滤掉）                       |
| `fields`         | `PresetSelectFields`                                  | 字段重命名；`list` / `count` 支持点路径（如 `'data.items'` / `'data.total'`）                          |
| `pagination`     | `PaginationProps \| boolean`                          | 分页配置；传 `true` 使用默认配置；切换每页数量会自动回到第一页，用户配置优先于内部默认值               |
| `selectProps`    | `PresetSelectPassThroughProps`                        | 透传给 Naive UI Select 的配置；已排除 value / options / multiple / loading / show 等受控字段，不可覆盖 |
| `requestOptions` | `UseRequestOptions`                                   | vue-hooks-plus useRequest 原生配置                                                                     |
| `requestPlugins` | `UseRequestPlugin[]`                                  | vue-hooks-plus useRequest 插件                                                                         |

#### Events

| 事件              | 参数                                                                                      | 说明                                                                |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `before`          | `(params: P[])`                                                                           | 请求前（封装层事件钩子，先于 `requestOptions.onBefore` 触发）       |
| `success`         | `(data: D, params: P[])`                                                                  | 请求成功（先于 `requestOptions.onSuccess`，此时 pagination 已更新） |
| `error`           | `(error: Error, params: P[])`                                                             | 请求失败                                                            |
| `finally`         | `(params: P[], data?: D, err?: Error)`                                                    | 请求结束（无论成功失败）                                            |
| `update:show`     | `(show: boolean)`                                                                         | 下拉显隐变化时                                                      |
| `update:value`    | `(val: V \| null, option: SelectOption \| SelectOption[] \| null, raw: R \| R[] \| null)` | 值变更时（支持 `v-model:value`）                                    |
| `update:page`     | `(page: number)`                                                                          | 页码变更时                                                          |
| `update:pageSize` | `(pageSize: number)`                                                                      | 每页数量变更时                                                      |

#### Expose（通过 ref 访问）

继承自 `useDataRequest` 的全部返回值 + Select 实例：

| 属性/方法              | 类型                                                                    | 说明                                                     |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| `loading`              | `Readonly<Ref<boolean>>`                                                | 请求进行中                                               |
| `data`                 | `Readonly<Ref<D \| undefined>>`                                         | 原始响应数据                                             |
| `list`                 | `ComputedRef<R[]>`                                                      | 列表数据（按 `fields.list` 点路径解析）                  |
| `pagination`           | `Ref<UseDataRequestPagination>`                                         | 分页状态（可手动写 `.value.page = 2`；包含 `pageCount`） |
| `paginationProps`      | `ComputedRef<{ page, pageSize, itemCount, showSizePicker, pageSizes }>` | 可直接丢给 `<n-pagination v-bind>` 的 props 对象         |
| `runParams(next)`      | `(next: Partial<P>) => void`                                            | 基于当前参数 + 增量参数发起请求                          |
| `runParamsAsync(next)` | `(next: Partial<P>) => Promise<D>`                                      | 同上，返回 Promise                                       |
| `getQuery()`           | `() => P`                                                               | 安全读取当前请求参数                                     |
| `setParams(next)`      | `(next: Partial<P>) => void`                                            | 合并当前参数（不发起请求）                               |
| `selectInst`           | `Ref<SelectInst \| null>`                                               | Naive UI Select 原生实例                                 |
| … 其余                 | 同 `useDataRequest` 返回值                                              | ——                                                       |

> 已选项会缓存，跨页 / 搜索后 label 与多选的 raw 仍可还原；从未加载过的值可能只有 fallback（或 `fallbackLabel`）。

## 类型定义

```ts
/** 等同于共享的 PresetValue */
export type PresetSelectValue = string | number | (string | number)[] | null

export type OptionFormat<R> = (row: R) => SelectOption | SelectGroupOption | false | undefined | null

export type PresetSelectFields = DataRequestFields & {
  /** 选项显示文本字段名 */
  label?: string
  /** 选项值字段名 */
  value?: string
  /** 搜索请求参数字段名 */
  search?: string
  /** 子节点字段名（分组） */
  children?: string
}

export type UseDataRequestPagination = {
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
  /** 总数据量 */
  itemCount: number
  /** 总页数，由 itemCount 和 pageSize 自动计算，不要手动修改 */
  pageCount: number
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
    :option-format="row => ({ label: row.name, value: row.id })"
  />
</template>
```

### 点路径 + 防抖搜索 + 分页

```vue
<script setup>
import { PresetSelect } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref()

async function fetchData(params) {
  // 后端返回 { code: 0, data: { items: [...], total: 100 } }
  return await api.searchUsers(params)
}
</script>

<template>
  <PresetSelect
    v-model:value="value"
    :api="fetchData"
    :debounce="300"
    :pagination="true"
    :fields="{ list: 'data.items', count: 'data.total', search: 'keyword' }"
    :option-format="row => ({ label: row.name, value: row.id })"
  />
</template>
```
