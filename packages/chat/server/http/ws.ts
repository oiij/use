import type { Hooks, Message, Peer } from 'crossws'
import type { ClientWireMessage } from '../../src/types'
import type { ChatBus } from '../core/chat-bus'

/**
 * 构建 WebSocket 生命周期钩子
 * 在 upgrade 阶段完成鉴权并写入 userId 到 peer.context，在 message 阶段解析并分发协议消息
 * @example
 * import { createChatServer } from '@oiij/chat/server'
 * const app = createChatServer() // 内部已挂载 createWsHooks
 */
export function createWsHooks(bus: ChatBus): Partial<Hooks> {
  return {
    async upgrade(request) {
      const auth = await bus.authenticate(request)
      if (!auth) {
        return new Response('Unauthorized', { status: 401 })
      }
      return { context: { userId: auth.userId } }
    },
    async message(peer: Peer, message: Message) {
      try {
        const wire = JSON.parse(message.text()) as ClientWireMessage
        await bus.handleMessage(peer, wire)
      }
      catch (error) {
        peer.send(JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'invalid message' }))
      }
    },
    close(peer: Peer) {
      bus.removePeer(peer)
    },
  }
}
