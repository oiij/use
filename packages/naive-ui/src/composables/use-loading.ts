/**
 * 用于获取 Naive UI 加载状态提供者的组合式 API
 * 提供对加载状态的全局访问
 */
import { inject } from 'vue'
import { loadingProviderInjectionKey } from '../components/loading-provider'

/**
 * 用于获取 Naive UI 加载状态提供者的组合式 API
 * @returns 加载状态提供者实例
 */
export function useLoading() {
  // 从依赖注入中获取加载状态提供者
  const loadingProvider = inject(loadingProviderInjectionKey)
  return loadingProvider
}
