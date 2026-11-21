import type { ServerWireMessage } from '../../../src/types'
import type { ChatBroadcaster, ChatBroadcastPayload } from './types'

/**
 * 最小 Redis 客户端接口
 * 兼容 ioredis 等常见实现，便于业务方复用已有连接而不引入额外依赖
 * @example
 * const client: RedisLikeClient = new Redis()
 */
export type RedisLikeClient = {
  /** 向指定频道发布字符串消息，无默认值（必填） */
  publish: (channel: string, message: string) => unknown | Promise<unknown>
  /** 订阅指定频道，无默认值（必填） */
  subscribe: (channel: string) => unknown | Promise<unknown>
  /** 退订指定频道，默认为 undefined（关闭时无法主动退订） */
  unsubscribe?: (channel: string) => unknown | Promise<unknown>
  /** 监听 `message` 事件，回调参数为频道名与消息内容，无默认值（必填） */
  on: (event: 'message', listener: (channel: string, message: string) => void) => unknown
}

/**
 * 创建 Redis 广播适配器的配置
 * @example
 * const options: CreateRedisBroadcasterOptions = {
 *   publisher: new Redis(),
 *   subscriber: new Redis(),
 *   prefix: 'myapp:chat',
 * }
 */
export type CreateRedisBroadcasterOptions = {
  /** 发布消息的客户端，无默认值（必填） */
  publisher: RedisLikeClient
  /** 订阅消息的客户端，需与 publisher 分开（订阅模式连接不可复用），无默认值（必填） */
  subscriber: RedisLikeClient
  /** Redis 频道名前缀，默认为 'oiij:chat' */
  prefix?: string
  /** 当前实例唯一标识，用于过滤自身消息避免回环，默认为随机生成的字符串 */
  instanceId?: string
}

type RedisEnvelope = {
  o: string
  c: string
  m: ServerWireMessage
}

/**
 * 创建基于 Redis Pub/Sub 的跨实例广播适配器
 *
 * 每个实例使用独立的订阅连接监听通道频道，发布时携带实例标识，
 * 收到自身发布的消息会被丢弃，避免与本实例的本地投递重复。
 * 传入 `createChatServer` 的 `broadcaster` 选项即可让多实例共享消息。
 *
 * @example
 * ```ts
 * import { createChatServer, createRedisBroadcaster } from '@oiij/chat/server'
 * import Redis from 'ioredis'
 *
 * const { app } = createChatServer({
 *   broadcaster: createRedisBroadcaster({
 *     publisher: new Redis(),
 *     subscriber: new Redis(),
 *   }),
 * })
 * ```
 */
export function createRedisBroadcaster(options: CreateRedisBroadcasterOptions): ChatBroadcaster {
  const { publisher, subscriber, prefix = 'oiij:chat' } = options
  const instanceId = options.instanceId ?? `chat-${Math.random().toString(36).slice(2, 10)}`
  const handlers: Array<(payload: ChatBroadcastPayload) => void> = []
  const channels = new Set<string>()

  const channelKey = (channelId: string): string => `${prefix}:channel:${channelId}`

  subscriber.on('message', (channel, raw) => {
    if (!channel.startsWith(`${prefix}:channel:`)) {
      return
    }
    let envelope: RedisEnvelope
    try {
      envelope = JSON.parse(raw) as RedisEnvelope
    }
    catch {
      return
    }
    if (!envelope || typeof envelope.c !== 'string' || !envelope.m || envelope.o === instanceId) {
      return
    }
    const payload: ChatBroadcastPayload = { channelId: envelope.c, message: envelope.m }
    for (const handler of handlers) {
      handler(payload)
    }
  })

  return {
    async publish(channelId, message) {
      const envelope: RedisEnvelope = { o: instanceId, c: channelId, m: message }
      await publisher.publish(channelKey(channelId), JSON.stringify(envelope))
    },
    onLocal(handler) {
      handlers.push(handler)
    },
    async subscribe(channelId) {
      if (channels.has(channelId)) {
        return
      }
      channels.add(channelId)
      await subscriber.subscribe(channelKey(channelId))
    },
    async unsubscribe(channelId) {
      if (!channels.delete(channelId)) {
        return
      }
      await subscriber.unsubscribe?.(channelKey(channelId))
    },
    async close() {
      const pending = [...channels].map(channelId => subscriber.unsubscribe?.(channelKey(channelId)))
      channels.clear()
      await Promise.all(pending)
    },
  }
}
