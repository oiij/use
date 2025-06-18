# UseEventSource

## Demo

<demo vue="./demos/use-event-source.vue" title="UseEventSource" />

## Types

```ts
type State = 'CONNECTING' | 'OPEN' | 'CLOSED'
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}
type Options = EventSourceInit & {
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean
}
type MessageRaw = string | ArrayBuffer | Blob
interface MessageType {
  [key: string]: any
  type: string
}
declare function useEventSource<T extends MessageType, D extends MessageRaw>(url?: string | URL | Ref<string | URL>, options?: Options): {
  source: vue37.ShallowRef<EventSource | undefined, EventSource | undefined>
  url: Ref<string | URL | undefined, string | URL | undefined>
  status: Ref<State, State>
  data: Ref<D | undefined, D | undefined>
  dataRecord: Ref<D[], D[]>
  messageEvent: Ref<MessageEvent<D> | undefined, MessageEvent<D> | undefined>
  messageEventRecord: Ref<MessageEvent<D>[], MessageEvent<D>[]>
  error: Ref<Event | undefined, Event | undefined>
  controller: vue37.ShallowRef<AbortController, AbortController>
  connect: (url?: string | URL, options?: EventSourceInit) => void
  reconnect: () => void
  close: () => void
  destroy: () => void
  registerHandler: (type: T['type'], handler: (data: T) => void) => () => void
  cancelHandler: (type: T['type'], handler: (data: T) => void) => void
  registerEvent: (type: string, handler: (ev: MessageEvent<D>) => void) => void
  onOpen: _vueuse_core39.EventHookOn<Event>
  onMessage: _vueuse_core39.EventHookOn<MessageEvent<any>>
  onError: _vueuse_core39.EventHookOn<Event>
}
```
