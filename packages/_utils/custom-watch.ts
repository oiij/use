import type { MaybeRefOrGetter, Ref, TemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import { ref, toValue, watch, watchEffect } from 'vue'

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
export function watchElementSize(templateRef: TemplateRef<HTMLElement>, callback?: (size: { width: number, height: number }) => void) {
  const { width, height } = useElementSize(templateRef)
  watch([width, height], ([width, height]) => {
    if (width > 0 && height > 0) {
      callback?.({ width, height })
    }
  })
  return {
    width,
    height,
  }
}
