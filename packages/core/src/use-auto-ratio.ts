import type { MaybeComputedElementRef } from '@vueuse/core'
import type { TemplateRef } from 'vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, watchEffect } from 'vue'

/**
 * 自动计算元素尺寸，保持指定的宽高比
 *
 * @param templateRef - 要应用尺寸的元素引用
 * @param ratio - 目标宽高比 (宽度/高度)，默认为 1
 * @param target - 参考尺寸的目标元素，默认为窗口
 * @returns 包含元素引用、计算宽度和高度的对象
 *
 * @example
 * ```vue
 * <template>
 *   <div ref="container">
 *     <div ref="targetRef"></div>
 *   </div>
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 * import { useAutoRatio } from '@/use-auto-ratio'
 *
 * const container = ref(null)
 * const targetRef = ref(null)
 *
 * // 保持 16:9 的宽高比，参考容器尺寸
 * const { width, height } = useAutoRatio(targetRef, 16/9, container)
 * </script>
 * ```
 */
export function useAutoRatio(
  templateRef?: TemplateRef<HTMLElement>,
  ratio = 1,
  target?: MaybeComputedElementRef,
) {
  // 获取目标元素尺寸
  const targetElementSize = useElementSize(target)
  // 获取窗口尺寸
  const windowSize = useWindowSize()

  // 计算目标宽度：如果指定了目标元素则使用其宽度，否则使用窗口宽度
  const targetWidth = computed(() => target ? targetElementSize.width.value : windowSize.width.value)
  // 计算目标高度：如果指定了目标元素则使用其高度，否则使用窗口高度
  const targetHeight = computed(() => target ? targetElementSize.height.value : windowSize.height.value)

  // 计算目标区域的宽高比
  const aspectRatio = computed(() => {
    // 避免除以零
    if (targetHeight.value === 0)
      return Infinity
    return targetWidth.value / targetHeight.value
  })

  // 计算元素宽度：根据宽高比与目标宽高比的比较确定
  const width = computed(() => {
    // 如果目标区域的宽高比大于指定的宽高比，则以目标高度为基准计算宽度
    // 否则直接使用目标宽度
    return aspectRatio.value > ratio ? targetHeight.value * ratio : targetWidth.value
  })

  // 计算元素高度：根据宽高比与目标宽高比的比较确定
  const height = computed(() => {
    // 如果目标区域的宽高比大于指定的宽高比，则直接使用目标高度
    // 否则以目标宽度为基准计算高度
    return aspectRatio.value > ratio ? targetHeight.value : targetWidth.value / ratio
  })

  // 监听尺寸变化并更新元素样式
  watchEffect(() => {
    // 确保模板引用存在且有值
    if (templateRef && templateRef.value) {
      // 设置元素宽度
      templateRef.value.style.width = `${width.value}px`
      // 设置元素高度
      templateRef.value.style.height = `${height.value}px`
    }
  })

  return {
    templateRef,
    width,
    height,
  }
}

/**
 * useAutoRatio 函数的返回类型
 */
export type UseAutoRatioReturns = ReturnType<typeof useAutoRatio>
