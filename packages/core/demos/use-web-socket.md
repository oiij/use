# UseWebSocket

## 功能描述

**UseWebSocket** 是一个用于处理 WebSocket 连接的 Vue 组合式函数，支持自动重连、消息处理和事件监听，可用于创建实时通信应用。

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

<demo vue="./use-web-socket.vue" title="UseWebSocket" />

## API

### `useWebSocket(url?, options?)`

创建 WebSocket 连接。

#### 参数

| 参数      | 类型                              | 说明               |
| --------- | --------------------------------- | ------------------ |
| `url`     | `MaybeRefOrGetter<string \| URL>` | WebSocket 连接地址 |
| `options` | `UseWebsocketOptions`             | 配置选项           |

#### UseWebsocketOptions

| 选项            | 类型                   | 默认值   | 说明           |
| --------------- | ---------------------- | -------- | -------------- |
| `protocols`     | `string \| string[]`   | -        | WebSocket 协议 |
| `manual`        | `boolean`              | `false`  | 是否手动连接   |
| `autoRetry`     | `boolean \| AutoRetry` | -        | 自动重试配置   |
| `parseMessage`  | `boolean \| function`  | `false`  | 消息解析配置   |
| `handlerKey`    | `string`               | `'type'` | 消息处理器键名 |
| `maxRecordSize` | `number`               | `100`    | 最大记录大小   |

#### 返回值

| 属性                             | 类型                              | 说明           |
| -------------------------------- | --------------------------------- | -------------- |
| `socket`                         | `ShallowRef<WebSocket \| null>`   | WebSocket 实例 |
| `url`                            | `Ref<string \| URL \| undefined>` | 连接地址       |
| `status`                         | `Ref<State>`                      | 连接状态       |
| `data`                           | `Ref<D \| null>`                  | 最新消息数据   |
| `dataRecord`                     | `Ref<D[]>`                        | 消息记录       |
| `error`                          | `Ref<Event \| null>`              | 错误信息       |
| `connect(url?, protocols?)`      | `Function`                        | 连接 WebSocket |
| `close()`                        | `Function`                        | 关闭连接       |
| `send(data)`                     | `Function`                        | 发送 JSON 数据 |
| `sendRaw(data)`                  | `Function`                        | 发送原始数据   |
| `destroy()`                      | `Function`                        | 销毁连接       |
| `registerHandler(type, handler)` | `Function`                        | 注册消息处理器 |
| `cancelHandler(type, handler)`   | `Function`                        | 取消消息处理器 |
| `onOpen(callback)`               | `Function`                        | 连接打开事件   |
| `onMessage(callback)`            | `Function`                        | 消息接收事件   |
| `onClose(callback)`              | `Function`                        | 连接关闭事件   |
| `onError(callback)`              | `Function`                        | 错误事件       |

## 类型定义

```ts
type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'

type AutoRetry = boolean | {
  /**
   * 最大重试次数
   * @default 3
   */
  retries?: number
  /**
   * 重试延迟（毫秒）
   * @default 1000
   */
  delay?: number
  /**
   * 重试失败回调
   */
  onFailed?: () => void
}

export type UseWebsocketOptions<T extends HandlerType = HandlerType> = {
  protocols?: string | string[]
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  handlerKey?: string
  maxRecordSize?: number
}

export type UseWebSocketReturns = {
  socket: ShallowRef<WebSocket | null>
  url: Ref<string | URL | undefined>
  status: Ref<State>
  data: Ref<any>
  dataRecord: Ref<any[]>
  error: Ref<Event | null>
  connect: (url?: string | URL, protocols?: string | string[]) => void
  close: () => void
  send: (data: object) => void
  sendRaw: (data: string) => void
  destroy: () => void
  registerHandler: <K>(type: K, handler: (data: any) => void) => () => void
  onOpen: (callback: (event: Event) => void) => void
  onMessage: (callback: (event: MessageEvent) => void) => void
  onClose: (callback: (event: CloseEvent) => void) => void
  onError: (callback: (event: Event) => void) => void
}

export declare function useWebSocket<T, D>(url?: MaybeRefOrGetter<string | URL>, options?: UseWebsocketOptions<T>): UseWebSocketReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useWebSocket } from '@oiij/use'

const { status, data, send, onMessage } = useWebSocket('wss://echo.websocket.org')

onMessage((event) => {
  console.log('收到消息:', event.data)
})

function sendPing() {
  send({ type: 'ping', timestamp: Date.now() })
}
</script>

<template>
  <p>状态: {{ status }}</p>
  <p>数据: {{ data }}</p>
  <button @click="sendPing">
    发送 Ping
  </button>
</template>
```

### 自动重试

```ts
import { useWebSocket } from '@oiij/use'

const { status, connect } = useWebSocket('wss://example.com', {
  autoRetry: {
    retries: 3,
    delay: 1000,
    onFailed: () => {
      console.log('连接失败，已达到最大重试次数')
    }
  }
})
```

### 消息处理器

```ts
import { useWebSocket } from '@oiij/use'

type MessageTypes = {
  ping: { timestamp: number }
  pong: { timestamp: number }
}

const { registerHandler, send } = useWebSocket<MessageTypes>('wss://example.com', {
  parseMessage: true
})

// 注册消息处理器
const unregister = registerHandler('pong', (data) => {
  console.log('收到 pong:', data.timestamp)
})

// 取消注册
unregister()

// 发送消息
send({ type: 'ping', timestamp: Date.now() })
```

### 手动连接

```ts
import { useWebSocket } from '@oiij/use'

const { status, connect, close } = useWebSocket('wss://example.com', {
  manual: true
})

function handleConnect() {
  connect()
}

function handleClose() {
  close()
}
```

### 响应式 URL

```vue
<script setup>
import { useWebSocket } from '@oiij/use'
import { ref } from 'vue'

const url = ref('wss://echo.websocket.org')
const { status, data, connect } = useWebSocket(url)

function changeUrl() {
  url.value = 'wss://other-server.com'
}
</script>

<template>
  <p>状态: {{ status }}</p>
  <button @click="changeUrl">
    更改 URL
  </button>
</template>
```
