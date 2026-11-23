import type { ChatAttachment, ChatAvailability, ChatMention, ChatMessage, ChatMessageStatus, ChatMessageType, ChatQuotedMessage, ChatSendInput, ChatUser, ServerWireMessage } from './types'
import type { ChatUploadPresign } from './upload'
import { createEventHook } from '@vueuse/core'
import { computed, getCurrentScope, onScopeDispose, ref } from 'vue'
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
  mentions?: string[]
  quoteId?: string
} {
  if (typeof input === 'string') {
    return { content: input }
  }
  return {
    content: input.content,
    type: input.type,
    metadata: input.metadata,
    attachments: input.attachments,
    mentions: input.mentions,
    quoteId: input.quoteId,
  }
}

function buildQuoteSnapshot(message: ChatMessage): ChatQuotedMessage {
  return {
    id: message.id,
    senderId: message.senderId,
    ...(message.sender?.name ? { senderName: message.sender.name } : {}),
    content: message.recalled ? '' : message.content,
    type: message.type,
    createdAt: message.createdAt,
    ...(message.recalled ? { recalled: true } : {}),
  }
}

/**
 * 通道输入
 * 支持直接传入通道标识，或传入带显示名称的对象
 * @example
 * const input: ChatRoomInput = { id: 'room-1', name: '需求讨论' }
 */
export type ChatRoomInput = string | {
  /** 通道标识，无默认值（必填） */
  id: string
  /** 通道显示名称，默认与 id 相同 */
  name?: string
}

/**
 * 通道状态
 * 描述单个通道的消息、未读数、输入状态与在线用户
 * @example
 * const room: ChatRoomState = {
 *   id: 'room-1',
 *   name: '需求讨论',
 *   messages: [],
 *   unread: 0,
 *   typingUsers: [],
 *   members: [],
 * }
 */
export type ChatRoomState = {
  /** 通道标识，无默认值（必填） */
  id: string
  /** 通道显示名称，默认为 id 的值 */
  name: string
  /** 该通道的消息列表，按创建时间正序，默认为 [] */
  messages: ChatMessage[]
  /** 未读消息数量，默认为 0 */
  unread: number
  /** 正在输入的用户标识列表，默认为 [] */
  typingUsers: string[]
  /** 该通道在线用户资料列表，默认为 [] */
  members: ChatUser[]
  /** 该通道最后一条消息，默认为 undefined */
  lastMessage?: ChatMessage
}

/**
 * {@link useChat} 的配置选项
 * @example
 * const options: UseChatOptions = {
 *   baseUrl: 'http://localhost:3000',
 *   userId: 'user-1',
 *   channels: [
 *     { id: 'room-1', name: '大厅' },
 *     { id: 'room-2', name: '技术讨论' },
 *   ],
 * }
 */
export type UseChatOptions = {
  /** 服务端地址（http/https），会自动推导为 ws/wss 地址，无默认值（必填） */
  baseUrl: string
  /** 当前用户标识，会拼接到 WebSocket 握手地址中，无默认值（必填） */
  userId: string
  /** 当前用户资料，用于本地乐观消息的发送者快照，默认为 undefined（从通道在线成员中匹配） */
  profile?: ChatUser
  /** 初始订阅的通道列表，默认为 []（可通过 `join` 动态新增） */
  channels?: ChatRoomInput[]
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
 * 实时消息管理
 *
 * 复用单条 WebSocket 连接订阅多个通道，统一管理连接、断线重连、心跳保活、离线队列、
 * 乐观更新、消息状态机、已读回执、输入状态、用户可用状态与媒体上传，同时维护各通道的未读数与在线用户。
 *
 * @example
 * ```ts
 * const { rooms, activeMessages, unreadTotal, switchTo, send, onMessage } = useChat({
 *   baseUrl: 'http://localhost:3000',
 *   userId: 'user-1',
 *   channels: [
 *     { id: 'lobby', name: '大厅' },
 *     { id: 'tech', name: '技术讨论' },
 *   ],
 * })
 *
 * onMessage(({ channelId, message }) => console.log(`[${channelId}]`, message.content))
 * switchTo('tech')
 * send('大家好')
 * ```
 */
export function useChat(options: UseChatOptions) {
  const {
    baseUrl,
    userId,
    profile,
    token,
    autoConnect = true,
    heartbeatInterval,
    reconnect = true,
    offlineQueueKey,
    typingTimeout = DEFAULT_TYPING_TIMEOUT,
    presign,
  } = options

  const rooms = ref<ChatRoomState[]>((options.channels ?? []).map(normalizeRoom))
  const activeId = ref(rooms.value[0]?.id ?? '')
  const connected = ref(false)
  const error = ref<Event | null>(null)
  const availability = ref<ChatAvailability>(profile?.availability ?? 'online')
  const statusText = ref<string | undefined>(profile?.statusText)

  const onMessageEvent = createEventHook<{ channelId: string, message: ChatMessage }>()
  const onStatusChangeEvent = createEventHook<{ channelId: string, id: string, status: ChatMessageStatus }>()
  const onConnectedEvent = createEventHook<void>()
  const onErrorEvent = createEventHook<Event>()
  const onTypingEvent = createEventHook<{ channelId: string, userId: string }>()
  const onReadEvent = createEventHook<{ channelId: string, userId: string, messageIds: string[] }>()
  const onMessageDeletedEvent = createEventHook<{ channelId: string, id: string }>()
  const onMessageRecalledEvent = createEventHook<ChatMessage>()
  const onMentionEvent = createEventHook<{ channelId: string, message: ChatMessage }>()

  const typingTimers = new Map<string, ReturnType<typeof setTimeout>>()
  const lastTypingAt = new Map<string, number>()

  const activeRoom = computed(() => rooms.value.find(room => room.id === activeId.value))
  const activeMessages = computed(() => activeRoom.value?.messages ?? [])
  const unreadTotal = computed(() => rooms.value.reduce((total, room) => total + room.unread, 0))

  const wsOrigin = baseUrl.replace(/^http/, 'ws')
  const wsUrl = `${wsOrigin}/ws?userId=${encodeURIComponent(userId)}${token ? `&token=${encodeURIComponent(token)}` : ''}`

  function normalizeRoom(input: ChatRoomInput): ChatRoomState {
    const id = typeof input === 'string' ? input : input.id
    const name = typeof input === 'string' ? input : input.name ?? input.id
    return { id, name, messages: [], unread: 0, typingUsers: [], members: [] }
  }

  function findRoom(channelId: string): ChatRoomState | undefined {
    return rooms.value.find(room => room.id === channelId)
  }

  function ensureRoom(channelId: string): ChatRoomState {
    const existing = findRoom(channelId)
    if (existing) {
      return existing
    }
    const room = normalizeRoom(channelId)
    rooms.value.push(room)
    return room
  }

  function resolveMentions(room: ChatRoomState, ids: string[] | undefined): ChatMention[] | undefined {
    if (!ids || ids.length === 0) {
      return undefined
    }
    const unique = [...new Set(ids.filter(id => typeof id === 'string' && id.length > 0))]
    if (unique.length === 0) {
      return undefined
    }
    return unique.map((id) => {
      const member = room.members.find(user => user.id === id)
      return member?.name ? { id, name: member.name } : { id }
    })
  }

  function resolveSender(room: ChatRoomState): ChatUser {
    const sender = profile ?? room.members.find(user => user.id === userId) ?? { id: userId }
    return {
      ...sender,
      id: userId,
      availability: availability.value,
      statusText: statusText.value,
    }
  }

  function upsert(room: ChatRoomState, message: ChatMessage): void {
    const index = room.messages.findIndex(item => item.id === message.id)
    if (index === -1) {
      room.messages.push(message)
    }
    else {
      room.messages[index] = message
    }
    if (!room.lastMessage || room.lastMessage.createdAt <= message.createdAt) {
      room.lastMessage = message
    }
  }

  function clearTyping(channelId: string, typingUserId: string): void {
    const key = `${channelId}:${typingUserId}`
    const timer = typingTimers.get(key)
    if (timer) {
      clearTimeout(timer)
      typingTimers.delete(key)
    }
    const room = findRoom(channelId)
    if (room) {
      room.typingUsers = room.typingUsers.filter(item => item !== typingUserId)
    }
  }

  function addTyping(channelId: string, typingUserId: string): void {
    if (typingUserId === userId) {
      return
    }
    const key = `${channelId}:${typingUserId}`
    const existing = typingTimers.get(key)
    if (existing) {
      clearTimeout(existing)
    }
    const room = ensureRoom(channelId)
    if (!room.typingUsers.includes(typingUserId)) {
      room.typingUsers = [...room.typingUsers, typingUserId]
    }
    typingTimers.set(key, setTimeout(clearTyping, typingTimeout, channelId, typingUserId))
  }

  function clearRoomTyping(channelId: string): void {
    const prefix = `${channelId}:`
    for (const [key, timer] of typingTimers) {
      if (!key.startsWith(prefix)) {
        continue
      }
      clearTimeout(timer)
      typingTimers.delete(key)
    }
  }

  function handleRead(wire: Extract<ServerWireMessage, { type: 'read' }>): void {
    const room = findRoom(wire.channelId)
    if (!room) {
      return
    }
    const ids = new Set(wire.messageIds)
    for (const message of room.messages) {
      if (!ids.has(message.id)) {
        continue
      }
      const readBy = message.readBy ?? []
      if (!readBy.includes(wire.userId)) {
        message.readBy = [...readBy, wire.userId]
      }
      if (message.senderId === userId && wire.userId !== userId && message.status !== 'read') {
        message.status = 'read'
        onStatusChangeEvent.trigger({ channelId: wire.channelId, id: message.id, status: 'read' })
      }
    }
  }

  function handleServerMessage(wire: ServerWireMessage): void {
    switch (wire.type) {
      case 'message': {
        const room = ensureRoom(wire.message.channelId)
        upsert(room, wire.message)
        if (room.id !== activeId.value && wire.message.senderId !== userId) {
          room.unread += 1
        }
        if (wire.message.senderId !== userId && wire.message.mentions?.some(item => item.id === userId)) {
          onMentionEvent.trigger({ channelId: wire.message.channelId, message: wire.message })
        }
        onMessageEvent.trigger({ channelId: wire.message.channelId, message: wire.message })
        break
      }
      case 'status': {
        const target = findRoom(wire.channelId)?.messages.find(item => item.id === wire.id)
        if (target) {
          target.status = wire.status
        }
        onStatusChangeEvent.trigger({ channelId: wire.channelId, id: wire.id, status: wire.status })
        break
      }
      case 'message-updated': {
        const room = findRoom(wire.message.channelId)
        if (room) {
          upsert(room, wire.message)
        }
        if (wire.message.recalled) {
          onMessageRecalledEvent.trigger(wire.message)
        }
        break
      }
      case 'message-deleted': {
        const room = findRoom(wire.channelId)
        if (room) {
          room.messages = room.messages.filter(item => item.id !== wire.id)
          room.lastMessage = room.messages[room.messages.length - 1]
        }
        onMessageDeletedEvent.trigger({ channelId: wire.channelId, id: wire.id })
        break
      }
      case 'history': {
        const room = ensureRoom(wire.channelId)
        const map = new Map(room.messages.map(item => [item.id, item]))
        for (const message of wire.messages) {
          map.set(message.id, message)
        }
        room.messages = [...map.values()].sort((a, b) => a.createdAt - b.createdAt)
        room.lastMessage = room.messages[room.messages.length - 1]
        break
      }
      case 'read':
        handleRead(wire)
        onReadEvent.trigger({ channelId: wire.channelId, userId: wire.userId, messageIds: wire.messageIds })
        break
      case 'typing':
        addTyping(wire.channelId, wire.userId)
        onTypingEvent.trigger({ channelId: wire.channelId, userId: wire.userId })
        break
      case 'presence': {
        ensureRoom(wire.channelId).members = wire.users
        const currentUser = wire.users.find(user => user.id === userId)
        if (currentUser?.availability) {
          availability.value = currentUser.availability
          statusText.value = currentUser.statusText
        }
        break
      }
      case 'error':
        error.value = new Event(wire.message)
        onErrorEvent.trigger(error.value)
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
      for (const room of rooms.value) {
        client.send({ type: 'subscribe', channelId: room.id })
      }
      client.send({
        type: 'set-presence',
        availability: availability.value,
        ...(statusText.value ? { statusText: statusText.value } : {}),
      })
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
   * 发送一条消息到指定通道（默认为当前激活通道），乐观插入一条 `sending` 状态的消息
   * 可通过 `mentions` 指定被 @ 的用户标识，通过 `quoteId` 引用回复已有消息
   * @param input 消息内容或带类型/元数据/附件/@提及/引用标识的发送输入
   * @param channelId 目标通道标识，默认为当前激活通道
   * @returns 客户端生成的消息标识，可用于后续状态追踪或重发
   * @example
   * ```ts
   * const id = send('你好')
   * send({
   *   content: '',
   *   type: 'image',
   *   attachments: [{ id: 'file-1', url: 'https://cdn.example.com/a.png', mimeType: 'image/png', size: 1024 }],
   * }, 'room-2')
   * send({ content: '@张三 看下这条', mentions: ['user-2'], quoteId: 'msg-1' })
   * ```
   */
  function send(input: ChatSendInput, channelId = activeId.value): string {
    const id = createMessageId()
    const { content, type, metadata, attachments, mentions: mentionIds, quoteId } = normalizeInput(input)
    const room = ensureRoom(channelId)
    const mentions = resolveMentions(room, mentionIds)
    const quoted = quoteId ? room.messages.find(item => item.id === quoteId) : undefined
    const quote = quoted ? buildQuoteSnapshot(quoted) : undefined
    upsert(room, {
      id,
      channelId,
      senderId: userId,
      sender: resolveSender(room),
      content,
      type: type ?? 'text',
      status: 'sending',
      createdAt: Date.now(),
      metadata,
      attachments,
      mentions,
      quote,
    })
    client.send({
      type: 'send',
      id,
      channelId,
      content,
      messageType: type,
      metadata,
      attachments,
      mentions: mentions?.map(item => item.id),
      quoteId,
    })
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
   * 上传文件并发送为指定通道的媒体消息
   * 消息类型默认根据文件 MIME 推导为 `image` / `video` / `audio` / `file`
   * @param file 浏览器 File 对象
   * @param options 发送配置，可指定目标通道、覆盖消息类型与文本内容并监听上传进度
   * @param options.channelId 目标通道标识，默认为当前激活通道
   * @param options.type 消息类型，默认按文件 MIME 推导
   * @param options.content 消息文本内容，默认为空字符串
   * @param options.mentions 被 @ 的用户标识列表，默认为 undefined
   * @param options.quoteId 引用回复的消息标识，默认为 undefined
   * @param options.onProgress 上传进度回调，参数为 0-100 的百分比
   * @returns 消息标识
   * @example
   * ```ts
   * await sendMedia(file, {
   *   channelId: 'room-2',
   *   content: '看这张图',
   *   onProgress: percent => console.log(percent),
   * })
   * ```
   */
  async function sendMedia(
    file: File,
    options: {
      channelId?: string
      type?: ChatMessageType
      content?: string
      mentions?: string[]
      quoteId?: string
      onProgress?: (percent: number) => void
    } = {},
  ): Promise<string> {
    const attachment = await uploadFile(file, { onProgress: options.onProgress })
    return send({
      content: options.content ?? '',
      type: options.type ?? resolveMediaType(attachment.mimeType),
      attachments: [attachment],
      mentions: options.mentions,
      quoteId: options.quoteId,
    }, options.channelId ?? activeId.value)
  }

  /**
   * 重新发送指定消息，将其状态重置为 `sending` 并再次投递
   * @param id 要重发的消息标识
   * @param channelId 消息所在通道标识，默认为当前激活通道
   * @example
   * ```ts
   * onStatusChange(({ id, status }) => {
   *   if (status === 'failed') resend(id)
   * })
   * ```
   */
  function resend(id: string, channelId = activeId.value): void {
    const target = findRoom(channelId)?.messages.find(item => item.id === id)
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
      mentions: target.mentions?.map(item => item.id),
      quoteId: target.quote?.id,
    })
  }

  /**
   * 切换当前激活通道，并将该通道未读数清零
   * @param channelId 目标通道标识
   * @example
   * ```ts
   * switchTo('room-2')
   * ```
   */
  function switchTo(channelId: string): void {
    const room = ensureRoom(channelId)
    activeId.value = channelId
    room.unread = 0
    client.send({ type: 'read', channelId })
  }

  /**
   * 标记指定通道为已读
   * @param channelId 目标通道标识，默认为当前激活通道
   * @param messageId 可选，仅标记该消息及之前的消息为已读；省略时标记通道内全部消息
   * @example
   * ```ts
   * markRead()
   * markRead('room-2')
   * markRead('room-2', 'msg-1')
   * ```
   */
  function markRead(channelId = activeId.value, messageId?: string): void {
    const room = findRoom(channelId)
    if (room) {
      room.unread = 0
    }
    client.send({ type: 'read', channelId, messageId })
  }

  /**
   * 在指定通道内按关键字检索历史消息，大小写不敏感
   * 请求经由 REST 接口完成，不会改动本地消息列表
   * @param channelId 目标通道标识
   * @param query 检索关键字
   * @param limit 最多返回的条数，默认为服务端设定的 20
   * @returns 命中的消息列表，按创建时间倒序
   * @example
   * ```ts
   * const hits = await search('room-1', '发票')
   * ```
   */
  async function search(channelId: string, query: string, limit?: number): Promise<ChatMessage[]> {
    const url = new URL(`${baseUrl.replace(/\/$/, '')}/channels/${encodeURIComponent(channelId)}/messages/search`)
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
   * 发送「正在输入」通知，按通道内置 2 秒节流避免频繁广播
   * @param channelId 目标通道标识，默认为当前激活通道
   * @example
   * ```ts
   * onInput(() => sendTyping())
   * ```
   */
  function sendTyping(channelId = activeId.value): void {
    const now = Date.now()
    const last = lastTypingAt.get(channelId) ?? 0
    if (now - last < TYPING_THROTTLE) {
      return
    }
    lastTypingAt.set(channelId, now)
    client.send({ type: 'typing', channelId })
  }

  /**
   * 设置当前用户的可用状态，并同步到所有已订阅通道的在线成员列表
   * 离线时仅更新本地状态，连接建立或重连后会自动同步到服务端
   * @param value 可用状态：在线、忙碌或离开
   * @param text 状态补充说明，省略或传入空字符串时清除，最长 100 个字符
   * @example
   * ```ts
   * setAvailability('busy', '会议中')
   * setAvailability('online')
   * ```
   */
  function setAvailability(value: ChatAvailability, text?: string): void {
    const normalizedText = text?.trim() || undefined
    availability.value = value
    statusText.value = normalizedText
    for (const room of rooms.value) {
      const member = room.members.find(user => user.id === userId)
      if (member) {
        member.availability = value
        member.statusText = normalizedText
      }
    }
    if (connected.value) {
      client.send({
        type: 'set-presence',
        availability: value,
        ...(normalizedText ? { statusText: normalizedText } : {}),
      })
    }
  }

  /**
   * 撤回指定消息（仅发送者可用），本地立即标记并广播给通道内其他客户端
   * @param id 要撤回的消息标识
   * @param channelId 消息所在通道标识，默认为当前激活通道
   * @example
   * ```ts
   * recallMessage('msg-1')
   * ```
   */
  function recallMessage(id: string, channelId = activeId.value): void {
    const target = findRoom(channelId)?.messages.find(item => item.id === id)
    if (target) {
      target.recalled = true
      target.content = ''
    }
    client.send({ type: 'recall', channelId, id })
  }

  /**
   * 编辑指定消息的内容，服务端广播给通道内其他客户端
   * @param id 要编辑的消息标识
   * @param content 新的消息内容
   * @param channelId 消息所在通道标识，默认为当前激活通道
   * @example
   * ```ts
   * editMessage('msg-1', '更新后的内容')
   * ```
   */
  function editMessage(id: string, content: string, channelId = activeId.value): void {
    client.send({ type: 'edit', channelId, id, content })
  }

  /**
   * 删除指定消息，服务端广播给通道内其他客户端
   * @param id 要删除的消息标识
   * @param channelId 消息所在通道标识，默认为当前激活通道
   * @example
   * ```ts
   * deleteMessage('msg-1')
   * ```
   */
  function deleteMessage(id: string, channelId = activeId.value): void {
    client.send({ type: 'delete', channelId, id })
  }

  /**
   * 动态新增并订阅一个通道，已存在时仅重新订阅
   * 当前没有激活通道时，新增的通道会自动成为激活通道
   * @param input 通道标识或带显示名称的通道输入
   * @example
   * ```ts
   * join({ id: 'room-3', name: '新会话' })
   * ```
   */
  function join(input: ChatRoomInput): void {
    const room = normalizeRoom(input)
    ensureRoom(room.id)
    if (!activeId.value) {
      activeId.value = room.id
    }
    client.send({ type: 'subscribe', channelId: room.id })
  }

  /**
   * 取消订阅并移除一个通道，移除后自动切换到剩余的第一个通道
   * @param channelId 要移除的通道标识
   * @example
   * ```ts
   * leave('room-2')
   * ```
   */
  function leave(channelId: string): void {
    client.send({ type: 'unsubscribe', channelId })
    clearRoomTyping(channelId)
    rooms.value = rooms.value.filter(room => room.id !== channelId)
    if (activeId.value === channelId) {
      activeId.value = rooms.value[0]?.id ?? ''
    }
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
      for (const timer of typingTimers.values()) {
        clearTimeout(timer)
      }
      typingTimers.clear()
      client.disconnect()
    })
  }

  return {
    rooms,
    activeId,
    activeRoom,
    activeMessages,
    unreadTotal,
    connected,
    error,
    availability,
    statusText,
    send,
    sendMedia,
    uploadFile,
    resend,
    switchTo,
    markRead,
    search,
    sendTyping,
    setAvailability,
    recallMessage,
    editMessage,
    deleteMessage,
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
    onMention: onMentionEvent.on,
  }
}

/**
 * {@link useChat} 的返回类型，包含通道列表、激活状态、操作方法与会话事件
 * @example
 * const chat: UseChatReturn = useChat({
 *   baseUrl: 'http://localhost:3000',
 *   userId: 'u1',
 *   channels: ['room-1'],
 * })
 */
export type UseChatReturn = ReturnType<typeof useChat>
