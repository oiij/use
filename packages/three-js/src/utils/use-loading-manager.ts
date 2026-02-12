import { LoadingManager } from 'three'
import { useLoading } from './use-loading'

/**
 * 加载进度类型
 */
export type SP = {
  /**
   * 加载 URL
   */
  url: string
  /**
   * 已加载字节数
   */
  loaded: number
  /**
   * 总字节数
   */
  total: number
}

/**
 * 使用加载管理器
 *
 * @param _manager - 加载管理器实例，可选，如果不提供则创建新实例
 * @returns 加载管理器实例、状态和事件监听方法
 *
 * @example
 * ```ts
 * import { useLoadingManager } from '@oiij/three-js/utils'
 *
 * const { manager, loading, complete, onProgress } = useLoadingManager()
 *
 * onProgress(({ url, loaded, total }) => {
 *   console.log(`加载 ${url}: ${Math.round((loaded / total) * 100)}%`)
 * })
 *
 * // 传递给加载器
 * const loader = new TextureLoader(manager)
 * ```
 */
export function useLoadingManager(_manager?: LoadingManager) {
  const manager = _manager instanceof LoadingManager ? _manager : new LoadingManager()
  const { loading, complete, loaded, total, progress, error, onStartEvent, onLoadEvent, onProgressEvent, onErrorEvent } = useLoading<void, string, SP, SP>()

  manager.onStart = (url, loaded, total) => {
    loading.value = true
    complete.value = false
    onStartEvent.trigger({ url, loaded, total })
  }

  manager.onLoad = () => {
    loading.value = false
    complete.value = true
    onLoadEvent.trigger()
  }

  manager.onProgress = (url, _loaded, _total) => {
    loading.value = true
    loaded.value = _loaded
    total.value = _total
    onProgressEvent.trigger({ url, loaded: _loaded, total: _total })
  }

  manager.onError = (url) => {
    loading.value = false
    error.value = url
    onErrorEvent.trigger(url)
  }

  return {
    manager,
    loading,
    complete,
    loaded,
    total,
    progress,
    error,
    onStart: onStartEvent.on,
    onLoad: onLoadEvent.on,
    onProgress: onProgressEvent.on,
    onError: onErrorEvent.on,
  }
}
