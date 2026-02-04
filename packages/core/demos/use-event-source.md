# UseEventSource

## 功能描述

**UseEventSource** 是一个用于处理 Server-Sent Events (SSE) 的 Vue 组合式函数，提供了完整的 SSE 连接管理、自动重连、消息解析和事件处理能力。它基于浏览器的原生 `EventSource` API，为 Vue 应用提供了更加便捷和响应式的 SSE 集成方案。

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

<demo vue="./use-event-source.vue" title="UseEventSource" />

## API

### 函数签名

```ts
declare function useEventSource<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(
  url?: string | URL | Ref<string | URL>,
  options?: UseEventSourceOptions<T>
): UseEventSourceReturns
```

## 类型定义

```ts
export type State = 'CONNECTING' | 'OPEN' | 'CLOSED'

export type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}

export type MessageRaw = any

export type HandlerType = {
  [key: string]: any
}

export type UseEventSourceOptions<T extends HandlerType = HandlerType> = EventSourceInit & {
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  handlerKey?: string
}

export type UseEventSourceReturns = {
  source: ShallowRef<EventSource | null>
  url: Ref<string | URL | undefined>
  status: Ref<State>
  data: Ref<MessageRaw | null>
  dataRecord: Ref<MessageRaw[]>
  messageEvent: Ref<MessageEvent<MessageRaw> | null>
  messageEventRecord: Ref<MessageEvent<MessageRaw>[]>
  error: Ref<Event | null>
  controller: ShallowRef<AbortController>
  connect: (url?: string | URL, options?: EventSourceInit) => void
  close: () => void
  destroy: () => void
  registerHandler: <K extends keyof HandlerType>(type: K, handler: (data: HandlerType[K]) => void) => () => void
  cancelHandler: <K extends keyof T>(type: K, handler: (data: HandlerType[K]) => void) => void
  registerEvent: (type: string, handler: (ev: MessageEvent<MessageRaw>) => void) => void
  onOpen: EventHookOn<[Event]>
  onMessage: EventHookOn<[MessageEvent<MessageRaw>]>
  onError: EventHookOn<[Event]>
}
```
