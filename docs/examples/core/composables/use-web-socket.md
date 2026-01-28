# UseWebSocket

## Demo

<demo vue="./demos/use-web-socket.vue" title="UseWebSocket" />

## Types

```ts
// #region src/use-web-socket.d.ts
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
declare function useWebSocket<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseWebsocketOptions<T>): {
  socket: ShallowRef<WebSocket | null>
  url: Ref<string | URL | undefined, string | URL | undefined>
  status: Ref<State, State>
  data: Ref<D | null, D | null>
  dataRecord: Ref<D[], D[]>
  messageEvent: Ref<MessageEvent<D> | null, MessageEvent<D> | null>
  messageEventRecord: Ref<MessageEvent<D>[], MessageEvent<D>[]>
  error: Ref<Event | null, Event | null>
  controller: ShallowRef<AbortController>
  connect: (url?: string | URL, protocols?: string | string[]) => void
  close: () => void
  sendRaw: <D_1 extends string>(data: D_1) => void
  send: <D_1 extends object>(data: D_1) => void
  destroy: () => void
  registerHandler: <K$1 extends keyof T>(type: K$1, handler: (data: T[K$1]) => void) => () => void
  cancelHandler: <K$1 extends keyof T>(type: K$1, handler: (data: T[K$1]) => void) => void
  registerEvent: (type: string, handler: (ev: Event) => void) => void
  onOpen: _vueuse_core39.EventHookOn<[Event]>
  onMessage: _vueuse_core39.EventHookOn<[MessageEvent<any>]>
  onClose: _vueuse_core39.EventHookOn<[CloseEvent]>
  onError: _vueuse_core39.EventHookOn<[Event]>
}
type UseWebSocketReturns = ReturnType<typeof useWebSocket>
// #endregion
export { ReturnHandlerType, useWebSocket, UseWebsocketOptions, UseWebSocketReturns }
```
