import type { Hooks, Peer } from 'crossws'
import type { RtcHub } from '../core/rtc-hub'

/**
 * 构建信令 WebSocket 生命周期钩子
 * 在 upgrade 阶段读取查询参数中的期望标识，在 open 阶段注册连接，在 message 阶段转发信令
 * @param hub 信令中心实例
 * @returns crossws 钩子对象
 * @example
 * import { createWsHooks, RtcHub } from '@oiij/web-rtc/server'
 * const hooks = createWsHooks(new RtcHub())
 */
export function createWsHooks(hub: RtcHub): Partial<Hooks> {
  return {
    upgrade(request) {
      const key = new URL(request.url).searchParams.get('key') ?? undefined
      return { context: { requestedKey: key } }
    },
    open(peer: Peer) {
      const { requestedKey } = peer.context as { requestedKey?: string }
      hub.register(peer, requestedKey)
    },
    message(peer: Peer, message) {
      hub.dispatch(peer, message.text())
    },
    close(peer: Peer) {
      hub.unregister(peer)
    },
    error(peer: Peer) {
      hub.unregister(peer)
    },
  }
}
