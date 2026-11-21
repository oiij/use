import type { ChatAttachment, ChatChannel, ChatMessage, ChatUser } from '../../../src/types'
import type { StorageAdapter } from './adapter'
import { mkdirSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

type ChannelRow = {
  id: string
  name: string
  participant_ids: string | null
  created_at: number
  updated_at: number
  metadata: string | null
}

type MessageRow = {
  id: string
  channel_id: string
  sender_id: string
  sender: string | null
  content: string
  type: string
  status: string
  created_at: number
  metadata: string | null
  read_by: string | null
  recalled: number
  attachments: string | null
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || value.length === 0) {
    return fallback
  }
  try {
    return JSON.parse(value) as T
  }
  catch {
    return fallback
  }
}

function stringifyJson(value: unknown): string | null {
  if (value === undefined) {
    return null
  }
  return JSON.stringify(value)
}

function resolveFile(file: string): string {
  if (file === ':memory:' || extname(file)) {
    return file
  }
  return join(file, 'chat.db')
}

/**
 * SQLite 存储适配器
 * 基于 Node 内置 `node:sqlite` 将通道与消息持久化到数据库文件，
 * 通过独立子入口 `@oiij/chat/server/sqlite` 提供，避免低版本 Node 加载失败
 * @example
 * import { SqliteStorage } from '@oiij/chat/server/sqlite'
 * const storage = new SqliteStorage('./data')
 */
export class SqliteStorage implements StorageAdapter {
  private readonly db: DatabaseSync

  /**
   * @param file 数据库文件路径或所在目录，目录不存在时会自动创建；
   * 传入 `:memory:` 时使用内存数据库，默认为 'chat.db'
   */
  constructor(file = 'chat.db') {
    const target = resolveFile(file)
    if (target !== ':memory:') {
      mkdirSync(dirname(target), { recursive: true })
    }
    this.db = new DatabaseSync(target)
    this.migrate()
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS channels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        participant_ids TEXT NOT NULL DEFAULT '[]',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        metadata TEXT
      );
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        sender TEXT,
        content TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'text',
        status TEXT NOT NULL DEFAULT 'sent',
        created_at INTEGER NOT NULL,
        metadata TEXT,
        read_by TEXT,
        recalled INTEGER NOT NULL DEFAULT 0,
        attachments TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_messages_channel_created
        ON messages (channel_id, created_at DESC);
    `)
    const columns = this.db.prepare('PRAGMA table_info(messages)').all() as unknown as { name: string }[]
    if (!columns.some(column => column.name === 'attachments')) {
      this.db.exec('ALTER TABLE messages ADD COLUMN attachments TEXT')
    }
    if (!columns.some(column => column.name === 'sender')) {
      this.db.exec('ALTER TABLE messages ADD COLUMN sender TEXT')
    }
  }

  listChannels(): ChatChannel[] {
    const rows = this.db.prepare('SELECT * FROM channels ORDER BY created_at ASC').all() as unknown as ChannelRow[]
    return rows.map(row => this.toChannel(row))
  }

  getChannel(id: string): ChatChannel | null {
    const row = this.db.prepare('SELECT * FROM channels WHERE id = ?').get(id) as unknown as ChannelRow | undefined
    return row ? this.toChannel(row) : null
  }

  saveChannel(channel: ChatChannel): void {
    this.db.prepare(`
      INSERT INTO channels (id, name, participant_ids, created_at, updated_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        participant_ids = excluded.participant_ids,
        updated_at = excluded.updated_at,
        metadata = excluded.metadata
    `).run(
      channel.id,
      channel.name,
      JSON.stringify(channel.participantIds),
      channel.createdAt,
      channel.updatedAt,
      stringifyJson(channel.metadata),
    )
  }

  deleteChannel(id: string): void {
    this.db.prepare('DELETE FROM messages WHERE channel_id = ?').run(id)
    this.db.prepare('DELETE FROM channels WHERE id = ?').run(id)
  }

  listMessages(channelId: string, options: { before?: number, limit: number }): ChatMessage[] {
    const rows = options.before != null
      ? this.db.prepare('SELECT * FROM messages WHERE channel_id = ? AND created_at < ? ORDER BY created_at DESC LIMIT ?').all(channelId, options.before, options.limit)
      : this.db.prepare('SELECT * FROM messages WHERE channel_id = ? ORDER BY created_at DESC LIMIT ?').all(channelId, options.limit)
    return (rows as unknown as MessageRow[]).map(row => this.toMessage(row))
  }

  searchMessages(channelId: string, query: string, limit: number): ChatMessage[] {
    const escaped = query.replace(/[\\%_]/g, char => `\\${char}`)
    const rows = this.db.prepare(
      `SELECT * FROM messages WHERE channel_id = ? AND content LIKE ? ESCAPE '\\' ORDER BY created_at DESC LIMIT ?`,
    ).all(channelId, `%${escaped}%`, limit)
    return (rows as unknown as MessageRow[]).map(row => this.toMessage(row))
  }

  saveMessage(message: ChatMessage): void {
    this.db.prepare(`
      INSERT INTO messages (id, channel_id, sender_id, sender, content, type, status, created_at, metadata, read_by, recalled, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        sender = excluded.sender,
        content = excluded.content,
        type = excluded.type,
        status = excluded.status,
        metadata = excluded.metadata,
        read_by = excluded.read_by,
        recalled = excluded.recalled,
        attachments = excluded.attachments
    `).run(
      message.id,
      message.channelId,
      message.senderId,
      stringifyJson(message.sender),
      message.content,
      message.type,
      message.status,
      message.createdAt,
      stringifyJson(message.metadata),
      JSON.stringify(message.readBy ?? []),
      message.recalled ? 1 : 0,
      stringifyJson(message.attachments),
    )
  }

  deleteMessage(channelId: string, messageId: string): void {
    this.db.prepare('DELETE FROM messages WHERE channel_id = ? AND id = ?').run(channelId, messageId)
  }

  private toChannel(row: ChannelRow): ChatChannel {
    return {
      id: row.id,
      name: row.name,
      participantIds: parseJson<string[]>(row.participant_ids, []),
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      metadata: parseJson<Record<string, unknown> | undefined>(row.metadata, undefined),
    }
  }

  private toMessage(row: MessageRow): ChatMessage {
    return {
      id: row.id,
      channelId: row.channel_id,
      senderId: row.sender_id,
      sender: parseJson<ChatUser | undefined>(row.sender, undefined),
      content: row.content,
      type: row.type,
      status: row.status as ChatMessage['status'],
      createdAt: Number(row.created_at),
      metadata: parseJson<Record<string, unknown> | undefined>(row.metadata, undefined),
      readBy: parseJson<string[]>(row.read_by, []),
      recalled: Number(row.recalled) === 1,
      attachments: parseJson<ChatAttachment[] | undefined>(row.attachments, undefined),
    }
  }
}
