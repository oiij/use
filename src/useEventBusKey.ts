import type { EventBusKey } from '@vueuse/core'

export function useEventBusKey<T>(key: string): EventBusKey<T> {
  return Symbol(key)
}
