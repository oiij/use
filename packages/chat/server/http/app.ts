import type { ChatServerOptions } from '../core/types'
import { createError, defineEventHandler, defineWebSocketHandler, getQuery, getRouterParam, H3, readBody } from 'h3'
import { ChatBus } from '../core/chat-bus'
import { createChatAuthMiddleware } from './auth'
import { createWsHooks } from './ws'

/**
 * 创建聊天服务 h3 应用
 * 组装 REST 路由与 WebSocket 入口，返回可被独立运行或嵌入其他服务的 h3 实例
 * @example
 * import { createChatServer, JsonFileStorage } from '@oiij/chat/server'
 * import { serve } from 'h3'
 *
 * const { app } = createChatServer({
 *   storage: new JsonFileStorage('./data'),
 *   onMessage: (ctx, message) => message,
 * })
 * serve(app, { port: 3000 })
 */
export function createChatServer(options: ChatServerOptions = {}): { app: H3, bus: ChatBus } {
  const bus = new ChatBus(options)
  const app = new H3()

  if (options.onConnect) {
    const guard = createChatAuthMiddleware(options.onConnect)
    app.use('/channels', guard)
    app.use('/channels/**', guard)
  }

  app.get('/channels', defineEventHandler(() => bus.listChannels()))

  app.post('/channels', defineEventHandler(async (event) => {
    const body = await readBody<{ name?: string, participantIds?: string[], metadata?: Record<string, unknown> }>(event)
    if (!body?.name) {
      throw createError({ statusCode: 400, message: 'channel name is required' })
    }
    return bus.createChannel({
      name: body.name,
      participantIds: body.participantIds,
      metadata: body.metadata,
    })
  }))

  app.get('/channels/:id/messages/search', defineEventHandler(async (event) => {
    const channelId = getRouterParam(event, 'id')
    if (!channelId) {
      throw createError({ statusCode: 400, message: 'channel id is required' })
    }
    const query = getQuery<{ q?: string, limit?: string }>(event)
    return bus.searchMessages(channelId, query.q ?? '', query.limit ? Number(query.limit) : undefined)
  }))

  app.get('/channels/:id/messages', defineEventHandler(async (event) => {
    const channelId = getRouterParam(event, 'id')
    if (!channelId) {
      throw createError({ statusCode: 400, message: 'channel id is required' })
    }
    const query = getQuery<{ before?: string, limit?: string }>(event)
    return bus.listMessages(channelId, {
      before: query.before ? Number(query.before) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
    })
  }))

  app.delete('/channels/:id/messages/:mid', defineEventHandler(async (event) => {
    const channelId = getRouterParam(event, 'id')
    const messageId = getRouterParam(event, 'mid')
    if (!channelId || !messageId) {
      throw createError({ statusCode: 400, message: 'channel id and message id are required' })
    }
    await bus.deleteMessage(channelId, messageId)
    return { ok: true }
  }))

  app.all('/ws', defineWebSocketHandler(createWsHooks(bus)))

  return { app, bus }
}
