import type { EventType } from 'mitt'
import mitt from 'mitt'

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
type IEventType = WebSocketEventMap & Record<EventType, unknown>

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

  #handlerMap = new Map<string, ((data: T) => void)[]>()
  #emitter = mitt<IEventType>()
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

  #onClose(ev: CloseEvent) {
    this.#setStatus()
    this.#emit('close', ev)
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
