import type { MaybeRefOrGetter } from 'vue'
import type { HandlerType, MessageRaw, RealtimeOptions } from './_realtime'
import { shallowRef } from 'vue'
import { createRealtimeConnection } from './_realtime'

/**
 * WebSocket 连接状态类型
 * - CONNECTING: 连接中
 * - OPEN: 已连接
 * - CLOSING: 关闭中
 * - CLOSED: 已关闭
 * - PENDING: 待连接
 */
type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'

/**
 * WebSocket 就绪状态映射
 * 将 WebSocket readyState 数值映射为可读的状态字符串
 */
const ReadyState: Record<number, State> = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
}

/**
 * WebSocket 选项类型
 * @template T 处理器类型
 * @example
 * const options: UseWebsocketOptions = {
 *   protocols: 'chat',
 *   manual: false,
 *   autoRetry: true,
 *   parseMessage: true,
 *   handlerKey: 'type',
 *   maxRecordSize: 100
 * }
 */
export type UseWebsocketOptions<T extends HandlerType = HandlerType> = RealtimeOptions<T> & {
  /** WebSocket 协议，默认为 undefined */
  protocols?: string | string[]
}

/**
 * WebSocket 组合式函数
 * 提供 WebSocket 连接管理、消息发送与接收、自动重试等功能
 *
 * @template T 处理器类型
 * @template D 消息数据类型
 * @param url WebSocket 连接地址，支持响应式引用
 * @param options WebSocket 配置选项
 * @returns WebSocket 实例及相关方法
 *
 * @example
 * // 基本用法
 * const { status, data, send, onMessage } = useWebSocket('wss://echo.websocket.org')
 *
 * onMessage((event) => {
 *   console.log('收到消息:', event.data)
 * })
 *
 * send({ type: 'ping', timestamp: Date.now() })
 *
 * @example
 * // 带类型定义的用法
 * interface MessageTypes {
 *   ping: { type: 'ping', timestamp: number }
 *   pong: { type: 'pong', timestamp: number }
 * }
 *
 * const { registerHandler } = useWebSocket<MessageTypes>('wss://echo.websocket.org', {
 *   parseMessage: true
 * })
 *
 * registerHandler('pong', (data) => {
 *   console.log('收到 pong 消息:', data.timestamp)
 * })
 */
export function useWebSocket<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: MaybeRefOrGetter<string | URL>, options?: UseWebsocketOptions<T>) {
  const socket = shallowRef<WebSocket | null>(null)

  const core = createRealtimeConnection<T, D, WebSocket, State, true, { protocols?: string | string[] }>({
    url,
    options: options ?? {},
    readyStateMap: ReadyState,
    initialStatus: 'PENDING',
    connRef: socket,
    create: (u, o) => new WebSocket(u, o.protocols),
    retryOn: 'close',
    hasCloseEvent: true,
  })

  /**
   * 发送原始数据
   * 直接发送字符串数据到 WebSocket 服务器
   * @param data 原始字符串数据
   * @example
   * sendRaw('Hello Server')
   */
  function sendRaw(data: string) {
    socket.value?.send(data)
  }

  /**
   * 发送对象数据（自动转换为 JSON）
   * 将对象序列化为 JSON 字符串后发送
   * @param data 对象数据
   * @example
   * send({ type: 'ping', timestamp: Date.now() })
   */
  function send(data: object) {
    sendRaw(JSON.stringify(data))
  }

  return {
    socket,
    ...core,
    sendRaw,
    send,
  }
}

/**
 * useWebSocket 函数返回类型
 * 包含 WebSocket 实例、状态、方法和事件钩子
 * @example
 * const ws: UseWebSocketReturns = useWebSocket('wss://example.com')
 */
export type UseWebSocketReturns = ReturnType<typeof useWebSocket>
