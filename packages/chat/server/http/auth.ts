import type { H3Event } from 'h3'
import type { ChatAuthHook } from '../core/types'
import { createError, defineEventHandler } from 'h3'
import { resolveChatIdentity } from '../core/identity'

/**
 * 获取当前请求已鉴权的用户标识
 * 由 {@link createChatAuthMiddleware} 在鉴权通过后写入事件上下文
 * @param event h3 事件对象
 * @returns 已鉴权的用户标识，未鉴权时为 undefined
 * @example
 * ```ts
 * app.get('/me', defineEventHandler(event => ({ userId: getChatUserId(event) })))
 * ```
 */
export function getChatUserId(event: H3Event): string | undefined {
  return (event.context as { userId?: string }).userId
}

/**
 * 创建 REST 鉴权中间件
 * 解析请求身份并调用鉴权钩子，通过后把 `userId` 写入事件上下文，否则返回 401
 * @param hook 鉴权钩子，签名与 {@link ChatAuthHook} 一致
 * @returns 可直接挂载到 h3 路由或 `app.use` 的事件处理器
 * @example
 * ```ts
 * const guard = createChatAuthMiddleware(({ userId }) => userId !== 'banned')
 * app.use('/channels/**', guard)
 * ```
 */
export function createChatAuthMiddleware(hook: ChatAuthHook) {
  return defineEventHandler(async (event) => {
    const identity = resolveChatIdentity(event.req)
    if (!identity) {
      throw createError({ statusCode: 401, message: 'chat user is required' })
    }
    const allowed = await hook({ ...identity, request: event.req })
    if (allowed === false) {
      throw createError({ statusCode: 401, message: 'chat user is not allowed' })
    }
    ;(event.context as { userId?: string, token?: string }).userId = identity.userId
    ;(event.context as { userId?: string, token?: string }).token = identity.token
  })
}
