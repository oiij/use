import type { MaybeRefOrGetter, Ref } from 'vue'
import { ref, toValue, watch, watchEffect } from 'vue'

/**
 * 监听一个 MaybeRefOrGetter 值并返回对应的 Ref
 * 当源值变化时同步更新返回的 Ref，并可选择触发回调
 * @param value 响应式或普通值
 * @param callback 值变化时的回调（可选）
 * @returns 与源值同步的 Ref
 * @example
 * const url = ref('wss://example.com')
 * const urlRef = watchRefOrGetter(url, (val) => {
 *   console.log('url 变化:', val)
 * })
 */
export function watchRefOrGetter<T>(value: MaybeRefOrGetter<T>, callback?: (value: T) => void) {
  const refValue = ref(toValue(value))
  watchEffect(() => {
    refValue.value = toValue(value)
  })
  watch(refValue, (val) => {
    callback?.(val)
  })
  return refValue as Ref<T>
}

/**
 * 向数组追加元素并限制最大长度
 * 超过最大长度时移除最早的元素（先进先出）
 * @param arr 目标数组
 * @param item 要追加的元素
 * @param max 最大长度
 * @example
 * const list: number[] = []
 * pushLimited(list, 1, 2) // [1]
 * pushLimited(list, 2, 2) // [1, 2]
 * pushLimited(list, 3, 2) // [2, 3]
 */
export function pushLimited<T>(arr: T[], item: T, max: number) {
  arr.push(item)
  if (arr.length > max) {
    arr.shift()
  }
}
