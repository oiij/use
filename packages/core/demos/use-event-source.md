# UseEventSource

## 功能描述

**UseEventSource** 是一个用于处理 Server-Sent Events (SSE) 的 Vue 组合式函数，提供了完整的 SSE 连接管理、自动重连、消息解析和事件处理能力。它基于浏览器的原生 `EventSource` API，为 Vue 应用提供了更加便捷和响应式的 SSE 集成方案。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./use-event-source.vue" title="UseEventSource" />

## API

### `useEventSource(url?, options?)`

创建 SSE 连接。

#### 参数

| 参数      | 类型                              | 说明         |
| --------- | --------------------------------- | ------------ |
| `url`     | `MaybeRefOrGetter<string \| URL>` | SSE 连接地址 |
| `options` | `UseEventSourceOptions`           | 配置选项     |

#### UseEventSourceOptions

| 选项              | 类型                   | 默认值   | 说明           |
| ----------------- | ---------------------- | -------- | -------------- |
| `manual`          | `boolean`              | `false`  | 是否手动连接   |
| `autoRetry`       | `boolean \| AutoRetry` | -        | 自动重试配置   |
| `parseMessage`    | `boolean \| function`  | `false`  | 消息解析配置   |
| `handlerKey`      | `string`               | `'type'` | 消息处理器键名 |
| `withCredentials` | `boolean`              | `false`  | 是否携带凭据   |

#### 返回值

| 属性                             | 类型                              | 说明             |
| -------------------------------- | --------------------------------- | ---------------- |
| `source`                         | `ShallowRef<EventSource \| null>` | EventSource 实例 |
| `url`                            | `Ref<string \| URL \| undefined>` | 连接地址         |
| `status`                         | `Ref<State>`                      | 连接状态         |
| `data`                           | `Ref<any>`                        | 最新消息数据     |
| `dataRecord`                     | `Ref<any[]>`                      | 消息记录         |
| `error`                          | `Ref<Event \| null>`              | 错误信息         |
| `connect(url?, options?)`        | `Function`                        | 连接 SSE         |
| `close()`                        | `Function`                        | 关闭连接         |
| `destroy()`                      | `Function`                        | 销毁连接         |
| `registerHandler(type, handler)` | `Function`                        | 注册消息处理器   |
| `onOpen(callback)`               | `Function`                        | 连接打开事件     |
| `onMessage(callback)`            | `Function`                        | 消息接收事件     |
| `onError(callback)`              | `Function`                        | 错误事件         |

## 类型定义

```ts
export type State = 'CONNECTING' | 'OPEN' | 'CLOSED'

export type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}

export type UseEventSourceOptions<T extends HandlerType = HandlerType> = EventSourceInit & {
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean | ((raw: any) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  handlerKey?: string
}

export type UseEventSourceReturns = {
  source: ShallowRef<EventSource | null>
  url: Ref<string | URL | undefined>
  status: Ref<State>
  data: Ref<any>
  dataRecord: Ref<any[]>
  error: Ref<Event | null>
  connect: (url?: string | URL, options?: EventSourceInit) => void
  close: () => void
  destroy: () => void
  registerHandler: <K>(type: K, handler: (data: any) => void) => () => void
  onOpen: (callback: (event: Event) => void) => void
  onMessage: (callback: (event: MessageEvent) => void) => void
  onError: (callback: (event: Event) => void) => void
}

export declare function useEventSource<T, D>(url?: MaybeRefOrGetter<string | URL>, options?: UseEventSourceOptions<T>): UseEventSourceReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useEventSource } from '@oiij/use'

const { status, data, onMessage } = useEventSource('/api/events')

onMessage((event) => {
  console.log('收到消息:', event.data)
})
</script>

<template>
  <p>状态: {{ status }}</p>
  <p>数据: {{ data }}</p>
</template>
```

### 自动重试

```ts
import { useEventSource } from '@oiij/use'

const { status } = useEventSource('/api/events', {
  autoRetry: {
    retries: 3,
    delay: 1000,
    onFailed: () => {
      console.log('连接失败')
    }
  }
})
```

### 消息处理器

```ts
import { useEventSource } from '@oiij/use'

type EventTypes = {
  message: { content: string }
  notification: { title: string, body: string }
}

const { registerHandler } = useEventSource<EventTypes>('/api/events', {
  parseMessage: true
})

registerHandler('message', (data) => {
  console.log('消息:', data.content)
})

registerHandler('notification', (data) => {
  console.log('通知:', data.title, data.body)
})
```

### 手动连接

```ts
import { useEventSource } from '@oiij/use'

const { status, connect, close } = useEventSource('/api/events', {
  manual: true
})

function handleConnect() {
  connect()
}

function handleClose() {
  close()
}
```
