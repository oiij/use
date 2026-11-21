import type { ChatAttachment, ChatMessage, ChatMessageStatus, ChatMessageType, ChatSendInput, ChatUser, ServerWireMessage } from './types'
import type { ChatUploadPresign } from './upload'
import { createEventHook } from '@vueuse/core'
import { getCurrentScope, onScopeDispose, ref } from 'vue'
import { createLocalQueuePersistence, WsClient } from './_internal/ws-client'
import { uploadChatFile } from './upload'

const TYPING_THROTTLE = 2_000
const DEFAULT_TYPING_TIMEOUT = 4_000

function createMessageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function resolveMediaType(mimeType: string): ChatMessageType {
  if (mimeType.startsWith('image/')) {
    return 'image'
  }
  if (mimeType.startsWith('video/')) {
    return 'video'
  }
  if (mimeType.startsWith('audio/')) {
    return 'audio'
  }
  return 'file'
}

function normalizeInput(input: ChatSendInput): {
  content: string
  type?: ChatMessage['type']
  metadata?: Record<string, unknown>
  attachments?: ChatAttachment[]
} {
  if (typeof input === 'string') {
    return { content: input }
  }
  return { content: input.content, type: input.type, metadata: input.metadata, attachments: input.attachments }
}

/**
 * {@link useChatChannel} 的配置选项
 */
export type UseChatChannelOptions = {
  /** 服务端地址（http/https），会自动推导为 ws/wss 地址，无默认值（必填） */
  baseUrl: string
  /** 当前用户标识，会拼接到 WebSocket 握手地址中，无默认值（必填） */
  userId: string
  /** 要订阅的通道标识，无默认值（必填） */
  channelId: string
  /** 握手时携带的令牌，透传到服务端 `onConnect` 钩子，默认为 undefined */
  token?: string
  /** 是否在 composable 创建时自动建立连接，默认为 true */
  autoConnect?: boolean
  /** 心跳发送间隔（毫秒），默认为 25000 */
  heartbeatInterval?: number
  /** 连接断开后是否指数退避自动重连，默认为 true */
  reconnect?: boolean
  /** 离线发送队列的 localStorage 键名，提供后刷新页面仍可恢复未送达消息，默认为 undefined（不持久化） */
  offlineQueueKey?: string
  /** 他人「正在输入」状态的超时时间（毫秒），超过后自动清除，默认为 4000 */
  typingTimeout?: number
  /** 预签名直传回调，提供后可使用 `uploadFile` 与 `sendMedia` 上传媒体文件，默认为 undefined */
  presign?: ChatUploadPresign
}

/**
 * 连接一个实时消息通道，自动管理 WebSocket 生命周期
 *
 * 封装连接、断线重连、心跳保活、离线队列、乐观更新与消息状态机，
 * 对外暴露响应式状态、消息操作方法与事件钩子。
 *
 * @example
 * ```ts
 * const { messages, connected, send, onMessage, onError } = useChatChannel({
 *   baseUrl: 'http://localhost:3000',
 *   userId: 'user-1',
 *   channelId: 'room-1',
 * })
 *
 * onMessage(message => console.log('收到消息:', message.content))
 * onError(event => console.error('连接错误', event))
 *
 * send('你好，世界')
 * ```
 */
export function useChatChannel(options: UseChatChannelOptions) {
  const {
    baseUrl,
    userId,
    token,
    autoConnect = true,
    heartbeatInterval,
    reconnect = true,
    offlineQueueKey,
    typingTimeout = DEFAULT_TYPING_TIMEOUT,
    presign,
  } = options

  const currentChannelId = ref(options.channelId)
  const messages = ref<ChatMessage[]>([])
  const connected = ref(false)
  const error = ref<Event | null>(null)
  const typingUsers = ref<string[]>([])
  const members = ref<ChatUser[]>([])

  const typingTimers = new Map<string, ReturnType<typeof setTimeout>>()
  let lastTypingSentAt = 0

  const onMessageEvent = createEventHook<ChatMessage>()
  const onStatusChangeEvent = createEventHook<{ id: string, status: ChatMessageStatus }>()
  const onConnectedEvent = createEventHook<void>()
  const onErrorEvent = createEventHook<Event>()
  const onTypingEvent = createEventHook<{ channelId: string, userId: string }>()
  const onReadEvent = createEventHook<{ channelId: string, userId: string, messageIds: string[] }>()
  const onMessageDeletedEvent = createEventHook<{ channelId: string, id: string }>()
  const onMessageRecalledEvent = createEventHook<ChatMessage>()

  function clearTypingUser(id: string): void {
    const timer = typingTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      typingTimers.delete(id)
    }
    typingUsers.value = typingUsers.value.filter(item => item !== id)
  }

  function clearAllTyping(): void {
    for (const timer of typingTimers.values()) {
      clearTimeout(timer)
    }
    typingTimers.clear()
    typingUsers.value = []
  }

  function addTypingUser(id: string): void {
    if (id === userId) {
      return
    }
    const existing = typingTimers.get(id)
    if (existing) {
      clearTimeout(existing)
    }
    if (!typingUsers.value.includes(id)) {
      typingUsers.value = [...typingUsers.value, id]
    }
    typingTimers.set(id, setTimeout(clearTypingUser, typingTimeout, id))
  }

  const wsOrigin = baseUrl.replace(/^http/, 'ws')
  const wsUrl = `${wsOrigin}/ws?userId=${encodeURIComponent(userId)}${token ? `&token=${encodeURIComponent(token)}` : ''}`

  function upsert(message: ChatMessage): void {
    const list = messages.value
    const index = list.findIndex(item => item.id === message.id)
    if (index === -1) {
      list.push(message)
    }
    else {
      list[index] = message
    }
  }

  function handleServerMessage(wire: ServerWireMessage): void {
    switch (wire.type) {
      case 'message':
        upsert(wire.message)
        onMessageEvent.trigger(wire.message)
        break
      case 'status': {
        const target = messages.value.find(item => item.id === wire.id)
        if (target) {
          target.status = wire.status
        }
        onStatusChangeEvent.trigger({ id: wire.id, status: wire.status })
        break
      }
      case 'message-updated':
        upsert(wire.message)
        if (wire.message.recalled) {
          onMessageRecalledEvent.trigger(wire.message)
        }
        break
      case 'message-deleted':
        messages.value = messages.value.filter(item => item.id !== wire.id)
        onMessageDeletedEvent.trigger({ channelId: wire.channelId, id: wire.id })
        break
      case 'read': {
        const ids = new Set(wire.messageIds)
        for (const message of messages.value) {
          if (!ids.has(message.id)) {
            continue
          }
          const readBy = message.readBy ?? []
          if (!readBy.includes(wire.userId)) {
            message.readBy = [...readBy, wire.userId]
          }
          if (message.senderId === userId && wire.userId !== userId && message.status !== 'read') {
            message.status = 'read'
            onStatusChangeEvent.trigger({ id: message.id, status: 'read' })
          }
        }
        onReadEvent.trigger({ channelId: wire.channelId, userId: wire.userId, messageIds: wire.messageIds })
        break
      }
      case 'history': {
        const map = new Map(messages.value.map(item => [item.id, item]))
        for (const message of wire.messages) {
          map.set(message.id, message)
        }
        messages.value = [...map.values()].sort((a, b) => a.createdAt - b.createdAt)
        break
      }
      case 'error':
        error.value = new Event(wire.message)
        onErrorEvent.trigger(error.value)
        break
      case 'typing':
        addTypingUser(wire.userId)
        onTypingEvent.trigger({ channelId: wire.channelId, userId: wire.userId })
        break
      case 'presence':
        members.value = wire.users
        break
      case 'pong':
        break
    }
  }

  const client = new WsClient({
    url: wsUrl,
    heartbeatInterval,
    reconnect,
    queuePersistence: offlineQueueKey ? createLocalQueuePersistence(offlineQueueKey) : undefined,
    onMessage: handleServerMessage,
    onConnected: () => {
      connected.value = true
      client.send({ type: 'subscribe', channelId: currentChannelId.value })
      onConnectedEvent.trigger()
    },
    onDisconnected: () => {
      connected.value = false
    },
    onError: (event) => {
      error.value = event
      onErrorEvent.trigger(event)
    },
  })

  /**
   * 发送一条消息到当前通道，乐观插入一条 `sending` 状态的消息并返回其标识
   * @param input 消息内容或带类型/元数据/附件的发送输入
   * @returns 客户端生成的消息标识，可用于后续状态追踪或重发
   * @example
   * ```ts
   * const id = send('你好')
   * send({
   *   content: '',
   *   type: 'image',
   *   attachments: [{ id: 'file-1', url: 'https://cdn.example.com/a.png', mimeType: 'image/png', size: 1024 }],
   * })
   * ```
   */
  function send(input: ChatSendInput): string {
    const id = createMessageId()
    const { content, type, metadata, attachments } = normalizeInput(input)
    upsert({
      id,
      channelId: currentChannelId.value,
      senderId: userId,
      content,
      type: type ?? 'text',
      status: 'sending',
      createdAt: Date.now(),
      metadata,
      attachments,
    })
    client.send({ type: 'send', id, channelId: currentChannelId.value, content, messageType: type, metadata, attachments })
    return id
  }

  /**
   * 通过预签名地址上传单个文件，返回可直接发送的附件描述
   * 需要在 options 中配置 `presign`，上传过程不经过聊天服务
   * @param file 浏览器 File 对象
   * @param options 上传配置，可通过 `onProgress` 监听 0-100 的上传进度
   * @param options.onProgress 上传进度回调，参数为 0-100 的百分比
   * @returns 上传完成的附件描述
   * @example
   * ```ts
   * const attachment = await uploadFile(file, {
   *   onProgress: percent => console.log(`上传进度 ${percent}%`),
   * })
   * send({ content: '', type: 'image', attachments: [attachment] })
   * ```
   */
  async function uploadFile(
    file: File,
    options: { onProgress?: (percent: number) => void } = {},
  ): Promise<ChatAttachment> {
    if (!presign) {
      throw new Error('presign is required to upload files')
    }
    return uploadChatFile(file, { presign, onProgress: options.onProgress })
  }

  /**
   * 上传文件并直接发送为媒体消息
   * 消息类型默认根据文件 MIME 推导为 `image` / `video` / `audio` / `file`
   * @param file 浏览器 File 对象
   * @param options 发送配置，可覆盖消息类型、文本内容并监听上传进度
   * @param options.type 消息类型，默认按文件 MIME 推导
   * @param options.content 消息文本内容，默认为空字符串
   * @param options.onProgress 上传进度回调，参数为 0-100 的百分比
   * @returns 消息标识
   * @example
   * ```ts
   * await sendMedia(file, {
   *   content: '看这张图',
   *   onProgress: percent => console.log(percent),
   * })
   * ```
   */
  async function sendMedia(
    file: File,
    options: {
      type?: ChatMessageType
      content?: string
      onProgress?: (percent: number) => void
    } = {},
  ): Promise<string> {
    const attachment = await uploadFile(file, { onProgress: options.onProgress })
    return send({
      content: options.content ?? '',
      type: options.type ?? resolveMediaType(attachment.mimeType),
      attachments: [attachment],
    })
  }

  /**
   * 重新发送指定消息，将其状态重置为 `sending` 并再次投递
   * @param id 要重发的消息标识
   * @example
   * ```ts
   * onStatusChange(({ id, status }) => {
   *   if (status === 'failed') resend(id)
   * })
   * ```
   */
  function resend(id: string): void {
    const target = messages.value.find(item => item.id === id)
    if (!target) {
      return
    }
    target.status = 'sending'
    client.send({
      type: 'send',
      id,
      channelId: target.channelId,
      content: target.content,
      messageType: target.type,
      metadata: target.metadata,
      attachments: target.attachments,
    })
  }

  /**
   * 编辑指定消息的内容，服务端广播给通道内其他客户端
   * @param id 要编辑的消息标识
   * @param content 新的消息内容
   * @example
   * ```ts
   * editMessage('msg-1', '更新后的内容')
   * ```
   */
  function editMessage(id: string, content: string): void {
    client.send({ type: 'edit', channelId: currentChannelId.value, id, content })
  }

  /**
   * 删除指定消息，服务端广播给通道内其他客户端
   * @param id 要删除的消息标识
   * @example
   * ```ts
   * deleteMessage('msg-1')
   * ```
   */
  function deleteMessage(id: string): void {
    client.send({ type: 'delete', channelId: currentChannelId.value, id })
  }

  /**
   * 撤回指定消息（仅发送者可用），本地立即标记为已撤回并广播给通道内其他客户端
   * @param id 要撤回的消息标识
   * @example
   * ```ts
   * recallMessage('msg-1')
   * ```
   */
  function recallMessage(id: string): void {
    const target = messages.value.find(item => item.id === id)
    if (target) {
      target.recalled = true
      target.content = ''
    }
    client.send({ type: 'recall', channelId: currentChannelId.value, id })
  }

  /**
   * 发送「正在输入」通知，内置 2 秒节流避免频繁广播
   * @example
   * ```ts
   * onInput(() => sendTyping())
   * ```
   */
  function sendTyping(): void {
    const now = Date.now()
    if (now - lastTypingSentAt < TYPING_THROTTLE) {
      return
    }
    lastTypingSentAt = now
    client.send({ type: 'typing', channelId: currentChannelId.value })
  }

  /**
   * 标记当前通道为已读
   * @param messageId 可选，仅标记该消息及之前的消息为已读；省略时标记通道内全部消息
   * @example
   * ```ts
   * markRead()
   * markRead('msg-1')
   * ```
   */
  function markRead(messageId?: string): void {
    client.send({ type: 'read', channelId: currentChannelId.value, messageId })
  }

  /**
   * 在当前通道内按关键字检索历史消息，大小写不敏感
   * 请求经由 REST 接口完成，存储适配器实现检索下推时可获得更好的性能
   * @param query 检索关键字
   * @param limit 最多返回的条数，默认为服务端设定的 20
   * @returns 命中的消息列表，按创建时间倒序
   * @example
   * ```ts
   * const hits = await search('发票')
   * ```
   */
  async function search(query: string, limit?: number): Promise<ChatMessage[]> {
    const url = new URL(`${baseUrl.replace(/\/$/, '')}/channels/${encodeURIComponent(currentChannelId.value)}/messages/search`)
    url.searchParams.set('q', query)
    if (limit != null) {
      url.searchParams.set('limit', String(limit))
    }
    const headers: Record<string, string> = { 'x-chat-user': userId }
    if (token) {
      headers['x-chat-token'] = token
    }
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`search messages failed: ${response.status}`)
    }
    const data = await response.json() as { messages?: ChatMessage[] }
    return data.messages ?? []
  }

  /**
   * 切换到另一个通道：清空当前消息列表并订阅新通道
   * @param channelId 要加入的通道标识
   * @example
   * ```ts
   * join('room-2')
   * ```
   */
  function join(channelId: string): void {
    currentChannelId.value = channelId
    messages.value = []
    members.value = []
    clearAllTyping()
    client.send({ type: 'subscribe', channelId })
  }

  /**
   * 取消订阅当前通道，不再接收该通道的实时消息
   * @example
   * ```ts
   * leave()
   * ```
   */
  function leave(): void {
    client.send({ type: 'unsubscribe', channelId: currentChannelId.value })
  }

  /**
   * 主动断开连接，停止心跳与自动重连
   * @example
   * ```ts
   * disconnect()
   * ```
   */
  function disconnect(): void {
    client.disconnect()
  }

  if (autoConnect) {
    client.connect()
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      clearAllTyping()
      client.disconnect()
    })
  }

  return {
    messages,
    connected,
    error,
    typingUsers,
    members,
    channelId: currentChannelId,
    send,
    sendMedia,
    uploadFile,
    resend,
    editMessage,
    deleteMessage,
    recallMessage,
    sendTyping,
    markRead,
    search,
    join,
    leave,
    disconnect,
    onMessage: onMessageEvent.on,
    onStatusChange: onStatusChangeEvent.on,
    onConnected: onConnectedEvent.on,
    onError: onErrorEvent.on,
    onTyping: onTypingEvent.on,
    onRead: onReadEvent.on,
    onMessageDeleted: onMessageDeletedEvent.on,
    onMessageRecalled: onMessageRecalledEvent.on,
  }
}

/**
 * {@link useChatChannel} 的返回类型，包含响应式状态、消息操作方法与事件钩子
 * @example
 * const chat: UseChatChannelReturn = useChatChannel({ baseUrl: 'http://localhost:3000', userId: 'u1', channelId: 'c1' })
 */
export type UseChatChannelReturn = ReturnType<typeof useChatChannel>
