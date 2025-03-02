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
interface MessageType {
  type: string
  data: any
}
export function useWebSocket<T extends MessageType>(url: string | URL, options?: Options) {
  const _options = {
    manual: false,
    ...options,
  } as Options
  const handlerMap = new Map<string, (data: any) => void>()
  const socket = shallowRef<WebSocket> ()
  const status = ref<State>('PENDING')
  const error = ref<Event>()
  const data = ref<T>()
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
    socket.value.addEventListener('open', onOpen)
    socket.value.addEventListener('message', onMessage)
    socket.value.addEventListener('close', onClose)
    socket.value.addEventListener('error', onError)
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
    if (onOpenFn) {
      onOpenFn(ev)
    }
  }
  let onMessageFn: ((ev: MessageEvent) => void) | null = null
  function onMessage(ev: MessageEvent) {
    setStatus()
    if (onMessageFn) {
      onMessageFn(ev)
    }
    try {
      const dataJson = JSON.parse(ev.data) as T
      data.value = ev.data
      if (dataJson && dataJson.type) {
        const handler = handlerMap.get(dataJson.type)
        if (handler) {
          handler(dataJson.data)
        }
      }
    }
    catch (error) {
      console.error('Failed to parse message:', error)
    }
  }
  let onCloseFn: ((ev: CloseEvent) => void) | null = null
  function onClose(ev: CloseEvent) {
    setStatus()
    if (onCloseFn) {
      onCloseFn(ev)
    }
  }
  let onErrorFn: ((ev: Event) => void) | null = null
  function onError(ev: Event) {
    setStatus()
    error.value = ev
    if (onErrorFn) {
      onErrorFn(ev)
    }
  }
  function registerHandler(type: string, handler: (data: any) => void) {
    handlerMap.set(type, handler)
  }
  function destroy() {
    close()
    socket.value?.removeEventListener('open', onOpen)
    socket.value?.removeEventListener('message', onMessage)
    socket.value?.removeEventListener('close', onClose)
    socket.value?.removeEventListener('error', onError)
    socket.value = undefined
    onOpenFn = null
    onMessageFn = null
    onCloseFn = null
    onErrorFn = null
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
    onMessage(fn: (ev: MessageEvent<T>) => void) {
      onMessageFn = fn
    },
    onClose(fn: (ev: CloseEvent) => void) {
      onCloseFn = fn
    },
    onError(fn: (ev: Event) => void) {
      onErrorFn = fn
    },
    registerHandler,
  }
}
