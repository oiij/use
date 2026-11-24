import type { RtcServerOptions } from '../core/types'
import { defineEventHandler, defineWebSocketHandler, H3 } from 'h3'
import { RtcHub } from '../core/rtc-hub'
import { createWsHooks } from './ws'

/**
 * 创建 WebRTC 信令服务 h3 应用
 * 组装健康检查、在线列表与 WebSocket 信令路由，返回可独立运行或嵌入其他服务的 h3 实例
 * @param options 服务配置
 * @returns h3 应用与信令中心实例
 * @example
 * import { createRtcServer } from '@oiij/web-rtc/server'
 * import { toNodeHandler } from 'h3/node'
 * import { listen } from 'listhen'
 *
 * const { app, hub } = createRtcServer({ path: '/ws' })
 * await listen(toNodeHandler(app), { port: 4100 })
 */
export function createRtcServer(options: RtcServerOptions = {}): { app: H3, hub: RtcHub } {
  const { path = '/ws' } = options
  const hub = new RtcHub(options)
  const app = new H3()

  app.get('/', defineEventHandler(() => ({
    name: '@oiij/web-rtc',
    path,
    peers: hub.size,
  })))

  app.get('/health', defineEventHandler(() => ({ ok: true, peers: hub.size })))

  app.get('/peers', defineEventHandler(() => hub.keys()))

  app.all(path, defineWebSocketHandler(createWsHooks(hub)))

  return { app, hub }
}
