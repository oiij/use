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
export class IWebSocket<T extends MessageType, D extends MessageRaw = string> {
  constructor(url?: string, options?: Options) {
    this.url = url
    this.#options = { ...options }
    if (!this.#options.manual) {
      this.connect()
    }
  }

  url: string | URL | undefined
  #options: Options = {
    parseMessage: true,
  }

  #handlerMap = new Map<string, (data: T) => void>()
  socket: WebSocket | null = null
  status: State = 'PENDING'

  error?: Event = undefined

  data?: D = undefined

  #controller = new AbortController()

  #setStatus() {
    if (this.socket) {
      this.status = ReadyState[this.socket.readyState]
    }
  }

  #onOpenFn: ((ev: Event) => void) | null = null
  #onOpen(ev: Event) {
    this.#setStatus()
    if (this.#onOpenFn && typeof this.#onOpenFn === 'function') {
      this.#onOpenFn(ev)
    }
  }

  onOpen(fn: (ev: Event) => void) {
    this.#onOpenFn = fn
  }

  #onMessageFn: ((ev: MessageEvent<D>) => void) | null = null
  #onMessage(ev: MessageEvent<D>) {
    this.#setStatus()
    this.data = ev.data

    if (this.#onMessageFn && typeof this.#onMessageFn === 'function') {
      this.#onMessageFn(ev)
    }
    if (this.#options.parseMessage && typeof ev.data === 'string') {
      try {
        const dataJson = JSON.parse(ev.data) as T
        if (dataJson && dataJson.type) {
          const handler = this.#handlerMap.get(dataJson.type)
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

  onMessage(fn: (ev: MessageEvent<D>) => void) {
    this.#onMessageFn = fn
  }

  #onCloseFn: ((ev: CloseEvent) => void) | null = null
  #onClose(ev: CloseEvent) {
    this.#setStatus()
    if (this.#onCloseFn && typeof this.#onCloseFn === 'function') {
      this.#onCloseFn(ev)
    }
  }

  onClose(fn: (ev: CloseEvent) => void) {
    this.#onCloseFn = fn
  }

  #onErrorFn: ((ev: Event) => void) | null = null
  #onError(ev: Event) {
    this.#setStatus()
    this.error = ev
    if (this.#onErrorFn && typeof this.#onCloseFn === 'function') {
      this.#onErrorFn(ev)
    }
  }

  onError(fn: (ev: Event) => void) {
    this.#onErrorFn = fn
  }

  registerHandler(type: T['type'], handler: (data: T) => void) {
    this.#handlerMap.set(type, handler)
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
    if (!this.socket) {
      throw new Error('socket is not connected')
    }
    this.socket.close()
  }

  reconnect() {
    this.close()
    this.connect()
  }

  send(data: any) {
    if (!this.socket) {
      throw new Error('socket is not connected')
    }
    this.socket.send(data)
  }

  destroy() {
    close()
    this.#controller.abort()
    this.socket = null
  }
}
