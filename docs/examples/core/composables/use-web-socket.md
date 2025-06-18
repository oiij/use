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
interface Options {
  protocols?: string | string[]
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean
}
type MessageRaw = string | ArrayBuffer | Blob
interface MessageType {
  [key: string]: any
  type: string
}
declare function useWebSocket<T extends MessageType, D extends MessageRaw>(url?: string | URL | Ref<string | URL>, options?: Options): {
  socket: vue59.ShallowRef<WebSocket | undefined, WebSocket | undefined>
  url: Ref<string | URL | undefined, string | URL | undefined>
  status: Ref<State, State>
  data: Ref<D | undefined, D | undefined>
  dataRecord: Ref<D[], D[]>
  messageEvent: Ref<MessageEvent<D> | undefined, MessageEvent<D> | undefined>
  messageEventRecord: Ref<MessageEvent<D>[], MessageEvent<D>[]>
  error: Ref<Event | undefined, Event | undefined>
  controller: vue59.ShallowRef<AbortController, AbortController>
  connect: (url?: string | URL, protocols?: string | string[]) => void
  reconnect: () => void
  close: () => void
  send: (data: any) => void
  destroy: () => void
  registerHandler: (type: T['type'], handler: (data: T) => void) => () => void
  cancelHandler: (type: T['type'], handler: (data: T) => void) => void
  registerEvent: (type: string, handler: (ev: Event) => void) => void
  onOpen: _vueuse_core61.EventHookOn<Event>
  onMessage: _vueuse_core61.EventHookOn<MessageEvent<any>>
  onClose: _vueuse_core61.EventHookOn<CloseEvent>
  onError: _vueuse_core61.EventHookOn<Event>
}
```
