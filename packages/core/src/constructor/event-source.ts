import { createEventHook } from '@vueuse/core'

type State = 'CONNECTING' | 'OPEN' | 'CLOSED'
const ReadyState: {
  [key: number]: State
} = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
}
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}

type UseEventSourceOptions = EventSourceInit & {
  manual?: boolean
  parseMessage?: boolean
  autoRetry?: AutoRetry

}
type MessageRaw = string | ArrayBuffer | Blob

interface MessageType {
  [key: string]: any
  type: string
}

export class IEventSource<T extends MessageType, D extends MessageRaw = string> {
  constructor(url?: string, options?: UseEventSourceOptions) {
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
  #options: UseEventSourceOptions = {
    parseMessage: false,
  }

  #retryCount = 0
  #handlerMap = new Map<string, ((data: T) => void)[]>()

  #onOpenEvent = createEventHook<EventSourceEventMap['open']>()
  #onMessageEvent = createEventHook<EventSourceEventMap['message']>()
  #onErrorEvent = createEventHook<EventSourceEventMap['error']>()

  onOpen = this.#onOpenEvent.on
  onMessage = this.#onMessageEvent.on
  onError = this.#onErrorEvent.on

  source: EventSource | null = null
  status: State = 'CLOSED'

  error: Event | null = null

  data: D | null = null
  dataRecord: D[] = []
  messageEvent: MessageEvent<D> | null = null
  messageEventRecord: MessageEvent<D>[] = []

  #controller = new AbortController()

  #setStatus() {
    if (this.source) {
      this.status = ReadyState[this.source.readyState]
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
    this.source.addEventListener('error', this.#onError, { signal: this.#controller.signal })
  }

  close() {
    if (this.source) {
      this.source.close()
    }
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
