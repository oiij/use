import type { Peer } from 'crossws'
import type { ChatAttachment, ChatAvailability, ChatChannel, ChatMention, ChatMessage, ChatQuotedMessage, ChatUser, ClientWireMessage, ServerWireMessage } from '../../src/types'
import type { ChatBroadcaster } from './broadcast/types'
import type { ChatMessageContext, ChatServerOptions } from './types'
import { createId } from './id'
import { resolveChatIdentity } from './identity'
import { MemoryStorage } from './storage/memory'

const DEFAULT_HEARTBEAT = 30_000
const DEFAULT_HISTORY_LIMIT = 50
const DEFAULT_SEARCH_LIMIT = 20
const MAX_MENTIONS = 50

function send(peer: Peer, message: ServerWireMessage): void {
  peer.send(JSON.stringify(message))
}

function normalizeAttachments(input: ChatAttachment[] | undefined): ChatAttachment[] | null | undefined {
  if (input == null) {
    return undefined
  }
  if (!Array.isArray(input)) {
    return null
  }
  const attachments: ChatAttachment[] = []
  for (const item of input) {
    if (
      !item
      || typeof item.url !== 'string'
      || item.url.length === 0
      || typeof item.mimeType !== 'string'
      || item.mimeType.length === 0
      || typeof item.size !== 'number'
      || !Number.isFinite(item.size)
    ) {
      return null
    }
    attachments.push({
      id: typeof item.id === 'string' && item.id ? item.id : createId(),
      url: item.url,
      mimeType: item.mimeType,
      size: item.size,
      ...(typeof item.name === 'string' && item.name ? { name: item.name } : {}),
      ...(typeof item.width === 'number' ? { width: item.width } : {}),
      ...(typeof item.height === 'number' ? { height: item.height } : {}),
      ...(typeof item.duration === 'number' ? { duration: item.duration } : {}),
      ...(typeof item.thumbnailUrl === 'string' && item.thumbnailUrl ? { thumbnailUrl: item.thumbnailUrl } : {}),
    })
  }
  return attachments
}

function normalizeMentionIds(input: string[] | undefined): string[] | null | undefined {
  if (input == null) {
    return undefined
  }
  if (!Array.isArray(input)) {
    return null
  }
  const ids: string[] = []
  for (const item of input) {
    if (typeof item !== 'string') {
      return null
    }
    if (item.length === 0 || ids.includes(item)) {
      continue
    }
    ids.push(item)
  }
  if (ids.length > MAX_MENTIONS) {
    return null
  }
  return ids.length > 0 ? ids : undefined
}

/**
 * 聊天消息总线
 * 负责通道订阅、消息持久化、广播分发与业务钩子调用，是后端的核心调度器
 * @example
 * import { ChatBus } from '@oiij/chat/server'
 * const bus = new ChatBus({ storage: new JsonFileStorage('./data') })
 */
export class ChatBus {
  private readonly options: ChatServerOptions
  private readonly storage: NonNullable<ChatServerOptions['storage']>
  private readonly heartbeat: number
  private readonly broadcaster?: ChatBroadcaster
  private readonly subscribers = new Map<string, Set<Peer>>()
  private readonly presenceStates = new Map<string, { availability: ChatAvailability, statusText?: string }>()

  constructor(options: ChatServerOptions = {}) {
    this.options = options
    this.storage = options.storage ?? new MemoryStorage()
    this.heartbeat = options.heartbeat ?? DEFAULT_HEARTBEAT
    this.broadcaster = options.broadcaster
    this.broadcaster?.onLocal(payload => this.deliverLocal(payload.channelId, payload.message))
  }

  /** 获取心跳间隔（毫秒） */
  getHeartbeat(): number {
    return this.heartbeat
  }

  /**
   * 连接鉴权
   * 从请求头或查询参数解析 userId 与 token，调用 onConnect 钩子决定是否放行
   * @returns 放行时返回 { userId }，拒绝时返回 null
   */
  async authenticate(request: Request): Promise<{ userId: string } | null> {
    const identity = resolveChatIdentity(request)
    if (!identity) {
      return null
    }
    if (this.options.onConnect) {
      const allowed = await this.options.onConnect({ ...identity, request })
      if (allowed === false) {
        return null
      }
    }
    return { userId: identity.userId }
  }

  /** 列出全部通道 */
  listChannels(): Promise<ChatChannel[]> | ChatChannel[] {
    return this.storage.listChannels()
  }

  /** 创建通道 */
  async createChannel(input: { name: string, participantIds?: string[], metadata?: Record<string, unknown> }): Promise<ChatChannel> {
    const now = Date.now()
    const channel: ChatChannel = {
      id: createId(),
      name: input.name,
      participantIds: input.participantIds ?? [],
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata,
    }
    await this.storage.saveChannel(channel)
    return channel
  }

  /** 分页列出通道历史消息，按创建时间正序（旧 → 新）返回 */
  async listMessages(channelId: string, options: { before?: number, limit?: number }): Promise<{ messages: ChatMessage[], hasMore: boolean }> {
    const limit = options.limit ?? DEFAULT_HISTORY_LIMIT
    const messages = await this.storage.listMessages(channelId, { before: options.before, limit: limit + 1 })
    const hasMore = messages.length > limit
    return { messages: messages.slice(0, limit).reverse(), hasMore }
  }

  /**
   * 按关键字检索通道内的消息
   * 存储适配器实现了 `searchMessages` 时下推检索，否则回退为内存过滤
   * @param channelId 目标通道标识
   * @param query 检索关键字，大小写不敏感
   * @param limit 最多返回的条数，默认为 20
   * @returns 命中的消息列表（按创建时间倒序）与是否存在更多结果
   */
  async searchMessages(channelId: string, query: string, limit = DEFAULT_SEARCH_LIMIT): Promise<{ messages: ChatMessage[], hasMore: boolean }> {
    const keyword = query.trim()
    if (!keyword) {
      return { messages: [], hasMore: false }
    }
    if (this.storage.searchMessages) {
      const messages = await this.storage.searchMessages(channelId, keyword, limit + 1)
      return { messages: messages.slice(0, limit), hasMore: messages.length > limit }
    }
    const all = await this.storage.listMessages(channelId, { limit: Number.MAX_SAFE_INTEGER })
    const lowered = keyword.toLowerCase()
    const matched = all.filter(message => message.content.toLowerCase().includes(lowered))
    return { messages: matched.slice(0, limit), hasMore: matched.length > limit }
  }

  /** 删除单条消息 */
  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    await this.storage.deleteMessage(channelId, messageId)
  }

  /**
   * 处理一条客户端 WebSocket 消息
   * @param peer 当前连接的 crossws Peer
   * @param wire 解析后的客户端协议消息
   */
  async handleMessage(peer: Peer, wire: ClientWireMessage): Promise<void> {
    switch (wire.type) {
      case 'subscribe':
        return this.handleSubscribe(peer, wire.channelId)
      case 'unsubscribe':
        this.handleUnsubscribe(peer, wire.channelId)
        return
      case 'send':
        return this.handleSend(peer, wire)
      case 'typing':
        return this.handleTyping(peer, wire.channelId)
      case 'read':
        return this.handleRead(peer, wire)
      case 'edit':
        return this.handleEdit(peer, wire)
      case 'delete':
        return this.handleDelete(peer, wire)
      case 'recall':
        return this.handleRecall(peer, wire)
      case 'set-presence':
        this.handleSetPresence(peer, wire)
        return
      case 'ping':
        send(peer, { type: 'pong' })
    }
  }

  private getUserId(peer: Peer): string {
    return (peer.context as { userId?: string }).userId ?? 'anonymous'
  }

  private async resolveProfile(userId: string): Promise<ChatUser> {
    const profile = await this.options.getUserProfile?.(userId)
    const presence = this.presenceStates.get(userId)
    const statusText = presence ? presence.statusText : profile?.statusText
    return {
      id: userId,
      ...(typeof profile?.name === 'string' ? { name: profile.name } : {}),
      ...(typeof profile?.avatar === 'string' ? { avatar: profile.avatar } : {}),
      availability: presence?.availability ?? profile?.availability ?? 'online',
      ...(typeof statusText === 'string' && statusText ? { statusText } : {}),
      ...(profile?.metadata && typeof profile.metadata === 'object' ? { metadata: profile.metadata } : {}),
    }
  }

  private async listUsers(channelId: string): Promise<ChatUser[]> {
    const peers = this.subscribers.get(channelId)
    if (!peers) {
      return []
    }
    const userIds = [...new Set([...peers].map(peer => this.getUserId(peer)))]
    return Promise.all(userIds.map(userId => this.resolveProfile(userId)))
  }

  private broadcastPresence(channelId: string): void {
    void this.emitPresence(channelId).catch(() => {})
  }

  private async emitPresence(channelId: string): Promise<void> {
    const peers = this.subscribers.get(channelId)
    if (!peers || peers.size === 0) {
      return
    }
    const users = await this.listUsers(channelId)
    if (!this.subscribers.has(channelId)) {
      return
    }
    this.deliverLocal(channelId, { type: 'presence', channelId, users })
  }

  private async handleSubscribe(peer: Peer, channelId: string): Promise<void> {
    peer.subscribe(channelId)
    const peers = this.subscribers.get(channelId)
    if (peers) {
      peers.add(peer)
    }
    else {
      this.subscribers.set(channelId, new Set([peer]))
      await this.broadcaster?.subscribe?.(channelId)
    }
    this.broadcastPresence(channelId)
    const { messages, hasMore } = await this.listMessages(channelId, { limit: DEFAULT_HISTORY_LIMIT })
    send(peer, { type: 'history', channelId, messages, hasMore })
  }

  private handleUnsubscribe(peer: Peer, channelId: string): void {
    peer.unsubscribe(channelId)
    const peers = this.subscribers.get(channelId)
    if (!peers) {
      return
    }
    peers.delete(peer)
    if (peers.size === 0) {
      this.subscribers.delete(channelId)
      void this.broadcaster?.unsubscribe?.(channelId)
      return
    }
    this.broadcastPresence(channelId)
  }

  /**
   * 清理一条连接的全部订阅
   * 连接关闭时由 WebSocket 生命周期钩子调用，避免订阅表残留已失效的连接
   * @param peer 即将关闭的 crossws Peer
   */
  removePeer(peer: Peer): void {
    const userId = this.getUserId(peer)
    for (const [channelId, peers] of this.subscribers) {
      peers.delete(peer)
      if (peers.size === 0) {
        this.subscribers.delete(channelId)
        void this.broadcaster?.unsubscribe?.(channelId)
        continue
      }
      this.broadcastPresence(channelId)
    }
    const connected = [...this.subscribers.values()].some(peers =>
      [...peers].some(item => this.getUserId(item) === userId),
    )
    if (!connected) {
      this.presenceStates.delete(userId)
    }
  }

  /**
   * 关闭消息总线
   * 释放跨实例广播适配器占用的订阅资源
   */
  async close(): Promise<void> {
    this.subscribers.clear()
    this.presenceStates.clear()
    await this.broadcaster?.close?.()
  }

  private deliverLocal(channelId: string, message: ServerWireMessage, exclude?: Peer): void {
    const peers = this.subscribers.get(channelId)
    if (!peers) {
      return
    }
    const raw = JSON.stringify(message)
    for (const peer of peers) {
      if (peer !== exclude) {
        peer.send(raw)
      }
    }
  }

  private broadcast(channelId: string, message: ServerWireMessage, exclude?: Peer): void {
    this.deliverLocal(channelId, message, exclude)
    void this.broadcaster?.publish(channelId, message)
  }

  private async handleSend(peer: Peer, wire: Extract<ClientWireMessage, { type: 'send' }>): Promise<void> {
    const userId = this.getUserId(peer)
    const attachments = normalizeAttachments(wire.attachments)
    if (attachments === null) {
      send(peer, { type: 'error', message: 'invalid attachment', refId: wire.id })
      return
    }
    if (attachments) {
      for (const attachment of attachments) {
        const allowed = await this.options.onAttachment?.({ attachment, userId, channelId: wire.channelId })
        if (allowed === false) {
          send(peer, { type: 'error', message: 'attachment is not allowed', refId: wire.id })
          return
        }
      }
    }
    const mentionIds = normalizeMentionIds(wire.mentions)
    if (mentionIds === null) {
      send(peer, { type: 'error', message: 'invalid mentions', refId: wire.id })
      return
    }
    let quote: ChatQuotedMessage | undefined
    if (wire.quoteId != null) {
      if (typeof wire.quoteId !== 'string' || wire.quoteId.length === 0) {
        send(peer, { type: 'error', message: 'invalid quoteId', refId: wire.id })
        return
      }
      const quoted = await this.getMessage(wire.channelId, wire.quoteId)
      if (!quoted) {
        send(peer, { type: 'error', message: 'quoted message not found', refId: wire.id })
        return
      }
      quote = {
        id: quoted.id,
        senderId: quoted.senderId,
        ...(quoted.sender?.name ? { senderName: quoted.sender.name } : {}),
        content: quoted.recalled ? '' : quoted.content,
        type: quoted.type,
        createdAt: quoted.createdAt,
        ...(quoted.recalled ? { recalled: true } : {}),
      }
    }
    let mentions: ChatMention[] | undefined
    if (mentionIds) {
      mentions = await Promise.all(mentionIds.map(async (id) => {
        const profile = await this.resolveProfile(id)
        return profile.name ? { id, name: profile.name } : { id }
      }))
    }
    const message: ChatMessage = {
      id: wire.id,
      channelId: wire.channelId,
      senderId: userId,
      sender: await this.resolveProfile(userId),
      content: wire.content,
      type: wire.messageType ?? 'text',
      status: 'sent',
      createdAt: Date.now(),
      metadata: wire.metadata,
      attachments,
      mentions,
      quote,
    }
    const ctx: ChatMessageContext = {
      userId,
      channelId: wire.channelId,
      broadcast: msg => this.broadcast(wire.channelId, { type: 'message', message: msg }, peer),
    }
    const result = await this.options.onMessage?.(ctx, message)
    const finalMessage = result ?? message
    await this.storage.saveMessage(finalMessage)
    this.broadcast(wire.channelId, { type: 'message', message: finalMessage }, peer)
    send(peer, { type: 'status', id: finalMessage.id, channelId: finalMessage.channelId, status: 'sent' })
  }

  private handleTyping(peer: Peer, channelId: string): void {
    this.broadcast(channelId, { type: 'typing', channelId, userId: this.getUserId(peer) }, peer)
  }

  private handleSetPresence(peer: Peer, wire: Extract<ClientWireMessage, { type: 'set-presence' }>): void {
    if (!['online', 'busy', 'away'].includes(wire.availability)) {
      send(peer, { type: 'error', message: 'invalid availability' })
      return
    }
    if (wire.statusText != null && typeof wire.statusText !== 'string') {
      send(peer, { type: 'error', message: 'invalid statusText' })
      return
    }
    const statusText = wire.statusText?.trim()
    if (statusText && statusText.length > 100) {
      send(peer, { type: 'error', message: 'statusText is too long' })
      return
    }
    const userId = this.getUserId(peer)
    this.presenceStates.set(userId, {
      availability: wire.availability,
      ...(statusText ? { statusText } : {}),
    })
    for (const [channelId, peers] of this.subscribers) {
      if ([...peers].some(item => this.getUserId(item) === userId)) {
        this.broadcastPresence(channelId)
      }
    }
  }

  private async handleRead(peer: Peer, wire: Extract<ClientWireMessage, { type: 'read' }>): Promise<void> {
    const userId = this.getUserId(peer)
    const messages = await this.storage.listMessages(wire.channelId, { limit: 5000 })
    let boundary = Number.POSITIVE_INFINITY
    if (wire.messageId) {
      const target = messages.find(message => message.id === wire.messageId)
      if (target) {
        boundary = target.createdAt
      }
    }
    const readIds: string[] = []
    for (const message of messages) {
      if (message.createdAt > boundary || message.senderId === userId) {
        continue
      }
      const readBy = message.readBy ?? []
      if (readBy.includes(userId)) {
        continue
      }
      message.readBy = [...readBy, userId]
      await this.storage.saveMessage(message)
      readIds.push(message.id)
    }
    if (readIds.length > 0) {
      this.broadcast(wire.channelId, { type: 'read', channelId: wire.channelId, userId, messageIds: readIds }, peer)
    }
  }

  private async handleRecall(peer: Peer, wire: Extract<ClientWireMessage, { type: 'recall' }>): Promise<void> {
    const userId = this.getUserId(peer)
    const message = await this.getMessage(wire.channelId, wire.id)
    if (!message) {
      return
    }
    if (message.senderId !== userId) {
      send(peer, { type: 'error', message: 'only the sender can recall a message', refId: wire.id })
      return
    }
    message.recalled = true
    message.content = ''
    await this.storage.saveMessage(message)
    this.broadcast(wire.channelId, { type: 'message-updated', channelId: wire.channelId, message }, peer)
  }

  private async getMessage(channelId: string, id: string): Promise<ChatMessage | null> {
    const list = await this.storage.listMessages(channelId, { limit: 1000 })
    return list.find(message => message.id === id) ?? null
  }

  private async handleEdit(peer: Peer, wire: Extract<ClientWireMessage, { type: 'edit' }>): Promise<void> {
    const message = await this.getMessage(wire.channelId, wire.id)
    if (!message) {
      return
    }
    message.content = wire.content
    await this.storage.saveMessage(message)
    this.broadcast(wire.channelId, { type: 'message-updated', channelId: wire.channelId, message }, peer)
  }

  private async handleDelete(peer: Peer, wire: Extract<ClientWireMessage, { type: 'delete' }>): Promise<void> {
    await this.storage.deleteMessage(wire.channelId, wire.id)
    this.broadcast(wire.channelId, { type: 'message-deleted', channelId: wire.channelId, id: wire.id }, peer)
  }
}
