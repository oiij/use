import { onUnmounted, ref, shallowRef } from 'vue'

type State = 'CONNECTING' | 'OPEN' | 'CLOSED'
const ReadyState: {
  [key: number]: State
} = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
}
type Options = EventSourceInit & {
  manual?: boolean
  parseMessage?: boolean
}
type MessageRaw = string | ArrayBuffer | Blob

interface MessageType {
  [key: string]: any
  type: string
}
export function useEventSource<T extends MessageType, D extends MessageRaw>(url?: string | URL, options?: Options) {
  const _url = ref<string | URL | undefined>(url)
  const _options = { manual: false, parseMessage: true, ...options } as Options
  const handlerMap = new Map<string, (data: T) => void>()
  const source = shallowRef<EventSource> ()
  const status = ref<State>('CLOSED')
  const error = ref<Event>()
  const data = ref<D>()
  const controller = shallowRef(new AbortController())

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
      _url.value = url
    }
    if (options) {
      Object.assign(_options, options)
    }
    if (!_url.value) {
      throw new Error('EventSource url is not defined')
    }
    source.value = new EventSource(_url.value, options)
    controller.value = new AbortController()
    source.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    source.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    source.value.addEventListener('close', onClose, { signal: controller.value.signal })
    source.value.addEventListener('error', onError, { signal: controller.value.signal })
  }
  function close() {
    if (!source.value) {
      throw new Error('EventSource is not connected')
    }
    source.value.close()
    setStatus()
  }

  function reconnect() {
    close()
    connect()
  }
  if (!_options.manual) {
    connect()
  }

  let onOpenFn: ((ev: Event) => void) | null = null
  function onOpen(ev: Event) {
    setStatus()
    if (onOpenFn && typeof onOpenFn === 'function') {
      onOpenFn(ev)
    }
  }

  let onMessageFn: ((ev: MessageEvent<D>) => void) | null = null
  function onMessage(ev: MessageEvent<D>) {
    setStatus()
    data.value = ev.data

    if (onMessageFn && typeof onMessageFn === 'function') {
      onMessageFn(ev)
    }
    if (_options.parseMessage && typeof ev.data === 'string') {
      try {
        const dataJson = JSON.parse(ev.data) as T
        if (dataJson && dataJson.type) {
          const handler = handlerMap.get(dataJson.type)
          if (handler) {
            handler(dataJson)
          }
        }
      }
      catch (error) {
        console.error('Failed to parse message:', error)
      }
    }
  }

  let onCloseFn: ((ev: MessageEvent<D>) => void) | null = null
  function onClose(ev: MessageEvent<D>) {
    setStatus()
    if (onCloseFn && typeof onCloseFn === 'function') {
      onCloseFn(ev)
    }
  }

  let onErrorFn: ((ev: Event) => void) | null = null
  function onError(ev: Event) {
    setStatus()
    error.value = ev
    if (onErrorFn && typeof onErrorFn === 'function') {
      onErrorFn(ev)
    }
  }

  function registerHandler(type: T['type'], handler: (data: T) => void) {
    handlerMap.set(type, handler)
  }

  function registerEvent(type: string, handler: (ev: MessageEvent<D>) => void) {
    if (source.value) {
      source.value.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  function destroy() {
    close()
    controller.value.abort()
    source.value = undefined
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    source,
    status,
    data,
    connect,
    reconnect,
    close,
    destroy,
    onOpen(fn: (ev: Event) => void) {
      onOpenFn = fn
    },
    onMessage(fn: (ev: MessageEvent<D>) => void) {
      onMessageFn = fn
    },
    onClose(fn: (ev: MessageEvent<D>) => void) {
      onCloseFn = fn
    },
    onError(fn: (ev: Event) => void) {
      onErrorFn = fn
    },
    registerHandler,
    registerEvent,
  }
}
