# RemoteRequest 远程请求

## 功能描述

**RemoteRequest** 是一个功能强大的远程请求组件，提供了完整的异步数据请求能力，包括 API 调用、参数管理、请求状态控制等特性。它基于 VueHooks Plus 的 useRequest 实现，为 Vue 应用提供了高效的数据请求解决方案。

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
- `vue-hooks-plus`: ^2.0.0

## 基本使用

<demo vue="./remote-request.vue" title="RemoteRequest" />

## API

### `<RemoteRequest />`

远程请求组件。

#### Props

| 属性             | 类型                        | 说明             |
| ---------------- | --------------------------- | ---------------- |
| `api`            | `(params: P) => Promise<D>` | 异步接口方法     |
| `defaultParams`  | `object`                    | 默认参数         |
| `manual`         | `boolean`                   | 是否手动触发请求 |
| `fields`         | `DataRequestFields`         | 内置参数的字段   |
| `requestOptions` | `UseRequestOptions`         | 请求配置         |
| `requestPlugins` | `UseRequestPlugin[]`        | 请求插件配置     |

#### Events

| 事件      | 参数                                   | 说明               |
| --------- | -------------------------------------- | ------------------ |
| `before`  | `(params: P[])`                        | 数据加载前         |
| `success` | `(data: D, params: P[])`               | 数据加载完成       |
| `error`   | `(error: Error, params: P[])`          | 数据加载失败       |
| `finally` | `(params: P[], data?: D, err?: Error)` | 数据加载完成或失败 |

## 类型定义

```ts
export type RemoteRequestProps<P, D> = {
  /**
   * 异步接口方法
   */
  api: (params: P) => Promise<D>
  /**
   * 默认参数
   */
  defaultParams?: P
  /**
   * 是否手动触发请求
   */
  manual?: boolean
  /**
   * 内置参数的字段
   */
  fields?: DataRequestFields
  /**
   * 请求配置
   */
  requestOptions?: UseRequestOptions
  /**
   * 请求插件配置
   */
  requestPlugins?: UseRequestPlugin[]
}

export type RemoteRequestEmits<P, D> = {
  /**
   * 数据加载前
   */
  before: (params: P[]) => void
  /**
   * 数据加载完成
   */
  success: (data: D, params: P[]) => void
  /**
   * 数据加载失败
   */
  error: (error: Error, params: P[]) => void
  /**
   * 数据加载完成或失败
   */
  finally: (params: P[], data?: D, err?: Error) => void
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

function handleSuccess(data) {
  console.log('数据加载完成:', data)
}
</script>

<template>
  <RemoteRequest
    :api="fetchData"
    @success="handleSuccess"
  >
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

### 手动触发

```vue
<script setup>
import { RemoteRequest } from '@oiij/naive-ui'
import { ref } from 'vue'

const remoteRef = ref(null)

async function fetchData(params) {
  return await api.getData(params)
}

function handleRefresh() {
  remoteRef.value?.refresh()
}
</script>

<template>
  <button @click="handleRefresh">
    刷新数据
  </button>
  <RemoteRequest
    ref="remoteRef"
    :api="fetchData"
    :manual="true"
  />
</template>
```

### 带默认参数

```vue
<script setup>
import { RemoteRequest } from '@oiij/naive-ui'

async function fetchData(params) {
  return await api.getData(params)
}
</script>

<template>
  <RemoteRequest
    :api="fetchData"
    :default-params="{ page: 1, pageSize: 10 }"
  />
</template>
```
