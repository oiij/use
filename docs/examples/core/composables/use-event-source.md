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
type UseEventSourceOptions = EventSourceInit & {
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean
  handlerKey?: string
}
type MessageRaw = any
type HandlerType = {
  [key: string]: any
}
declare function useEventSource<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseEventSourceOptions): {
  source: ShallowRef<EventSource | null>
  url: Ref<string | URL | undefined, string | URL | undefined>
  status: Ref<State, State>
  data: Ref<D | null, D | null>
  dataRecord: Ref<D[], D[]>
  messageEvent: Ref<MessageEvent<D> | null, MessageEvent<D> | null>
  messageEventRecord: Ref<MessageEvent<D>[], MessageEvent<D>[]>
  error: Ref<Event | null, Event | null>
  controller: ShallowRef<AbortController>
  connect: (url?: string | URL, options?: EventSourceInit) => void
  reconnect: () => void
  close: () => void
  destroy: () => void
  registerHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => () => void
  cancelHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => void
  registerEvent: (type: string, handler: (ev: MessageEvent<D>) => void) => void
  onOpen: _vueuse_core42.EventHookOn<Event>
  onMessage: _vueuse_core42.EventHookOn<MessageEvent<any>>
  onError: _vueuse_core42.EventHookOn<Event>
}
type UseEventSourceReturns = ReturnType<typeof useEventSource>
```
