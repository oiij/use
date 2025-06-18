import type { ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'

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
