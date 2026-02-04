# UseWebSocket

## 功能描述

**UseWebSocket** 是一个用于处理 WebSocket 连接的 Vue 组合式函数，支持自动重连、消息处理和事件监听，可用于创建实时通信应用。

## 安装

```bash
# 使用 npm
npm install @use/core

# 使用 yarn
yarn add @use/core

# 使用 pnpm
pnpm add @use/core
```

## 基本使用

<demo vue="./use-web-socket.vue" title="UseWebSocket" />

## API

### 函数签名

```ts
declare function useWebSocket<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseWebsocketOptions<T>): UseWebSocketReturns
```

## 类型定义

```ts
type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}
type MessageRaw = any
type UseWebsocketOptions<T extends HandlerType = HandlerType> = {
  protocols?: string | string[]
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  handlerKey?: string
}
type HandlerType = {
  [key: string]: any
}
type ReturnHandlerType<U> = { [K in keyof U]: {
  [key: string]: unknown
  type: K
  payload: U[K]
} }[keyof U]

export type UseWebSocketReturns = {
  socket: ShallowRef<WebSocket | null>
  url: Ref<string | URL | undefined>
  status: Ref<State>
  data: Ref<D | null>
  dataRecord: Ref<D[]>
  messageEvent: Ref<MessageEvent<D> | null>
  messageEventRecord: Ref<MessageEvent<D>[]>
  error: Ref<Event | null>
  controller: ShallowRef<AbortController>
  connect: (url?: string | URL, protocols?: string | string[]) => void
  close: () => void
  sendRaw: <D_1 extends string>(data: D_1) => void
  send: <D_1 extends object>(data: D_1) => void
  destroy: () => void
  registerHandler: <K$1 extends keyof T>(type: K$1, handler: (data: T[K$1]) => void) => () => void
  cancelHandler: <K$1 extends keyof T>(type: K$1, handler: (data: T[K$1]) => void) => void
  registerEvent: (type: string, handler: (ev: Event) => void) => void
  onOpen: EventHookOn<[Event]>
  onMessage: EventHookOn<[MessageEvent<any>]>
  onClose: EventHookOn<[CloseEvent]>
  onError: EventHookOn<[Event]>
}

export { ReturnHandlerType, useWebSocket, UseWebsocketOptions, UseWebSocketReturns }
```
