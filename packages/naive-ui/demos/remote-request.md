# RemoteRequest 远程请求

## 功能描述

**RemoteRequest** 是一个功能强大的远程请求组件，提供了完整的异步数据请求能力，包括 API 调用、参数管理、请求状态控制、分页管理等特性。它基于 `useDataRequest` + VueHooks Plus 的 useRequest 实现，支持 list / count 字段点路径解析（如后端返回 `{ data: { items: [], total: 10 } }`）。

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
- `naive-ui`: ^2.0.0（可选，仅分页场景）
- `vue-hooks-plus`: ^2.0.0
- `es-toolkit`: ^1.0.0

## 基本使用

<demo vue="./remote-request.vue" title="RemoteRequest" />

## API

### `<RemoteRequest />`

#### Props

| 属性             | 类型                        | 说明                                                                                     |
| ---------------- | --------------------------- | ---------------------------------------------------------------------------------------- |
| `api`            | `(params: P) => Promise<D>` | 异步接口方法，接收一个参数对象，返回 Promise                                             |
| `defaultParams`  | `object`                    | 默认请求参数；内置 page / pageSize 会在此值之后作为兜底，用户显式传入不会被覆盖          |
| `manual`         | `boolean`                   | 是否手动触发请求，默认 `false`                                                           |
| `fields`         | `DataRequestFields`         | 字段重命名；`list` / `count` 支持点路径（如 `'data.items'` / `'data.total'`）            |
| `requestOptions` | `UseRequestOptions`         | vue-hooks-plus useRequest 原生配置（包含 onBefore / onSuccess / onError / onFinally 等） |
| `requestPlugins` | `UseRequestPlugin[]`        | vue-hooks-plus useRequest 插件                                                           |

#### Events

| 事件                | 参数                                   | 说明                                                                         |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `before`            | `(params: P[])`                        | 数据加载前（封装层事件钩子，先于 `requestOptions.onBefore` 触发）            |
| `success`           | `(data: D, params: P[])`               | 数据加载完成（先于 `requestOptions.onSuccess` 触发，此时 pagination 已更新） |
| `error`             | `(error: Error, params: P[])`          | 数据加载失败                                                                 |
| `finally`           | `(params: P[], data?: D, err?: Error)` | 数据加载完成或失败                                                           |
| `pagination-change` | `(state: UseDataRequestPagination)`    | 分页状态变更时触发（首次加载完成、`runParams` 换页等）                       |

#### Expose（通过 ref 访问）

继承自 `useDataRequest` 的全部返回值，常用：

| 属性/方法              | 类型                                                                               | 说明                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `loading`              | `Readonly<Ref<boolean>>`                                                           | 请求进行中                                                                       |
| `data`                 | `Readonly<Ref<D \| undefined>>`                                                    | 原始响应数据                                                                     |
| `list`                 | `ComputedRef<R[]>`                                                                 | 列表数据（按 `fields.list` 点路径解析，路径缺失时返回空数组）                    |
| `pagination`           | `Ref<UseDataRequestPagination>`                                                    | 分页状态（可手动写 `.value.page = 2`；包含 `pageCount`）                         |
| `paginationProps`      | `ComputedRef<{ page, pageSize, itemCount, pageCount, showSizePicker, pageSizes }>` | 可直接丢给 `<n-pagination v-bind>` 或 `<n-data-table :pagination>` 的 props 对象 |
| `run(params)`          | `(params?: P) => void`                                                             | 发起一次请求（同步返回 task）                                                    |
| `runAsync(params)`     | `(params?: P) => Promise<D>`                                                       | 发起一次请求（返回 Promise）                                                     |
| `runParams(next)`      | `(next: Partial<P>) => void`                                                       | 基于当前参数 + 增量参数发起请求                                                  |
| `runParamsAsync(next)` | `(next: Partial<P>) => Promise<D>`                                                 | 同上，返回 Promise                                                               |
| `getQuery()`           | `() => P`                                                                          | 安全读取当前请求参数（等价于 `params.value?.[0]`）                               |
| `setParams(next)`      | `(next: Partial<P>) => void`                                                       | 合并当前参数（**不**发起请求，需手动调用 `run` / `runParams`）                   |
| `refresh()`            | `() => void`                                                                       | 用当前参数重新发起请求                                                           |
| `cancel()`             | `() => void`                                                                       | 取消请求                                                                         |
| `mutate(data)`         | `(data?: D) => void`                                                               | 直接修改响应数据（不触发请求）                                                   |
| `onPaginationChange`   | `(cb: (state: UseDataRequestPagination) => void) => void`                          | 分页变更监听（可多次注册，返回取消函数）                                         |

## 类型定义

```ts
export type DataRequestFields = Record<string, string | undefined> & {
  /** 请求参数里的页码字段名，默认 'page' */
  page?: string
  /** 请求参数里的每页大小字段名，默认 'pageSize' */
  pageSize?: string
  /** 响应数据里的列表字段名，支持点路径（如 'data.items'），默认 'list' */
  list?: string
  /** 响应数据里的总数字段名，支持点路径（如 'data.total'），默认 'count' */
  count?: string
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
import { RemoteRequest } from '@oiij/naive-ui'

async function fetchData(params) {
  const res = await fetch('/api/data', { body: JSON.stringify(params) })
  return res.json()
}
</script>

<template>
  <RemoteRequest :api="fetchData">
    <template #default="{ data, loading }">
      <div v-if="loading">
        加载中...
      </div>
      <div v-else>
        {{ data }}
      </div>
    </template>
  </RemoteRequest>
</template>
```

### 点路径字段 + 分页事件

```vue
<script setup>
import { RemoteRequest } from '@oiij/naive-ui'
import { ref } from 'vue'

const remoteRef = ref()

async function fetchData(params) {
  // 后端返回形如 { code: 0, data: { items: [...], total: 100 } }
  const res = await fetch('/api/users', { body: JSON.stringify(params) })
  return res.json()
}

remoteRef.value?.onPaginationChange((state) => {
  console.log('分页变了', state.page, state.pageSize, state.itemCount, state.pageCount)
})
</script>

<template>
  <RemoteRequest
    ref="remoteRef"
    :api="fetchData"
    :fields="{ list: 'data.items', count: 'data.total' }"
  />
</template>
```
