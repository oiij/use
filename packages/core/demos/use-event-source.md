# UseEventSource

## Demo

<demo vue="./use-event-source.vue" title="UseEventSource" />

## Types

```ts
// #region src/use-event-source.d.ts
type State = 'CONNECTING' | 'OPEN' | 'CLOSED'
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}
type MessageRaw = any
type UseEventSourceOptions<T extends HandlerType = HandlerType> = EventSourceInit & {
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  handlerKey?: string
}
type HandlerType = {
  [key: string]: any
}
declare function useEventSource<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseEventSourceOptions<T>): {
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
  close: () => void
  destroy: () => void
  registerHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => () => void
  cancelHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => void
  registerEvent: (type: string, handler: (ev: MessageEvent<D>) => void) => void
  onOpen: _vueuse_core31.EventHookOn<[Event]>
  onMessage: _vueuse_core31.EventHookOn<[MessageEvent<any>]>
  onError: _vueuse_core31.EventHookOn<[Event]>
}
type UseEventSourceReturns = ReturnType<typeof useEventSource>
// #endregion
export { useEventSource, UseEventSourceOptions, UseEventSourceReturns }
```
