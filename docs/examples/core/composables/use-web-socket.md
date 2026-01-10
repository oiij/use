# UseWebSocket

## Demo

<demo vue="./demos/use-web-socket.vue" title="UseWebSocket" />

## Types

```ts
type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}
type UseWebsocketOptions = {
  protocols?: string | string[]
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean
  handlerKey?: string
}
type MessageRaw = any
type HandlerType = {
  [key: string]: any
}
type ReturnHandlerType<U> = { [K in keyof U]: {
  [key: string]: unknown
  type: K
  payload: U[K]
} }[keyof U]
declare function useWebSocket<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseWebsocketOptions): {
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
  reconnect: () => void
  close: () => void
  sendRaw: <D_1 extends string>(data: D_1) => void
  send: <D_1 extends object>(data: D_1) => void
  destroy: () => void
  registerHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => () => void
  cancelHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => void
  registerEvent: (type: string, handler: (ev: Event) => void) => void
  onOpen: _vueuse_core66.EventHookOn<Event>
  onMessage: _vueuse_core66.EventHookOn<MessageEvent<any>>
  onClose: _vueuse_core66.EventHookOn<CloseEvent>
  onError: _vueuse_core66.EventHookOn<Event>
}
type UseWebSocketReturns = ReturnType<typeof useWebSocket>
```
