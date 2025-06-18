import type { Ref, ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watchEffect } from 'vue'

type State = 'CONNECTING' | 'OPEN' | 'CLOSED'
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}
const ReadyState: {
  [key: number]: State
} = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
}
type UseEventSourceOptions = EventSourceInit & {
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean
  handlerKey?: string
}
type MessageRaw = any
interface HandlerType {
  [key: string]: any
}

export function useEventSource<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseEventSourceOptions) {
  const { manual = false, autoRetry, parseMessage = false, handlerKey = 'type', ..._options } = options ?? {}
  const { retries = 3, delay = 1000, onFailed } = typeof autoRetry === 'boolean' ? {} : autoRetry ?? {}
  let retryCount = 0

  const urlRef: Ref<string | URL | undefined> = ref(toValue(url))

  watchEffect(() => {
    if (urlRef.value !== toValue(url)) {
      urlRef.value = toValue(url)
      close()
      if (!manual) {
        connect()
      }
    }
  })
  const handlerMap = new Map<keyof T, ((data: any) => void)[]>()
  const source: ShallowRef<EventSource | null> = shallowRef(null)

  const status: Ref<State> = ref('CLOSED')
  const error: Ref<Event | null> = ref(null)
  const data: Ref<D | null> = ref(null)
  const dataRecord: Ref<D[]> = ref([])
  const messageEvent: Ref<MessageEvent<D> | null> = ref(null)
  const messageEventRecord: Ref<MessageEvent<D>[]> = ref([])

  const controller: ShallowRef<AbortController> = shallowRef(new AbortController())

  const onOpenEvent = createEventHook<EventSourceEventMap['open']>()
  const onMessageEvent = createEventHook<EventSourceEventMap['message']>()
  const onErrorEvent = createEventHook<EventSourceEventMap['error']>()

  function setStatus() {
    if (source.value) {
      status.value = ReadyState[source.value.readyState]
    }
  }
  function connect(url?: string | URL, options?: EventSourceInit) {
    if (source.value) {
      destroy()
    }
    if (url) {
      urlRef.value = url
    }
    if (options) {
      Object.assign(_options, options)
    }
    if (!urlRef.value) {
      throw new Error('EventSource url is not defined')
    }
    source.value = new EventSource(urlRef.value, options)
    controller.value = new AbortController()
    source.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    source.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    source.value.addEventListener('error', onError, { signal: controller.value.signal })
  }
  function close() {
    source.value?.close()
    setStatus()
  }

  function reconnect() {
    close()
    connect()
  }
  if (!manual) {
    connect()
  }

  function onOpen(ev: Event) {
    setStatus()
    error.value = null
    data.value = null
    messageEvent.value = null
    retryCount = 0
    onOpenEvent.trigger(ev)
  }

  function onMessage(ev: MessageEvent<D>) {
    setStatus()
    data.value = ev.data
    dataRecord.value.push(ev.data)
    messageEvent.value = ev
    messageEventRecord.value.push(ev)
    onMessageEvent.trigger(ev)
    if (parseMessage && typeof ev.data === 'string') {
      try {
        const dataJson = JSON.parse(ev.data) as Record<keyof T, any> | null
        if (dataJson?.[handlerKey]) {
          handlerMap.get(dataJson[handlerKey])?.forEach((f) => {
            f(dataJson)
          })
        }
      }
      catch (err) {
        console.error('Failed to parse message:', err)
      }
    }
  }

  function onError(ev: Event) {
    setStatus()
    error.value = ev
    onErrorEvent.trigger(ev)
    if (autoRetry) {
      if (retryCount < retries) {
        retryCount++
        setTimeout(() => {
          reconnect()
        }, delay)
      }
      else {
        onFailed?.()
        retryCount = 0
      }
    }
  }

  function registerHandler<K extends keyof T>(type: K, handler: (data: { type: K, payload: T[K] }) => void) {
    if (!handlerMap.has(type)) {
      handlerMap.set(type, [])
    }
    handlerMap.get(type)?.push(handler)
    return () => cancelHandler(type, handler)
  }
  function cancelHandler<K extends keyof T>(type: K, handler: (data: { type: K, payload: T[K] }) => void) {
    if (handlerMap.has(type)) {
      handlerMap.set(type, handlerMap.get(type)?.filter(f => f !== handler) || [])
    }
  }
  function registerEvent(type: string, handler: (ev: MessageEvent<D>) => void) {
    if (source.value) {
      source.value.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  function destroy() {
    close()
    controller.value.abort()
    source.value = null
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    source,
    url: urlRef,
    status,
    data,
    dataRecord,
    messageEvent,
    messageEventRecord,
    error,
    controller,
    connect,
    reconnect,
    close,
    destroy,
    registerHandler,
    cancelHandler,
    registerEvent,
    onOpen: onOpenEvent.on,
    onMessage: onMessageEvent.on,
    onError: onErrorEvent.on,
  }
}
export type UseEventSourceReturns = ReturnType<typeof useEventSource>
