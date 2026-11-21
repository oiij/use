import type { ClientWireMessage, ServerWireMessage } from '../types'

const DEFAULT_HEARTBEAT = 25_000
const RECONNECT_BASE = 1_000
const RECONNECT_MAX = 30_000

export type WsClientHandlers = {
  onMessage: (message: ServerWireMessage) => void
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: Event) => void
}

/**
 * 离线队列持久化适配器
 * 用于在页面刷新或应用重启后恢复尚未送达的发送消息
 * @example
 * const persistence: WsQueuePersistence = {
 *   load: () => JSON.parse(localStorage.getItem('chat-queue') ?? 'null'),
 *   save: queue => localStorage.setItem('chat-queue', JSON.stringify(queue)),
 * }
 */
export type WsQueuePersistence = {
  /** 读取上次持久化的待发送消息，无数据时返回 null，无默认值（必填） */
  load: () => ClientWireMessage[] | null
  /** 写入当前待发送消息队列，无默认值（必填） */
  save: (queue: ClientWireMessage[]) => void
}

/**
 * 创建基于 localStorage 的离线队列持久化适配器
 * 仅在存在 localStorage 的环境生效，持久化内容只包含 `send` 类型消息
 * @param key localStorage 键名
 * @returns 可直接传给 WsClient 的持久化适配器
 * @example
 * ```ts
 * const persistence = createLocalQueuePersistence('__CHAT_QUEUE__')
 * ```
 */
export function createLocalQueuePersistence(key: string): WsQueuePersistence {
  function getStorage(): Storage | null {
    if (typeof localStorage === 'undefined') {
      return null
    }
    return localStorage
  }

  return {
    load() {
      const storage = getStorage()
      if (!storage) {
        return null
      }
      try {
        const raw = storage.getItem(key)
        if (!raw) {
          return null
        }
        const parsed: unknown = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed as ClientWireMessage[] : null
      }
      catch {
        return null
      }
    },
    save(queue) {
      const storage = getStorage()
      if (!storage) {
        return
      }
      try {
        const pending = queue.filter(wire => wire.type === 'send')
        if (pending.length === 0) {
          storage.removeItem(key)
        }
        else {
          storage.setItem(key, JSON.stringify(pending))
        }
      }
      catch {
        // 存储不可用时忽略
      }
    },
  }
}

export type WsClientOptions = WsClientHandlers & {
  /** WebSocket 服务地址，无默认值（必填） */
  url: string
  /** 断开后是否自动重连，默认为 true */
  reconnect?: boolean
  /** 心跳间隔（毫秒），默认为 25000 */
  heartbeatInterval?: number
  /** 离线队列持久化适配器，默认为 undefined（仅保存在内存） */
  queuePersistence?: WsQueuePersistence
}

/**
 * 内部 WebSocket 客户端
 * 封装连接管理、指数退避重连、心跳保活与离线消息队列，不对外直接暴露
 */
export class WsClient {
  private readonly url: string
  private readonly reconnect: boolean
  private readonly heartbeatInterval: number
  private readonly handlers: WsClientHandlers
  private readonly queuePersistence?: WsQueuePersistence
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private queue: ClientWireMessage[] = []
  private manuallyClosed = false

  constructor(options: WsClientOptions) {
    this.url = options.url
    this.reconnect = options.reconnect ?? true
    this.heartbeatInterval = options.heartbeatInterval ?? DEFAULT_HEARTBEAT
    this.queuePersistence = options.queuePersistence
    this.handlers = {
      onMessage: options.onMessage,
      onConnected: options.onConnected,
      onDisconnected: options.onDisconnected,
      onError: options.onError,
    }
    const restored = this.queuePersistence?.load()
    if (restored) {
      this.queue = restored.filter(wire => wire?.type === 'send')
    }
  }

  /** 当前是否处于已连接状态 */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /** 建立连接，若已手动关闭则重置标志允许重连 */
  connect(): void {
    this.manuallyClosed = false
    this.open()
  }

  /** 主动断开连接，停止重连与心跳 */
  disconnect(): void {
    this.manuallyClosed = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.stopHeartbeat()
    this.ws?.close()
    this.ws = null
  }

  /** 发送一条协议消息；未连接时进入离线队列，连接恢复后自动补发 */
  send(wire: ClientWireMessage): void {
    if (this.isConnected) {
      this.ws!.send(JSON.stringify(wire))
    }
    else {
      this.queue.push(wire)
      this.persistQueue()
    }
  }

  private open(): void {
    const ws = new WebSocket(this.url)
    this.ws = ws
    ws.onopen = () => {
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.flushQueue()
      this.handlers.onConnected?.()
    }
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as ServerWireMessage
        this.handlers.onMessage(message)
      }
      catch {
        // 忽略格式错误的消息
      }
    }
    ws.onclose = () => {
      this.stopHeartbeat()
      this.handlers.onDisconnected?.()
      if (!this.manuallyClosed && this.reconnect) {
        this.scheduleReconnect()
      }
    }
    ws.onerror = (error) => {
      this.handlers.onError?.(error)
    }
  }

  private flushQueue(): void {
    while (this.queue.length > 0 && this.isConnected) {
      const wire = this.queue.shift()
      if (wire) {
        this.ws!.send(JSON.stringify(wire))
      }
    }
    this.persistQueue()
  }

  private persistQueue(): void {
    this.queuePersistence?.save(this.queue)
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'ping' })
    }, this.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return
    }
    const delay = Math.min(RECONNECT_BASE * 2 ** this.reconnectAttempts, RECONNECT_MAX)
    this.reconnectAttempts += 1
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.open()
    }, delay)
  }
}
