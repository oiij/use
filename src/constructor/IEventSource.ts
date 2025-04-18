import type { EventType } from 'mitt'
import mitt from 'mitt'

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
type IEventType = EventSourceEventMap & Record<EventType, unknown>
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

  #handlerMap = new Map<string, ((data: T) => void)[]>()
  #emitter = mitt<IEventType>()

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

  #onOpen(ev: Event) {
    this.#setStatus()
    this.#emit('open', ev)
  }

  #onMessage(ev: MessageEvent<D>) {
    this.#setStatus()
    this.data = ev.data

    this.#emit('message', ev)
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
    this.#emit('error', ev)
  }

  on = this.#emitter.on

  off = this.#emitter.off

  #emit = this.#emitter.emit

  registerHandler(type: T['type'], handler: (data: T) => void) {
    if (this.#handlerMap.has(type)) {
      this.#handlerMap.get(type)?.push(handler)
      return
    }
    this.#handlerMap.set(type, [handler])
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
