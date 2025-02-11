import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

export function useAutoRatio(ratio: number | undefined = 1) {
  const domRef = ref<HTMLElement>()
  const { width: targetWidth, height: targetHeight } = domRef?.value ? useElementSize(domRef) : useWindowSize()
  const width = computed(() => {
    if (targetWidth.value / targetHeight.value > ratio)
      return targetHeight.value * ratio
    return targetWidth.value
  })
  const height = computed(() => {
    if (targetWidth.value / targetHeight.value > ratio)
      return targetHeight.value
    return targetWidth.value / ratio
  })

  return {
    width,
    height,
  }
}
