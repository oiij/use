/**
 * 消息状态
 * - sending: 客户端已发出，等待服务端确认
 * - sent: 服务端已接收
 * - delivered: 已投递到其他在线客户端
 * - read: 已被读
 * - failed: 发送失败
 */
export type ChatMessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

/**
 * 消息类型
 * 内置 'text' 文本消息与 'system' 系统消息，业务方可传入任意自定义类型字符串
 * @example
 * const type: ChatMessageType = 'text'
 */
export type ChatMessageType = 'text' | 'system' | (string & {})

/**
 * 聊天用户资料
 * 描述参与聊天的用户展示信息，`id` 为唯一身份，其余字段为可变的展示资料
 * @example
 * const user: ChatUser = {
 *   id: 'user-1',
 *   name: '张三',
 *   avatar: 'https://cdn.example.com/avatar/1.png',
 * }
 */
export type ChatUser = {
  /** 用户唯一标识，无默认值（必填） */
  id: string
  /** 用户显示名称，默认为 undefined（展示时可回退到 id） */
  name?: string
  /** 头像地址，默认为 undefined */
  avatar?: string
  /** 扩展资料，默认为 undefined */
  metadata?: Record<string, unknown>
}

/**
 * 消息附件
 * 描述一个已直传至对象存储的媒体文件，聊天服务只保存引用，不中转文件内容
 * @example
 * const attachment: ChatAttachment = {
 *   id: 'file-1',
 *   url: 'https://cdn.example.com/chat/photo.png',
 *   mimeType: 'image/png',
 *   size: 102400,
 *   width: 800,
 *   height: 600,
 * }
 */
export type ChatAttachment = {
  /** 附件唯一标识，无默认值（必填） */
  id: string
  /** 文件可访问地址，无默认值（必填） */
  url: string
  /** 文件 MIME 类型，无默认值（必填） */
  mimeType: string
  /** 文件字节大小，无默认值（必填） */
  size: number
  /** 原始文件名，默认为 undefined */
  name?: string
  /** 图片/视频宽度（像素），默认为 undefined */
  width?: number
  /** 图片/视频高度（像素），默认为 undefined */
  height?: number
  /** 音视频时长（秒），默认为 undefined */
  duration?: number
  /** 缩略图地址，默认为 undefined */
  thumbnailUrl?: string
}

/**
 * 通道消息
 * 描述一条在通道中传输的消息，包含发送者、内容、状态与扩展元数据
 * @example
 * const message: ChatMessage = {
 *   id: 'msg-1',
 *   channelId: 'channel-1',
 *   senderId: 'user-1',
 *   content: '你好',
 *   type: 'text',
 *   status: 'sent',
 *   createdAt: Date.now(),
 * }
 */
export type ChatMessage = {
  /** 消息唯一标识，无默认值（必填） */
  id: string
  /** 所属通道标识，无默认值（必填） */
  channelId: string
  /** 发送者用户标识，无默认值（必填） */
  senderId: string
  /** 发送时的发送者资料快照（昵称/头像），默认为 undefined */
  sender?: ChatUser
  /** 消息文本内容（媒体消息可为空字符串），无默认值（必填） */
  content: string
  /** 消息类型，默认为 'text' */
  type: ChatMessageType
  /** 消息状态，默认为 'sent' */
  status: ChatMessageStatus
  /** 创建时间戳（毫秒），无默认值（必填） */
  createdAt: number
  /** 扩展元数据，默认为 undefined */
  metadata?: Record<string, unknown>
  /** 已读该消息的用户标识列表，默认为 [] */
  readBy?: string[]
  /** 是否已被发送者撤回，默认为 false */
  recalled?: boolean
  /** 消息附件列表（图片/视频/音频/文件），默认为 undefined */
  attachments?: ChatAttachment[]
}

/**
 * 通道
 * 描述一个独立的消息通道（会话/房间），包含参与者与时间信息
 * @example
 * const channel: ChatChannel = {
 *   id: 'channel-1',
 *   name: '需求讨论',
 *   participantIds: ['user-1', 'user-2'],
 *   createdAt: Date.now(),
 *   updatedAt: Date.now(),
 * }
 */
export type ChatChannel = {
  /** 通道唯一标识，无默认值（必填） */
  id: string
  /** 通道名称，无默认值（必填） */
  name: string
  /** 参与者用户标识列表，默认为 [] */
  participantIds: string[]
  /** 创建时间戳（毫秒），无默认值（必填） */
  createdAt: number
  /** 更新时间戳（毫秒），无默认值（必填） */
  updatedAt: number
  /** 扩展元数据，默认为 undefined */
  metadata?: Record<string, unknown>
}

/**
 * 发送消息输入
 * 支持纯文本或携带类型与元数据的对象
 * @example
 * const input: ChatSendInput = '你好'
 * const rich: ChatSendInput = { content: '附件', type: 'file', metadata: { url: 'a.png' } }
 */
export type ChatSendInput = string | {
  /** 消息文本内容，无默认值（必填） */
  content: string
  /** 消息类型，默认为 'text' */
  type?: ChatMessageType
  /** 扩展元数据，默认为 undefined */
  metadata?: Record<string, unknown>
  /** 消息附件列表，需先直传至对象存储，默认为 undefined */
  attachments?: ChatAttachment[]
}

/**
 * 客户端发往服务端的 WebSocket 消息
 * - subscribe: 订阅通道
 * - unsubscribe: 取消订阅
 * - send: 发送一条消息
 * - typing: 输入中通知
 * - read: 标记已读
 * - edit: 编辑消息内容
 * - delete: 删除消息
 * - recall: 撤回消息（保留占位，清空内容）
 * - ping: 心跳
 */
export type ClientWireMessage
  = | { type: 'subscribe', channelId: string }
    | { type: 'unsubscribe', channelId: string }
    | {
      type: 'send'
      /** 客户端生成的消息标识，用于状态回写，无默认值（必填） */
      id: string
      channelId: string
      content: string
      /** 消息类型，默认为 'text' */
      messageType?: ChatMessageType
      metadata?: Record<string, unknown>
      /** 消息附件列表，默认为 undefined */
      attachments?: ChatAttachment[]
    }
    | { type: 'typing', channelId: string }
    | { type: 'read', channelId: string, messageId?: string }
    | { type: 'edit', channelId: string, id: string, content: string }
    | { type: 'delete', channelId: string, id: string }
    | { type: 'recall', channelId: string, id: string }
    | { type: 'ping' }

/**
 * 服务端发往客户端的 WebSocket 消息
 * - message: 广播一条新消息
 * - status: 回写某条消息的状态
 * - typing: 某人正在输入
 * - history: 历史消息分页
 * - message-updated: 某条消息被编辑或撤回
 * - message-deleted: 某条消息被删除
 * - read: 某人已读了一批消息
 * - presence: 通道内在线用户列表变化
 * - error: 错误通知
 * - pong: 心跳响应
 */
export type ServerWireMessage
  = | { type: 'message', message: ChatMessage }
    | { type: 'status', id: string, channelId: string, status: ChatMessageStatus }
    | { type: 'typing', channelId: string, userId: string }
    | { type: 'history', channelId: string, messages: ChatMessage[], hasMore: boolean }
    | { type: 'message-updated', channelId: string, message: ChatMessage }
    | { type: 'message-deleted', channelId: string, id: string }
    | { type: 'read', channelId: string, userId: string, messageIds: string[] }
    | { type: 'presence', channelId: string, users: ChatUser[] }
    | { type: 'error', message: string, refId?: string }
    | { type: 'pong' }
