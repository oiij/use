/**
 * WebRTC 信令服务配置
 * 同时用于 {@link RtcHub} 与 `createRtcServer`
 * @example
 * const options: RtcServerOptions = { path: '/ws', maxPayloadSize: 64 * 1024 }
 */
export type RtcServerOptions = {
  /** WebSocket 挂载路径，默认为 '/ws' */
  path?: string
  /** 自定义标识生成函数，默认为 8 位短 uuid */
  keyGenerator?: () => string
  /** 单条信令消息的最大字节数，默认为 65536 */
  maxPayloadSize?: number
}
