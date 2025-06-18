import { createEventHook } from '@vueuse/core'

type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'
const ReadyState: {
  [key: number]: State
} = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
}
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}
interface UseWebsocketOptions {
  protocols?: string | string[]
  manual?: boolean
  parseMessage?: boolean
  autoRetry?: AutoRetry

}
type MessageRaw = string | ArrayBuffer | Blob
interface MessageType {
  [key: string]: any
  type: string
}

export class IWebSocket<T extends MessageType, D extends MessageRaw = string> {
  constructor(url?: string | URL, options?: UseWebsocketOptions) {
    this.url = url
    this.#options = { ...options }
    this.#options.autoRetry = typeof this.#options.autoRetry === 'boolean'
      ? {}
      : this.#options.autoRetry ?? {}
    if (this.#options.autoRetry) {
      const { retries = 3, delay = 1000, onFailed } = this.#options.autoRetry
      this.#onErrorEvent.on(() => {
        if (this.#retryCount < retries) {
          this.#retryCount++
          setTimeout(() => {
            this.reconnect()
          }, delay)
        }
        else {
          if (typeof onFailed === 'function') {
            onFailed()
            this.#retryCount = 0
          }
        }
      })
    }
    if (!this.#options.manual) {
      this.connect()
    }
  }

  url?: string | URL
  #options: UseWebsocketOptions = {
    parseMessage: false,
  }

  #retryCount = 0

  #handlerMap = new Map<string, ((data: T) => void)[]>()

  #onOpenEvent = createEventHook<WebSocketEventMap['open']>()
  #onMessageEvent = createEventHook<WebSocketEventMap['message']>()
  #onCloseEvent = createEventHook<WebSocketEventMap['close']>()
  #onErrorEvent = createEventHook<WebSocketEventMap['error']>()

  onOpen = this.#onOpenEvent.on
  onMessage = this.#onMessageEvent.on
  onClose = this.#onCloseEvent.on
  onError = this.#onErrorEvent.on

  socket: WebSocket | null = null
  status: State = 'PENDING'

  error: Event | null = null

  data: D | null = null
  dataRecord: D[] = []
  messageEvent: MessageEvent<D> | null = null
  messageEventRecord: MessageEvent<D>[] = []

  #controller = new AbortController()

  #setStatus() {
    if (this.socket) {
      this.status = ReadyState[this.socket.readyState]
    }
  }

  #onOpen(ev: Event) {
    this.#setStatus()
    this.error = null
    this.data = null
    this.messageEvent = null
    this.#onOpenEvent.trigger(ev)
  }

  #onMessage(ev: MessageEvent<D>) {
    this.#setStatus()
    this.data = ev.data
    this.dataRecord.push(ev.data)
    this.messageEvent = ev
    this.messageEventRecord.push(ev)
    this.#onMessageEvent.trigger(ev)
    if (this.#options.parseMessage && typeof ev.data === 'string') {
      try {
        const dataJson = JSON.parse(ev.data) as T
        if (dataJson && dataJson.type) {
          const handler = this.#handlerMap.get(dataJson.type)
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

  #onClose(ev: CloseEvent) {
    this.#setStatus()
    this.#onCloseEvent.trigger(ev)
  }

  #onError(ev: Event) {
    this.#setStatus()
    this.error = ev
    this.#onErrorEvent.trigger(ev)
  }

  registerHandler(type: T['type'], handler: (data: T) => void) {
    if (!this.#handlerMap.has(type)) {
      this.#handlerMap.set(type, [])
    }
    this.#handlerMap.get(type)?.push(handler)
    return () => this.cancelHandler(type, handler)
  }

  cancelHandler(type: T['type'], handler: (data: T) => void) {
    if (this.#handlerMap.has(type)) {
      this.#handlerMap.set(type, this.#handlerMap.get(type)?.filter(f => f !== handler) || [])
    }
  }

  registerEvent(type: string, handler: (ev: Event) => void) {
    if (this.socket) {
      this.socket.addEventListener(type, handler, { signal: this.#controller.signal })
    }
  }

  connect(url?: string, protocols?: string | string[]) {
    if (this.socket) {
      this.destroy()
    }
    if (url) {
      this.url = url
    }
    if (protocols) {
      this.#options.protocols = protocols
    }

    if (!this.url) {
      throw new Error('url is required')
    }
    this.socket = new WebSocket(this.url, this.#options.protocols)
    this.#controller = new AbortController()
    this.socket.addEventListener('open', this.#onOpen, { signal: this.#controller.signal })
    this.socket.addEventListener('message', this.#onMessage, { signal: this.#controller.signal })
    this.socket.addEventListener('close', this.#onClose, { signal: this.#controller.signal })
    this.socket.addEventListener('error', this.#onError, { signal: this.#controller.signal })
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }

  reconnect() {
    this.close()
    this.connect()
  }

  send(data: any) {
    if (this.socket) {
      this.socket.send(data)
    }
  }

  destroy() {
    close()
    this.#controller.abort()
    this.socket = null
  }
}
