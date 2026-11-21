import type { ChatChannel, ChatMessage } from '../../../src/types'
import type { StorageAdapter } from './adapter'

/**
 * 内存存储适配器
 * 将通道与消息保存在进程内存中，重启后丢失，适用于开发与单实例无状态场景
 * @example
 * import { MemoryStorage } from '@oiij/chat/server'
 * const storage = new MemoryStorage()
 */
export class MemoryStorage implements StorageAdapter {
  private channels = new Map<string, ChatChannel>()
  private messages = new Map<string, ChatMessage[]>()

  listChannels(): ChatChannel[] {
    return [...this.channels.values()]
  }

  getChannel(id: string): ChatChannel | null {
    return this.channels.get(id) ?? null
  }

  saveChannel(channel: ChatChannel): void {
    this.channels.set(channel.id, channel)
  }

  deleteChannel(id: string): void {
    this.channels.delete(id)
    this.messages.delete(id)
  }

  listMessages(channelId: string, options: { before?: number, limit: number }): ChatMessage[] {
    const list = this.messages.get(channelId) ?? []
    const before = options.before
    const filtered = before != null ? list.filter(message => message.createdAt < before) : list
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt).slice(0, options.limit)
  }

  searchMessages(channelId: string, query: string, limit: number): ChatMessage[] {
    const lowered = query.toLowerCase()
    const list = this.messages.get(channelId) ?? []
    return list
      .filter(message => message.content.toLowerCase().includes(lowered))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  }

  saveMessage(message: ChatMessage): void {
    const list = this.messages.get(message.channelId) ?? []
    const index = list.findIndex(item => item.id === message.id)
    if (index === -1) {
      list.push(message)
    }
    else {
      list[index] = message
    }
    this.messages.set(message.channelId, list)
  }

  deleteMessage(channelId: string, messageId: string): void {
    const list = this.messages.get(channelId)
    if (!list) {
      return
    }
    const index = list.findIndex(item => item.id === messageId)
    if (index !== -1) {
      list.splice(index, 1)
    }
  }
}
