import type { Ref, ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watchEffect } from 'vue'

type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'
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
  2: 'CLOSING',
  3: 'CLOSED',
}
interface UseWebsocketOptions {
  protocols?: string | string[]
  manual?: boolean
  autoRetry?: AutoRetry
  parseMessage?: boolean
  handlerKey?: string
}
type MessageRaw = any
interface HandlerType {
  [key: string]: any
}
export type ReturnHandlerType<U> = {
  [K in keyof U]: {
    [key: string]: unknown
    type: K
    payload: U[K]
  }
}[keyof U]
export function useWebSocket<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseWebsocketOptions) {
  const { manual = false, autoRetry, parseMessage = false, handlerKey = 'type', ..._options } = options ?? {}
  const { retries = 3, delay = 1000, onFailed } = typeof autoRetry === 'boolean' ? {} : autoRetry ?? {}
  let retryCount = 0

  const urlRef: Ref<string | URL | undefined> = ref(toValue(url))

  watchEffect(() => {
    if (urlRef.value !== toValue(url)) {
      urlRef.value = toValue(url)
      if (!manual) {
        connect()
      }
    }
  })
  const handlerMap = new Map<keyof T, ((data: any) => void)[]>()
  const socket: ShallowRef<WebSocket | null> = shallowRef (null)

  const status: Ref<State> = ref('PENDING')
  const error: Ref<Event | null> = ref(null)
  const data: Ref<D | null> = ref(null)
  const dataRecord: Ref<D[]> = ref([])
  const messageEvent: Ref<MessageEvent<D> | null> = ref(null)
  const messageEventRecord: Ref<MessageEvent<D>[]> = ref([])

  const controller: ShallowRef<AbortController> = shallowRef(new AbortController())

  const onOpenEvent = createEventHook<WebSocketEventMap['open']> ()
  const onMessageEvent = createEventHook<WebSocketEventMap['message']> ()
  const onCloseEvent = createEventHook<WebSocketEventMap['close']> ()
  const onErrorEvent = createEventHook<WebSocketEventMap['error']> ()

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
      urlRef.value = url
    }
    if (protocols) {
      _options.protocols = protocols
    }

    if (!urlRef.value) {
      throw new Error('WebSocket url is not defined')
    }
    socket.value = new WebSocket(urlRef.value, _options.protocols)
    controller.value = new AbortController()
    socket.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    socket.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    socket.value.addEventListener('close', onClose, { signal: controller.value.signal })
    socket.value.addEventListener('error', onError, { signal: controller.value.signal })
  }

  function close() {
    if (socket.value?.readyState === 1) {
      socket.value?.close()
    }
  }

  if (!manual) {
    connect()
  }

  function sendRaw<D extends string>(data: D) {
    socket.value?.send(data)
  }
  function send<D extends object>(data: D) {
    sendRaw(JSON.stringify(data))
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
        console.warn('Failed to parse message:', err)
      }
    }
  }

  function onClose(ev: CloseEvent) {
    setStatus()
    error.value = null
    data.value = null
    messageEvent.value = null
    onCloseEvent.trigger(ev)
  }

  function onError(ev: Event) {
    setStatus()
    error.value = ev
    onErrorEvent.trigger(ev)
    if (autoRetry) {
      if (retryCount < retries) {
        retryCount++
        setTimeout(() => {
          connect()
        }, delay)
      }
      else {
        onFailed?.()
        retryCount = 0
      }
    }
  }

  function registerHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    if (!handlerMap.has(type)) {
      handlerMap.set(type, [])
    }
    handlerMap.get(type)?.push(handler)
    return () => cancelHandler(type, handler)
  }
  function cancelHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
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
    socket.value = null
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    socket,
    url: urlRef,
    status,
    data,
    dataRecord,
    messageEvent,
    messageEventRecord,
    error,
    controller,
    connect,
    close,
    sendRaw,
    send,
    destroy,
    registerHandler,
    cancelHandler,
    registerEvent,
    onOpen: onOpenEvent.on,
    onMessage: onMessageEvent.on,
    onClose: onCloseEvent.on,
    onError: onErrorEvent.on,
  }
}
export type UseWebSocketReturns = ReturnType<typeof useWebSocket>
