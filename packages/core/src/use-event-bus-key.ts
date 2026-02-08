import type { EventBusKey } from '@vueuse/core'

/**
 * 创建事件总线键的组合式函数
 *
 * 用于生成唯一的 Symbol 作为事件总线的键，与 @vueuse/core 的 eventBus 配合使用
 *
 * @param key - 键的描述性名称，默认为 'key'，仅用于调试目的
 * @returns 唯一的 EventBusKey<T> 类型的 Symbol
 *
 * @example
 * ```ts
 * // 基本用法
 * import { useEventBus, useEventBusKey } from '@vueuse/core'
 *
 * // 创建事件总线键
 * const busKey = useEventBusKey<string>('message')
 *
 * // 使用事件总线键
 * const bus = useEventBus(busKey)
 *
 * // 监听事件
 * const stop = bus.on((message) => {
 *   console.log('收到消息:', message)
 * })
 *
 * // 发送事件
 * bus.emit('Hello World')
 *
 * // 停止监听
 * stop()
 *
 * // 为不同类型创建不同的键
 * const numberBusKey = useEventBusKey<number>('count')
 * const numberBus = useEventBus(numberBusKey)
 * numberBus.emit(42)
 * ```
 */
export function useEventBusKey<T>(key = 'key'): EventBusKey<T> {
  // 使用 Symbol 创建唯一的事件总线键
  // Symbol 的描述参数仅用于调试，不影响唯一性
  return Symbol(key)
}

/**
 * useEventBusKey 函数的返回类型
 */
export type UseEventBusKeyReturns = ReturnType<typeof useEventBusKey>
