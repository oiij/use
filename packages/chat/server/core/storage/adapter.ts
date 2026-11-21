import type { ChatChannel, ChatMessage } from '../../../src/types'

/**
 * 存储适配器
 * 描述消息与通道持久化所需实现的最小接口，内置内存与 JSON 文件两种实现，
 * 业务方也可自行实现以接入 SQLite、Redis 或数据库
 * @example
 * const storage: StorageAdapter = {
 *   listChannels: async () => [],
 *   getChannel: async id => null,
 *   saveChannel: async () => {},
 *   deleteChannel: async () => {},
 *   listMessages: async () => [],
 *   saveMessage: async () => {},
 *   deleteMessage: async () => {},
 * }
 */
export type StorageAdapter = {
  /** 列出全部通道，无默认值（必填） */
  listChannels: () => ChatChannel[] | Promise<ChatChannel[]>
  /** 获取单个通道，无默认值（必填） */
  getChannel: (id: string) => ChatChannel | null | Promise<ChatChannel | null>
  /** 保存（新增或覆盖）通道，无默认值（必填） */
  saveChannel: (channel: ChatChannel) => void | Promise<void>
  /** 删除通道及其消息，无默认值（必填） */
  deleteChannel: (id: string) => void | Promise<void>
  /** 分页列出通道消息，按创建时间倒序返回，无默认值（必填） */
  listMessages: (channelId: string, options: { before?: number, limit: number }) => ChatMessage[] | Promise<ChatMessage[]>
  /**
   * 按关键字检索通道消息，按创建时间倒序返回，
   * 未实现时上层会回退为拉取全量消息后在内存中过滤，默认为 undefined（回退过滤）
   */
  searchMessages?: (channelId: string, query: string, limit: number) => ChatMessage[] | Promise<ChatMessage[]>
  /** 保存（新增或覆盖）消息，无默认值（必填） */
  saveMessage: (message: ChatMessage) => void | Promise<void>
  /** 删除单条消息，无默认值（必填） */
  deleteMessage: (channelId: string, messageId: string) => void | Promise<void>
}
