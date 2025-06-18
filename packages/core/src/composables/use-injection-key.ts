import type { InjectionKey } from 'vue'

export function useInjectionKey<T>(key: string): InjectionKey<T> {
  return Symbol(key)
}
export type UseInjectionKeyReturns<T> = ReturnType<typeof useInjectionKey<T>>
