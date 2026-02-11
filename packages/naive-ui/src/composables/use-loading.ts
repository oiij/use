/**
 * 用于获取 Naive UI 加载状态提供者的组合式 API
 * 提供对加载状态的全局访问
 */
import { inject } from 'vue'
import { LOADING_PROVIDER_INJECTION_KEY } from '../components/loading-provider'

/**
 * 用于获取 Naive UI 加载状态提供者的组合式 API
 * @returns 加载状态提供者实例
 * @example
 * ```ts
 * const loading = useLoading()
 * loading?.start()
 * loading?.finish()
 * ```
 */
export function useLoading() {
  const loadingProvider = inject(LOADING_PROVIDER_INJECTION_KEY)
  return loadingProvider
}
