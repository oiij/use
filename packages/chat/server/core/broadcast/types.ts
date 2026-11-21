import type { ServerWireMessage } from '../../../src/types'

/**
 * 跨实例广播载荷
 * 描述一条需要在多个服务实例之间扩散的协议消息
 * @example
 * const payload: ChatBroadcastPayload = {
 *   channelId: 'channel-1',
 *   message: { type: 'pong' },
 * }
 */
export type ChatBroadcastPayload = {
  /** 目标通道标识，无默认值（必填） */
  channelId: string
  /** 需要投递给通道订阅者的服务端协议消息，无默认值（必填） */
  message: ServerWireMessage
}

/**
 * 跨实例广播适配器
 * 单实例部署无需提供；多实例部署时由业务方接入 Redis 等消息中间件，
 * 让不同进程中的订阅者都能收到同一通道的消息
 * @example
 * const broadcaster: ChatBroadcaster = createRedisBroadcaster({ publisher, subscriber })
 */
export type ChatBroadcaster = {
  /** 向其他实例发布一条通道消息，无默认值（必填） */
  publish: (channelId: string, message: ServerWireMessage) => void | Promise<void>
  /**
   * 注册远程消息回调，收到其他实例的消息时调用回调投递给本实例订阅者；
   * 实现方必须过滤掉本实例自己发布的消息，避免与本地投递重复，无默认值（必填）
   */
  onLocal: (handler: (payload: ChatBroadcastPayload) => void) => void
  /** 本实例开始监听某个通道时调用，用于按通道订阅远程消息，默认为 undefined（不订阅） */
  subscribe?: (channelId: string) => void | Promise<void>
  /** 本实例不再监听某个通道时调用，用于退订远程消息，默认为 undefined（不退订） */
  unsubscribe?: (channelId: string) => void | Promise<void>
  /** 关闭适配器并释放订阅资源，默认为 undefined（无需释放） */
  close?: () => void | Promise<void>
}
