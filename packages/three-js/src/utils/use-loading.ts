import type { ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'

/**
 * 使用加载状态
 *
 * @returns 加载状态和事件钩子
 *
 * @example
 * ```ts
 * import { useLoading } from '@oiij/three-js/utils'
 *
 * const { loading, complete, progress, data, error, onLoadEvent, onProgressEvent, onErrorEvent } = useLoading<string, Error, ProgressEvent, void>()
 *
 * // 监听加载完成
 * onLoadEvent.on((result) => {
 *   console.log('加载完成:', result)
 * })
 *
 * // 监听加载进度
 * onProgressEvent.on((event) => {
 *   console.log(`加载进度: ${Math.round((event.loaded / event.total) * 100)}%`)
 * })
 *
 * // 监听加载错误
 * onErrorEvent.on((err) => {
 *   console.error('加载错误:', err)
 * })
 * ```
 */
export function useLoading<D, E, P, S>() {
  const loading = ref(false)
  const complete = ref(false)
  const loaded = ref(0)
  const total = ref(0)
  const progress = computed(() => total.value > 0 ? loaded.value / total.value : 0)
  const data: ShallowRef<D | null> = shallowRef(null)
  const error: ShallowRef<E | null> = shallowRef(null)
  const onStartEvent = createEventHook<[S]>()
  const onLoadEvent = createEventHook<[D]>()
  const onProgressEvent = createEventHook<[P]>()
  const onErrorEvent = createEventHook<[E]>()

  return {
    loading,
    complete,
    loaded,
    total,
    progress,
    data,
    error,
    onStartEvent,
    onLoadEvent,
    onProgressEvent,
    onErrorEvent,
  }
}
