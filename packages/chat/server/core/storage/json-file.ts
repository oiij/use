import type { ChatChannel, ChatMessage } from '../../../src/types'
import type { StorageAdapter } from './adapter'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

type PersistedData = {
  channels: ChatChannel[]
  messages: Record<string, ChatMessage[]>
}

/**
 * JSON 文件存储适配器
 * 将全部通道与消息序列化到单个 JSON 文件，采用「先写临时文件再原子重命名」策略，
 * 避免写入中途崩溃产生半成品数据，适用于中小规模单实例部署
 * @example
 * import { JsonFileStorage } from '@oiij/chat/server'
 * const storage = new JsonFileStorage('./data')
 */
export class JsonFileStorage implements StorageAdapter {
  private readonly filePath: string
  private cache: PersistedData = { channels: [], messages: {} }
  private loadPromise: Promise<void> | null = null
  private writeQueue: Promise<void> = Promise.resolve()
  private loaded = false

  /**
   * @param dir 数据文件所在目录，目录不存在时会自动创建
   * @param file 数据文件名，默认为 'chat.json'
   */
  constructor(dir: string, file = 'chat.json') {
    this.filePath = join(dir, file)
  }

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) {
      return
    }
    if (!this.loadPromise) {
      this.loadPromise = this.load().finally(() => {
        this.loaded = true
        this.loadPromise = null
      })
    }
    await this.loadPromise
  }

  private async load(): Promise<void> {
    try {
      const raw = await readFile(this.filePath, 'utf-8')
      const data = JSON.parse(raw) as Partial<PersistedData>
      this.cache = {
        channels: Array.isArray(data.channels) ? data.channels : [],
        messages: data.messages && typeof data.messages === 'object' ? data.messages : {},
      }
    }
    catch {
      this.cache = { channels: [], messages: {} }
    }
  }

  private scheduleWrite(): Promise<void> {
    this.writeQueue = this.writeQueue.then(async () => {
      const tmp = `${this.filePath}.tmp`
      await mkdir(dirname(this.filePath), { recursive: true })
      await writeFile(tmp, JSON.stringify(this.cache, null, 2), 'utf-8')
      await rename(tmp, this.filePath)
    })
    return this.writeQueue
  }

  async listChannels(): Promise<ChatChannel[]> {
    await this.ensureLoaded()
    return [...this.cache.channels]
  }

  async getChannel(id: string): Promise<ChatChannel | null> {
    await this.ensureLoaded()
    return this.cache.channels.find(channel => channel.id === id) ?? null
  }

  async saveChannel(channel: ChatChannel): Promise<void> {
    await this.ensureLoaded()
    const index = this.cache.channels.findIndex(item => item.id === channel.id)
    if (index === -1) {
      this.cache.channels.push(channel)
    }
    else {
      this.cache.channels[index] = channel
    }
    await this.scheduleWrite()
  }

  async deleteChannel(id: string): Promise<void> {
    await this.ensureLoaded()
    this.cache.channels = this.cache.channels.filter(channel => channel.id !== id)
    delete this.cache.messages[id]
    await this.scheduleWrite()
  }

  async listMessages(channelId: string, options: { before?: number, limit: number }): Promise<ChatMessage[]> {
    await this.ensureLoaded()
    const list = this.cache.messages[channelId] ?? []
    const before = options.before
    const filtered = before != null ? list.filter(message => message.createdAt < before) : list
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt).slice(0, options.limit)
  }

  async searchMessages(channelId: string, query: string, limit: number): Promise<ChatMessage[]> {
    await this.ensureLoaded()
    const lowered = query.toLowerCase()
    const list = this.cache.messages[channelId] ?? []
    return list
      .filter(message => message.content.toLowerCase().includes(lowered))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  }

  async saveMessage(message: ChatMessage): Promise<void> {
    await this.ensureLoaded()
    const list = this.cache.messages[message.channelId] ?? []
    const index = list.findIndex(item => item.id === message.id)
    if (index === -1) {
      list.push(message)
    }
    else {
      list[index] = message
    }
    this.cache.messages[message.channelId] = list
    await this.scheduleWrite()
  }

  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    await this.ensureLoaded()
    const list = this.cache.messages[channelId]
    if (!list) {
      return
    }
    this.cache.messages[channelId] = list.filter(item => item.id !== messageId)
    await this.scheduleWrite()
  }
}
