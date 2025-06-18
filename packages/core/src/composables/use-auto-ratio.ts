import type { MaybeComputedElementRef } from '@vueuse/core'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'

export function useAutoRatio(ratio = 1, target?: MaybeComputedElementRef) {
  const domRef = ref<HTMLElement>()

  const elementSize = useElementSize(target)
  const windowSize = useWindowSize()

  const targetWidth = computed(() => domRef.value ? elementSize.width.value : windowSize.width.value)
  const targetHeight = computed(() => domRef.value ? elementSize.height.value : windowSize.height.value)

  const aspectRatio = computed(() => {
    if (targetHeight.value === 0)
      return Infinity
    return targetWidth.value / targetHeight.value
  })

  const width = computed(() => aspectRatio.value > ratio ? targetHeight.value * ratio : targetWidth.value)

  const height = computed(() => aspectRatio.value > ratio ? targetHeight.value : targetWidth.value / ratio)

  watchEffect(() => {
    if (domRef.value) {
      domRef.value.style.width = `${width.value}px`
      domRef.value.style.height = `${height.value}px`
    }
  })
  return {
    domRef,
    width,
    height,
  }
}
export type UseAutoRatioReturns = ReturnType<typeof useAutoRatio>
