import { onUnmounted, ref, shallowRef } from 'vue'
import { IEventsMapper } from './constructor/index'

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
  const handlerMap = new Map<string, ((data: T) => void)[]>()
  const { emit, on, off } = new IEventsMapper<EventSourceEventMap>()
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

  function onOpen(ev: Event) {
    setStatus()
    emit('open', ev)
  }

  function onMessage(ev: MessageEvent<D>) {
    setStatus()
    data.value = ev.data

    emit('message', ev)
    if (_options.parseMessage && typeof ev.data === 'string') {
      try {
        const dataJson = JSON.parse(ev.data) as T
        if (dataJson && dataJson.type) {
          const handler = handlerMap.get(dataJson.type)
          handler?.forEach((f) => {
            f(dataJson)
          })
        }
      }
      catch (error) {
        console.error('Failed to parse message:', error)
      }
    }
  }

  function onError(ev: Event) {
    setStatus()
    error.value = ev
    emit('error', ev)
  }

  function registerHandler(type: T['type'], handler: (data: T) => void) {
    if (handlerMap.has(type)) {
      handlerMap.get(type)?.push(handler)
      return
    }
    handlerMap.set(type, [handler])
  }
  function cancelHandler(type: T['type'], handler: (data: T) => void) {
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
    on,
    off,
    registerHandler,
    cancelHandler,
    registerEvent,
  }
}
