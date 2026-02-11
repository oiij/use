import type { MaybeComputedElementRef } from '@vueuse/core'
import type { TemplateRef } from 'vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, watchEffect } from 'vue'

/**
 * 自动计算元素尺寸，保持指定的宽高比
 *
 * @param templateRef 要应用尺寸的元素引用
 * @param ratio 目标宽高比（宽度/高度），默认为 1
 * @param target 参考尺寸的目标元素，默认为窗口
 * @returns 包含元素引用、计算宽度和高度的对象
 *
 * @example
 * // 保持 16:9 的宽高比，参考容器尺寸
 * const container = ref(null)
 * const targetRef = ref(null)
 * const { width, height } = useAutoRatio(targetRef, 16/9, container)
 *
 * @example
 * // 保持 4:3 的宽高比，参考窗口尺寸
 * const { width, height } = useAutoRatio(elRef, 4/3)
 */
export function useAutoRatio(templateRef?: TemplateRef<HTMLElement>, ratio = 1, target?: MaybeComputedElementRef) {
  const targetElementSize = useElementSize(target)
  const windowSize = useWindowSize()

  const targetWidth = computed(() => target ? targetElementSize.width.value : windowSize.width.value)
  const targetHeight = computed(() => target ? targetElementSize.height.value : windowSize.height.value)

  const aspectRatio = computed(() => {
    if (targetHeight.value === 0)
      return Infinity
    return targetWidth.value / targetHeight.value
  })

  const width = computed(() => {
    return aspectRatio.value > ratio ? targetHeight.value * ratio : targetWidth.value
  })

  const height = computed(() => {
    return aspectRatio.value > ratio ? targetHeight.value : targetWidth.value / ratio
  })

  watchEffect(() => {
    if (templateRef && templateRef.value) {
      templateRef.value.style.width = `${width.value}px`
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
 * 包含元素引用、计算宽度和高度
 * @example
 * const ratio: UseAutoRatioReturns = useAutoRatio(elRef, 16/9)
 */
export type UseAutoRatioReturns = ReturnType<typeof useAutoRatio>
