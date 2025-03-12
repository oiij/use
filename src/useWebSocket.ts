import { onUnmounted, ref, shallowRef } from 'vue'

type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'
const ReadyState: {
  [key: number]: State
} = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
}
interface Options {
  protocols?: string | string[]
  manual?: boolean
}
type MessageRaw = string | ArrayBuffer | Blob
interface MessageType {
  [key: string]: any
  type: string
}
export function useWebSocket<T extends MessageType, D extends MessageRaw = string>(url: string | URL, options?: Options) {
  const _options = { manual: false, ...options } as Options
  const handlerMap = new Map<string, (data: T) => void>()
  const socket = shallowRef<WebSocket> ()
  const status = ref<State>('PENDING')
  const error = ref<Event>()
  const data = ref<D>()
  const controller = shallowRef(new AbortController())
  function setStatus() {
    if (socket.value) {
      status.value = ReadyState[socket.value.readyState]
    }
  }

  function connect(protocols?: string | string[]) {
    if (socket.value) {
      destroy()
    }
    if (protocols) {
      _options.protocols = protocols
    }
    socket.value = new WebSocket(url, _options.protocols)
    controller.value = new AbortController()
    socket.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    socket.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    socket.value.addEventListener('close', onClose, { signal: controller.value.signal })
    socket.value.addEventListener('error', onError, { signal: controller.value.signal })
  }

  function close() {
    if (socket.value) {
      socket.value.close()
    }
  }

  function reconnect() {
    close()
    connect()
  }

  if (!_options.manual) {
    connect()
  }

  function send(data: any) {
    if (socket.value) {
      socket.value.send(data)
    }
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
    if (typeof ev.data === 'string') {
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

  let onCloseFn: ((ev: CloseEvent) => void) | null = null
  function onClose(ev: CloseEvent) {
    setStatus()
    if (onCloseFn && typeof onCloseFn === 'function') {
      onCloseFn(ev)
    }
  }

  let onErrorFn: ((ev: Event) => void) | null = null
  function onError(ev: Event) {
    setStatus()
    error.value = ev
    if (onErrorFn && typeof onCloseFn === 'function') {
      onErrorFn(ev)
    }
  }

  function registerHandler(type: T['type'], handler: (data: T) => void) {
    handlerMap.set(type, handler)
  }

  function registerEvent(type: string, handler: (ev: Event) => void) {
    if (socket.value) {
      socket.value.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  function destroy() {
    close()
    controller.value.abort()
    socket.value = undefined
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    socket,
    status,
    data,
    connect,
    reconnect,
    close,
    send,
    destroy,
    onOpen(fn: (ev: Event) => void) {
      onOpenFn = fn
    },
    onMessage(fn: (ev: MessageEvent<D>) => void) {
      onMessageFn = fn
    },
    onClose(fn: (ev: CloseEvent) => void) {
      onCloseFn = fn
    },
    onError(fn: (ev: Event) => void) {
      onErrorFn = fn
    },
    registerHandler,
    registerEvent,
  }
}
