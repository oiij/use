import type { Loader, LoadingManager } from 'three'
import { useLoading } from './use-loading'
import { useLoadingManager } from './use-loading-manager'

/**
 * 加载器选项
 */
export type LoaderOptions = {
  /**
   * 加载管理器
   */
  manager?: LoadingManager
  /**
   * 是否手动加载
   * @default false
   */
  manual?: boolean
}

/**
 * 加载器原型
 */
export type LoaderProto<T> = new (manager?: LoadingManager) => Loader<T>

/**
 * 使用加载器
 *
 * @param Loader - 加载器类
 * @param path - 加载路径
 * @param options - 加载器选项
 * @returns 加载器实例、状态和控制方法
 *
 * @example
 * ```ts
 * import { useLoader } from '@oiij/three-js/utils'
 * import { TextureLoader } from 'three'
 *
 * const { loading, complete, data, onLoad } = useLoader(TextureLoader, 'texture.jpg')
 *
 * onLoad((texture) => {
 *   console.log('纹理加载完成:', texture)
 * })
 *
 * // 手动加载
 * const { load } = useLoader(TextureLoader, undefined, {
 *   manual: true
 * })
 *
 * // 触发加载
 * await load('texture.jpg')
 * ```
 */
export function useLoader<T>(Loader: LoaderProto<T>, path?: string, options?: LoaderOptions) {
  const { manager, manual = false } = options ?? {}
  const managerRef = useLoadingManager(manager)
  const loader = new Loader(managerRef.manager)

  const { loading, complete, progress, loaded, total, data, error, onLoadEvent, onProgressEvent, onErrorEvent } = useLoading<T, unknown, ProgressEvent, void>()

  /**
   * 加载资源
   *
   * @param _path - 加载路径，可选，如果不提供则使用构造函数中传入的路径
   * @returns 加载的资源
   */
  function load(_path?: string) {
    return new Promise<T>((resolve, reject) => {
      if (!_path && !path) {
        error.value = new Error('path is required')
        return reject(error.value)
      }

      loading.value = true
      complete.value = false
      data.value = null
      error.value = null

      loader.load(_path ?? path ?? '', (_data) => {
        loading.value = false
        complete.value = true
        data.value = _data
        onLoadEvent.trigger(_data)
        return resolve(_data)
      }, (_progress) => {
        loading.value = true
        complete.value = false
        loaded.value = _progress.loaded
        total.value = _progress.total
        onProgressEvent.trigger(_progress)
      }, (err) => {
        loading.value = false
        error.value = err
        onErrorEvent.trigger(err)
        return reject(err)
      })
    })
  }

  if (!manual) {
    load()
  }

  return {
    managerRef,
    loader,
    progress,
    loading,
    complete,
    data,
    error,
    onLoad: onLoadEvent.on,
    onProgress: onProgressEvent.on,
    onError: onErrorEvent.on,
    load,
  }
}
