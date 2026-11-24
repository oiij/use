import type { MaybeRefOrGetter } from 'vue'
import type { HandlerType, MessageRaw, RealtimeOptions } from './_realtime'
import { shallowRef } from 'vue'
import { createRealtimeConnection } from './_realtime'

/**
 * EventSource 连接状态
 * - CONNECTING: 连接中
 * - OPEN: 已连接
 * - CLOSED: 已关闭
 */
type State = 'CONNECTING' | 'OPEN' | 'CLOSED'

/**
 * EventSource 就绪状态映射
 * 将 EventSource readyState 数值映射为可读的状态字符串
 */
const ReadyState: Record<number, State> = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
}

/**
 * useEventSource 选项配置
 * @template T 处理器类型
 * @example
 * const options: UseEventSourceOptions = {
 *   manual: false,
 *   autoRetry: true,
 *   parseMessage: true,
 *   handlerKey: 'type',
 *   maxRecordSize: 100,
 *   withCredentials: false
 * }
 */
export type UseEventSourceOptions<T extends HandlerType = HandlerType> = RealtimeOptions<T> & EventSourceInit

/**
 * EventSource 组合式函数
 * 用于创建和管理 EventSource (SSE) 连接的 Vue 组合式函数
 *
 * @template T 处理器类型
 * @template D 消息数据类型
 * @param url EventSource 连接地址，支持响应式引用
 * @param options 配置选项
 * @returns EventSource 实例和相关状态、方法
 *
 * @example
 * // 基本用法
 * const { status, data, onMessage } = useEventSource('https://api.example.com/events')
 *
 * onMessage((event) => {
 *   console.log('Received message:', event.data)
 * })
 *
 * @example
 * // 带自动重连的用法
 * const { status, connect } = useEventSource('https://api.example.com/events', {
 *   autoRetry: {
 *     retries: 5,
 *     delay: 2000,
 *     onFailed: () => console.error('Failed to connect after retries')
 *   }
 * })
 *
 * @example
 * // 带消息解析的用法
 * const { registerHandler } = useEventSource<{
 *   update: { type: 'update', id: number; value: string }
 *   error: { type: 'error', code: number; message: string }
 * }>('https://api.example.com/events', {
 *   parseMessage: true
 * })
 *
 * registerHandler('update', (data) => {
 *   console.log('Update received:', data.value)
 * })
 */
export function useEventSource<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: MaybeRefOrGetter<string | URL>, options?: UseEventSourceOptions<T>) {
  const source = shallowRef<EventSource | null>(null)

  const core = createRealtimeConnection<T, D, EventSource, State, false, EventSourceInit>({
    url,
    options: options ?? {},
    readyStateMap: ReadyState,
    initialStatus: 'CLOSED',
    connRef: source,
    create: (u, o) => new EventSource(u, o),
    retryOn: 'error',
    hasCloseEvent: false,
  })

  return {
    source,
    ...core,
  }
}

/**
 * useEventSource 返回类型
 * 包含 EventSource 实例、状态、方法和事件钩子
 * @example
 * const es: UseEventSourceReturns = useEventSource('https://api.example.com/events')
 */
export type UseEventSourceReturns = ReturnType<typeof useEventSource>
