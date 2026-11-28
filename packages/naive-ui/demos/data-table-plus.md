# DataTablePlus 数据表格增强

## 功能描述

**DataTablePlus** 是一个功能强大的数据表格增强组件，提供了完整的数据管理能力，包括远程数据请求、搜索、分页、排序、筛选、行点击事件等特性。它基于 Naive UI 的 DataTable + [useDataRequest] (#usedatarequest-数据请求) 实现，支持 list / count 字段点路径解析（如后端返回 `{ data: { items: [], total: 10 } }`），内置搜索防抖、分页切换自动请求、columns 动态同步、rowKey fallback 等常用能力。

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

<demo vue="./data-table-plus.vue" title="DataTablePlus" />

## API

### `<DataTablePlus />`

#### Props

| 属性                   | 类型                                                                   | 说明                                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api`                  | `(params: P) => Promise<D>`                                            | 异步接口方法，接收一个参数对象                                                                                                                          |
| `defaultParams`        | `Partial<P>`                                                           | 默认请求参数；内置 page / pageSize 会在此值之后作为兜底，用户显式传入不会被覆盖                                                                         |
| `manual`               | `boolean`                                                              | 是否手动触发请求，默认 `false`                                                                                                                          |
| `title`                | `string`                                                               | 表格标题                                                                                                                                                |
| `columns`              | `DataTableColumns<R>`                                                  | Naive UI DataTable 列定义；**支持动态变更**（watch 同步，用 `splice` 原地替换保持 reactive）                                                            |
| `fields`               | `DataTablePlusFields`                                                  | 字段重命名；`list` / `count` 支持点路径（如 `'data.items'` / `'data.total'`）；`rowKey` 默认 `'id'`                                                     |
| `search`               | `SearchInputProps \| boolean`                                          | 搜索框配置；传 `true` 使用默认配置                                                                                                                      |
| `pagination`           | `PaginationProps \| boolean`                                           | 分页配置；传 `true` 使用默认配置；内部会自动合并 paginationProps（page / pageSize / itemCount）；切换每页数量会自动回到第一页，用户配置优先于内部默认值 |
| `columnsFilterOptions` | `(filters: DataTableFilterState) => Record<string, any>`               | 把 Naive UI 筛选状态转成请求参数；不传默认发 `{ filter: filters }`                                                                                      |
| `columnsSorterOptions` | `(sorters: Record<string, DataTableSortState>) => Record<string, any>` | 把 Naive UI 排序状态转成请求参数；不传默认发 `{ sorter: sorters }`                                                                                      |
| `dataTableProps`       | `DataTableProps<R>`                                                    | 透传给 Naive UI DataTable 的配置；不能覆盖 row-key / columns / data / loading 等受控属性（组件内部绑定在后）                                            |
| `requestOptions`       | `UseRequestOptions`                                                    | vue-hooks-plus useRequest 原生配置                                                                                                                      |
| `requestPlugins`       | `UseRequestPlugin[]`                                                   | vue-hooks-plus useRequest 插件                                                                                                                          |

#### Events

| 事件                      | 参数                                                           | 说明                                                                |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| `before`                  | `(params: P[])`                                                | 请求前（封装层事件钩子，先于 `requestOptions.onBefore` 触发）       |
| `success`                 | `(data: D, params: P[])`                                       | 请求成功（先于 `requestOptions.onSuccess`，此时 pagination 已更新） |
| `error`                   | `(error: Error, params: P[])`                                  | 请求失败                                                            |
| `finally`                 | `(params: P[], data?: D, err?: Error)`                         | 请求结束（无论成功失败）                                            |
| `click-row`               | `(row: R, index: number, event: MouseEvent, currentData: R[])` | 行点击                                                              |
| `dblclick-row`            | `(row: R, index: number, event: MouseEvent, currentData: R[])` | 行双击                                                              |
| `context-menu-row`        | `(row: R, index: number, event: MouseEvent, currentData: R[])` | 行右键菜单                                                          |
| `update:filters`          | `(filterState, sourceColumn)`                                  | Naive UI 原生筛选变更事件                                           |
| `update:sorter`           | `(options)`                                                    | Naive UI 原生排序变更事件                                           |
| `update:checked-row-keys` | `(keys, rows, meta, currentData)`                              | Naive UI 原生选中变更事件                                           |
| `loadedRows`              | `(rows: R[])`                                                  | 列表数据更新时触发（每次请求成功后 emit 原始列表）                  |

#### Expose（通过 ref 访问）

继承自 `UseDataRequestReturns<P, D, R>` + 表格扩展字段：

| 属性/方法              | 类型                                                                    | 说明                                                                                                |
| ---------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `loading`              | `Readonly<Ref<boolean>>`                                                | 请求进行中                                                                                          |
| `data`                 | `Readonly<Ref<D \| undefined>>`                                         | 原始响应数据                                                                                        |
| `list`                 | `ComputedRef<R[]>`                                                      | 列表数据（按 `fields.list` 点路径解析）                                                             |
| `pagination`           | `Ref<UseDataRequestPagination>`                                         | 分页状态（可手动写 `.value.page = 2`；包含 `pageCount`）                                            |
| `paginationProps`      | `ComputedRef<{ page, pageSize, itemCount, showSizePicker, pageSizes }>` | 可直接丢给 `<n-pagination v-bind>` 或 `<n-data-table :pagination>` 的 props 对象                    |
| `runParams(next)`      | `(next: Partial<P>) => void`                                            | 基于当前参数 + 增量参数发起请求                                                                     |
| `runParamsAsync(next)` | `(next: Partial<P>) => Promise<D>`                                      | 同上，返回 Promise                                                                                  |
| `getQuery()`           | `() => P`                                                               | 安全读取当前请求参数（等价于 `params.value?.[0]`）                                                  |
| `setParams(next)`      | `(next: Partial<P>) => void`                                            | 合并当前参数（**不**发起请求，需手动调用 `run` / `runParams`）                                      |
| `dataTableInst`        | `Ref<DataTableInst \| null>`                                            | Naive UI DataTable 原生实例（可调用 `clearSorter` / `clearFilters` / `clearChecked` 等）            |
| `filters`              | `Ref<DataTableFilterState \| undefined>`                                | 当前筛选状态                                                                                        |
| `sorters`              | `Ref<Record<string, DataTableSortState> \| undefined>`                  | 当前排序状态                                                                                        |
| `reset()`              | `() => void`                                                            | 清空 filters / sorters / 搜索，保留 defaultParams，回到第一页重新请求                               |
| … 其余                 | 同 `useDataRequest` 返回值                                              | `run / refresh / cancel / mutate / onBefore / onSuccess / onError / onFinally / onPaginationChange` |

#### Slots（作用域 v-bind 为解包后的纯值）

> 组件通过 `createExpose` 生成的 `slotProps` 传参，其中的 `loading` / `list` / `pagination` 等已解包为纯值，直接访问即可，不需要 `.value`。通过组件 ref 访问 expose 时仍为 ref 形态。

| 名称           | 作用域 v-bind      | 说明                                   |
| -------------- | ------------------ | -------------------------------------- |
| `header`       | 同 Expose 全部字段 | 表头区域（默认渲染搜索框 + 标题）      |
| `header-extra` | 同 Expose 全部字段 | 搜索框右侧扩展区                       |
| `filter`       | 同 Expose 全部字段 | 筛选条件区域（位于 header 和表格之间） |
| `empty`        | 同 Expose 全部字段 | 表格空状态                             |
| `loading`      | 同 Expose 全部字段 | 表格加载状态                           |
| `footer`       | 同 Expose 全部字段 | 底部分页区域                           |
| `footer-extra` | 同 Expose 全部字段 | 分页右侧扩展区                         |
| `title`        | 无                 | 自定义标题                             |

## 类型定义

```ts
export type DataTablePlusFields = DataRequestFields & {
  /** 筛选请求参数字段名 */
  filter?: string
  /** 排序请求参数字段名 */
  sorter?: string
  /** 行键字段名，默认 'id'；缺省时 row-key 返回 0 避免渲染崩溃 */
  rowKey?: string
  /** 搜索请求参数字段名 */
  search?: string
  /** 子节点字段名（树形数据） */
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

## 内部行为说明（面向组件扩展）

| 行为                             | 实现                                                     | 说明                                                                                                                                          |
| -------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **columns 动态同步**             | `watch(() => props.columns, splice 原地替换)`            | 用户根据权限/业务条件动态切换 columns（admin 多两列）时自动生效，reactive 引用保持稳定，`updateColumnFiltersAndSorters()` 跟随新 columns 运行 |
| **rowKey fallback**              | `(row) => row?.[_fields.rowKey] ?? 0`                    | 后端列表项缺 `id` 字段时返回 0 作为兜底 key，避免 Naive UI DataTable 行闪烁/选择错乱                                                          |
| **scrollX 计算**                 | `watch(columns, immediate)` 算宽                         | 改成 watch 驱动的 ref（原 computed），columns 不常变时避免每次 template 渲染都跑 reduce                                                       |
| **翻页/筛选/排序统一 resetPage** | `resetPage(next) => ({ page: 1, ...next })`              | 筛选、排序、搜索三处都统一回到第一页再请求，避免分页状态不一致                                                                                |
| **expose 类型继承**              | `DataTablePlusExpose = UseDataRequestReturns & 扩展字段` | useDataRequest 未来新增返回值自动被 expose 类型继承，不会漏加字段                                                                             |
| **reset 重置**                   | `reset()` 清空 `filters` / `sorters` / 搜索参数          | 保留 `defaultParams`，回到第一页重新请求，等价于表格级别的「重置一切」                                                                        |

## 使用示例

### 基础用法

```vue
<script setup>
import { DataTablePlus } from '@oiij/naive-ui'

const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '地址', key: 'address' },
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

### 点路径字段 + 分页 props

```vue
<script setup>
import { DataTablePlus } from '@oiij/naive-ui'
import { ref } from 'vue'

const tableRef = ref()
const columns = [
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
]

async function fetchData(params) {
  // 后端返回 { code: 0, data: { items: [...], total: 100 } }
  return await api.getUsers(params)
}

// paginationProps 可直接喂给另一个 NPagination
function goBack() {
  tableRef.value?.runParams({ page: tableRef.value.pagination.value.page - 1 })
}
</script>

<template>
  <DataTablePlus
    ref="tableRef"
    :api="fetchData"
    :columns="columns"
    :fields="{ list: 'data.items', count: 'data.total' }"
    :pagination="{ pageSize: 10, pageSizes: [10, 20, 50] }"
  />
</template>
```

### columns 动态切换（权限场景）

```vue
<script setup>
import { DataTablePlus } from '@oiij/naive-ui'
import { computed, ref } from 'vue'

const isAdmin = ref(false)
const columns = computed(() => {
  const base = [
    { title: '姓名', key: 'name' },
    { title: '邮箱', key: 'email' },
  ]
  return isAdmin.value
    ? [...base, { title: '操作', key: 'actions' }]
    : base
})
</script>

<template>
  <DataTablePlus :columns="columns" :api="fetchData" />
  <!-- columns 变化时自动 watch 同步，不需要刷新整个组件 -->
</template>
```
