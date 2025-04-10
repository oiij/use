import { onUnmounted, ref, shallowRef } from 'vue'
import { IEventsMapper } from '../constructor/index'

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
  parseMessage?: boolean
}
type MessageRaw = string | ArrayBuffer | Blob
interface MessageType {
  [key: string]: any
  type: string
}
export function useWebSocket<T extends MessageType, D extends MessageRaw = string>(url?: string | URL, options?: Options) {
  const _url = ref<string | URL | undefined>(url)
  const _options: Options = { manual: false, parseMessage: true, ...options }
  const handlerMap = new Map<string, ((data: T) => void)[]>()
  const { emit, on, off } = new IEventsMapper<WebSocketEventMap>()
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

  function connect(url?: string | URL, protocols?: string | string[]) {
    if (socket.value) {
      destroy()
    }
    if (url) {
      _url.value = url
    }
    if (protocols) {
      _options.protocols = protocols
    }

    if (!_url.value) {
      throw new Error('WebSocket url is not defined')
    }
    socket.value = new WebSocket(_url.value, _options.protocols)
    controller.value = new AbortController()
    socket.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    socket.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    socket.value.addEventListener('close', onClose, { signal: controller.value.signal })
    socket.value.addEventListener('error', onError, { signal: controller.value.signal })
  }

  function close() {
    if (!socket.value) {
      throw new Error('WebSocket is not connected')
    }
    socket.value.close()
  }

  function reconnect() {
    close()
    connect()
  }

  if (!_options.manual) {
    connect()
  }

  function send(data: any) {
    if (!socket.value) {
      throw new Error('WebSocket is not connected')
    }
    socket.value.send(data)
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

  function onClose(ev: CloseEvent) {
    setStatus()
    emit('close', ev)
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
    url: _url,
    socket,
    status,
    data,
    connect,
    reconnect,
    close,
    send,
    destroy,
    on,
    off,
    registerHandler,
    cancelHandler,
    registerEvent,
  }
}
