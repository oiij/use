import { inject } from 'vue'
import { loadingProviderInjectionKey } from '../components/loading-provider'

export function useLoading() {
  const loadingProvider = inject(loadingProviderInjectionKey)
  return loadingProvider
}
