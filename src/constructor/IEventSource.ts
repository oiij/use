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
export class IEventSource<T extends MessageType, D extends MessageRaw = string> {
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
  source: EventSource | null = null
  status: State = 'CLOSED'

  error?: Event = undefined

  data?: D = undefined

  #controller = new AbortController()

  #setStatus() {
    if (this.source) {
      this.status = ReadyState[this.source.readyState]
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

  #onCloseFn: ((ev: MessageEvent<D>) => void) | null = null
  #onClose(ev: MessageEvent<D>) {
    this.#setStatus()
    if (this.#onCloseFn && typeof this.#onCloseFn === 'function') {
      this.#onCloseFn(ev)
    }
  }

  onClose(fn: (ev: MessageEvent<D>) => void) {
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
    if (this.source) {
      this.source.addEventListener(type, handler, { signal: this.#controller.signal })
    }
  }

  connect(url?: string) {
    if (this.source) {
      this.destroy()
    }
    if (url) {
      this.url = url
    }
    if (!this.url) {
      throw new Error('url is required')
    }
    this.source = new EventSource(this.url, this.#options)
    this.#controller = new AbortController()
    this.source.addEventListener('open', this.#onOpen, { signal: this.#controller.signal })
    this.source.addEventListener('message', this.#onMessage, { signal: this.#controller.signal })
    this.source.addEventListener('close', this.#onClose, { signal: this.#controller.signal })
    this.source.addEventListener('error', this.#onError, { signal: this.#controller.signal })
  }

  close() {
    if (!this.source) {
      throw new Error('source is not connected')
    }
    this.source.close()
  }

  reconnect() {
    this.close()
    this.connect()
  }

  destroy() {
    close()
    this.#controller.abort()
    this.source = null
  }
}
