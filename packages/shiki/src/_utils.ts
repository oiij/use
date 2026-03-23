import type { MaybeRefOrGetter, Ref } from 'vue'
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
