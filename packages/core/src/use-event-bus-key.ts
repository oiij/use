import type { EventBusKey } from '@vueuse/core'

export function useEventBusKey<T>(key = 'key'): EventBusKey<T> {
  return Symbol(key)
}
export type UseEventBusKeyReturns = ReturnType<typeof useEventBusKey>
