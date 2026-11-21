import type { ChatAttachment, ChatMessage, ChatUser } from '../../src/types'
import type { ChatBroadcaster } from './broadcast/types'
import type { StorageAdapter } from './storage/adapter'

/**
 * 消息处理上下文
 * 业务钩子 onMessage 接收的上下文，包含当前用户、目标通道与广播能力
 * @example
 * function onMessage(ctx, message) {
 *   if (message.content.includes('违禁词')) {
 *     message.content = '该消息已被拦截'
 *   }
 *   ctx.broadcast(message)
 * }
 */
export type ChatMessageContext = {
  /** 当前发送者用户标识，无默认值（必填） */
  userId: string
  /** 目标通道标识，无默认值（必填） */
  channelId: string
  /** 向同通道其他在线客户端广播一条消息，无默认值（必填） */
  broadcast: (message: ChatMessage) => void
}

/**
 * 连接鉴权上下文
 * WebSocket 握手与 REST 请求共用，携带从请求中解析出的身份信息
 * @example
 * const hook: ChatAuthHook = ({ userId, token }) => Boolean(userId && token)
 */
export type ChatConnectContext = {
  /** 从请求头 `x-chat-user` 或查询参数 `userId` 解析出的用户标识，无默认值（必填） */
  userId: string
  /** 从请求头 `x-chat-token` 或查询参数 `token` 解析出的令牌，默认为 undefined */
  token?: string
  /** 原始请求对象，可读取自定义请求头或 Cookie，无默认值（必填） */
  request: Request
}

/**
 * 鉴权钩子
 * 返回 false 表示拒绝访问，返回其它值或空值表示放行，支持异步校验
 * @example
 * const hook: ChatAuthHook = async ({ userId }) => {
 *   return await verifyUser(userId)
 * }
 */
export type ChatAuthHook = (context: ChatConnectContext) => boolean | void | Promise<boolean | void>

/**
 * 附件校验上下文
 * 附件校验钩子可读取待校验附件、发送者与目标通道
 * @example
 * const context: ChatAttachmentContext = {
 *   attachment,
 *   userId: 'user-1',
 *   channelId: 'channel-1',
 * }
 */
export type ChatAttachmentContext = {
  /** 待校验的附件，无默认值（必填） */
  attachment: ChatAttachment
  /** 发送者用户标识，无默认值（必填） */
  userId: string
  /** 目标通道标识，无默认值（必填） */
  channelId: string
}

/**
 * 附件校验钩子
 * 返回 false 表示拒绝该消息，返回其它值或空值表示放行，支持异步校验
 * @example
 * const hook: ChatAttachmentHook = ({ attachment }) => {
 *   return attachment.url.startsWith('https://cdn.example.com/')
 * }
 */
export type ChatAttachmentHook = (context: ChatAttachmentContext) => boolean | void | Promise<boolean | void>

/**
 * 用户资料解析钩子
 * 根据用户标识返回昵称、头像等展示资料，返回空值时仅下发 `{ id }`
 * @example
 * const hook: ChatUserProfileHook = async (userId) => {
 *   const user = await db.users.find(userId)
 *   return user ? { id: user.id, name: user.nickname, avatar: user.avatarUrl } : undefined
 * }
 */
export type ChatUserProfileHook = (userId: string) => ChatUser | null | undefined | Promise<ChatUser | null | undefined>

/**
 * 聊天服务配置
 * @example
 * const options: ChatServerOptions = {
 *   storage: new JsonFileStorage('./data'),
 *   onMessage: (ctx, message) => message,
 * }
 */
export type ChatServerOptions = {
  /** 持久化存储适配器，默认为内存存储 */
  storage?: StorageAdapter
  /** 消息业务钩子，在消息持久化与广播前调用，可拦截或修改消息，默认为 undefined */
  onMessage?: (ctx: ChatMessageContext, message: ChatMessage) => ChatMessage | void | Promise<ChatMessage | void>
  /** 连接鉴权钩子，同时作用于 WebSocket 握手与 REST 接口，返回 false 时拒绝访问，默认为 undefined（全部放行） */
  onConnect?: ChatAuthHook
  /** 心跳间隔（毫秒），超过该间隔未收到客户端消息则视为失活，默认为 30000 */
  heartbeat?: number
  /** 跨实例广播适配器，多实例部署时接入后可让消息在所有实例间同步，默认为 undefined（仅本地广播） */
  broadcaster?: ChatBroadcaster
  /** 附件校验钩子，在消息持久化前逐个校验附件，返回 false 时拒绝该消息，默认为 undefined（不校验） */
  onAttachment?: ChatAttachmentHook
  /** 用户资料解析钩子，用于在线用户列表与消息发送者快照，默认为 undefined（仅下发用户标识） */
  getUserProfile?: ChatUserProfileHook
}
