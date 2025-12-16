import type { MaybeComputedElementRef } from '@vueuse/core'
import type { TemplateRef } from 'vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, watchEffect } from 'vue'

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

  const width = computed(() => aspectRatio.value > ratio ? targetHeight.value * ratio : targetWidth.value)

  const height = computed(() => aspectRatio.value > ratio ? targetHeight.value : targetWidth.value / ratio)

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
export type UseAutoRatioReturns = ReturnType<typeof useAutoRatio>
