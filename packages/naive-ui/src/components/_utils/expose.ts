import type { ComputedRef, Ref } from 'vue'
import { computed, isRef } from 'vue'

/**
 * 解包后的插槽属性类型
 * 将对象中的 ref 类型替换为其值类型，其余类型保持不变
 * @template T 暴露对象类型
 */
export type SlotProps<T extends object> = {
  [K in keyof T]: T[K] extends Ref<infer V> ? V : T[K]
}

/**
 * 创建组件暴露对象与对应的插槽属性
 * expose 保留原始 ref / 方法，slotProps 会把 ref 解包成值，便于通过 slot v-bind 传给父级
 * @template T 暴露对象类型
 * @param source 暴露对象
 * @returns expose 原始对象与解包后的 slotProps
 * @example
 * ```ts
 * const { expose, slotProps } = createExpose({ loading, list, run })
 * defineExpose(expose)
 * // 模板：<slot v-bind="slotProps" />
 * ```
 */
export function createExpose<T extends object>(source: T): { expose: T, slotProps: ComputedRef<SlotProps<T>> } {
  const slotProps = computed(() => {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(source))
      result[key] = isRef(value) ? value.value : value
    return result as unknown as SlotProps<T>
  })

  return { expose: source, slotProps }
}
