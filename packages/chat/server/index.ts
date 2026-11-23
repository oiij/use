// 前后端共享的协议类型，服务端入口也予以导出，便于在服务端代码中引用
export type {
  ChatAttachment,
  ChatAvailability,
  ChatChannel,
  ChatMention,
  ChatMessage,
  ChatMessageStatus,
  ChatMessageType,
  ChatQuotedMessage,
  ChatSendInput,
  ChatUser,
  ClientWireMessage,
  ServerWireMessage,
} from '../src/types'
export { createRedisBroadcaster } from './core/broadcast/redis'
export type { CreateRedisBroadcasterOptions, RedisLikeClient } from './core/broadcast/redis'
export type { ChatBroadcaster, ChatBroadcastPayload } from './core/broadcast/types'
export { ChatBus } from './core/chat-bus'
export type { StorageAdapter } from './core/storage/adapter'
export { JsonFileStorage } from './core/storage/json-file'
export { MemoryStorage } from './core/storage/memory'

export type { ChatAttachmentContext, ChatAttachmentHook, ChatAuthHook, ChatConnectContext, ChatMessageContext, ChatServerOptions, ChatUserProfileHook } from './core/types'
export { createChatServer } from './http/app'
export { createChatAuthMiddleware, getChatUserId } from './http/auth'

export { createWsHooks } from './http/ws'
