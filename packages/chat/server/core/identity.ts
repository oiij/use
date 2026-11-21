/**
 * 从请求中解析聊天身份
 * 优先读取 `x-chat-user` / `x-chat-token` 请求头，其次读取 `userId` / `token` 查询参数
 * @param request 原始请求对象
 * @returns 解析到的身份信息，未携带用户标识时返回 null
 * @example
 * ```ts
 * const identity = resolveChatIdentity(new Request('http://localhost/ws?userId=u1'))
 * // { userId: 'u1', token: undefined }
 * ```
 */
export function resolveChatIdentity(request: Request): { userId: string, token?: string } | null {
  const url = new URL(request.url)
  const userId = request.headers.get('x-chat-user') ?? url.searchParams.get('userId') ?? ''
  if (!userId) {
    return null
  }
  const token = request.headers.get('x-chat-token') ?? url.searchParams.get('token') ?? undefined
  return { userId, token }
}
