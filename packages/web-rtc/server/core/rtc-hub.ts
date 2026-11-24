import type { Peer } from 'crossws'
import type { RtcServerOptions } from './types'
import { randomUUID } from 'node:crypto'

const FORWARDABLE = new Set(['offer', 'answer', 'answer-ok', 'ice-candidate', 'bye'])
const KEY_PATTERN = /^[\w-]{1,64}$/
const DEFAULT_MAX_PAYLOAD = 64 * 1024
const DEFAULT_KEY_LENGTH = 8

type RawSignalMessage = {
  type?: string
  payload?: Record<string, unknown>
}

function safeSend(peer: Peer, message: string): void {
  try {
    peer.send(message)
  }
  catch {}
}

/**
 * 信令中心
 * 维护在线客户端标识与连接映射，负责注册分配标识、按目标转发信令、断开时广播 bye
 * @example
 * import { RtcHub } from '@oiij/web-rtc/server'
 * const hub = new RtcHub()
 */
export class RtcHub {
  private readonly options: RtcServerOptions
  private readonly peers = new Map<string, Peer>()
  private readonly keyByPeer = new WeakMap<Peer, string>()

  constructor(options: RtcServerOptions = {}) {
    this.options = options
  }

  /** 当前在线连接数 */
  get size(): number {
    return this.peers.size
  }

  /**
   * 列出全部在线标识
   * @returns 在线客户端标识数组
   * @example
   * hub.keys()
   */
  keys(): string[] {
    return [...this.peers.keys()]
  }

  /**
   * 注册一条连接并下发分配到的标识
   * @param peer 当前连接
   * @param requestedKey 客户端期望使用的标识，冲突或非法时自动重新分配
   * @returns 最终分配给该连接的标识
   * @example
   * const key = hub.register(peer, 'alice')
   */
  register(peer: Peer, requestedKey?: string): string {
    const key = this.resolveKey(requestedKey)
    this.peers.set(key, peer)
    this.keyByPeer.set(peer, key)
    safeSend(peer, JSON.stringify({ type: 'register', payload: { key } }))
    return key
  }

  /**
   * 注销一条连接并通知其他在线客户端
   * @param peer 即将关闭的连接
   * @example
   * hub.unregister(peer)
   */
  unregister(peer: Peer): void {
    const key = this.keyByPeer.get(peer)
    if (!key) {
      return
    }
    this.keyByPeer.delete(peer)
    this.peers.delete(key)
    const bye = JSON.stringify({ type: 'bye', payload: { key, from: key } })
    for (const other of this.peers.values()) {
      safeSend(other, bye)
    }
  }

  /**
   * 处理一条原始信令消息
   * 校验类型与目标后转发给对端，并在负载中注入发送方标识 `from`
   * @param peer 发送消息的连接
   * @param raw 原始 JSON 字符串
   * @example
   * hub.dispatch(peer, JSON.stringify({ type: 'offer', payload: { key: 'bob', desc } }))
   */
  dispatch(peer: Peer, raw: string): void {
    const from = this.keyByPeer.get(peer)
    if (!from) {
      return
    }
    if (raw.length > (this.options.maxPayloadSize ?? DEFAULT_MAX_PAYLOAD)) {
      safeSend(peer, JSON.stringify({ type: 'error', message: 'payload too large' }))
      return
    }
    let message: RawSignalMessage
    try {
      message = JSON.parse(raw) as RawSignalMessage
    }
    catch {
      safeSend(peer, JSON.stringify({ type: 'error', message: 'invalid json' }))
      return
    }
    if (!message || typeof message.type !== 'string' || !FORWARDABLE.has(message.type)) {
      safeSend(peer, JSON.stringify({ type: 'error', message: 'unsupported message type' }))
      return
    }
    const payload = message.payload ?? {}
    const target = typeof payload.key === 'string' ? this.peers.get(payload.key) : undefined
    if (!target) {
      safeSend(peer, JSON.stringify({ type: 'error', message: 'target peer not found' }))
      return
    }
    safeSend(target, JSON.stringify({ type: message.type, payload: { ...payload, from } }))
  }

  private resolveKey(requestedKey?: string): string {
    if (requestedKey && KEY_PATTERN.test(requestedKey) && !this.peers.has(requestedKey)) {
      return requestedKey
    }
    const generate = this.options.keyGenerator ?? (() => randomUUID().replace(/-/g, '').slice(0, DEFAULT_KEY_LENGTH))
    for (let index = 0; index < 10; index++) {
      const key = generate()
      if (KEY_PATTERN.test(key) && !this.peers.has(key)) {
        return key
      }
    }
    return Date.now().toString(36)
  }
}
