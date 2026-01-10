import type { Loader, LoadingManager } from 'three'
import { useLoading } from './use-loading'
import { useLoadingManager } from './use-loading-manager'

export type LoaderOptions = {
  manager?: LoadingManager
  manual?: boolean
}
export type LoaderProto<T> = new (manager?: LoadingManager) => Loader<T>
export function useLoader<T>(Loader: LoaderProto<T>, path?: string, options?: LoaderOptions) {
  const { manager, manual = false } = options ?? {}
  const managerRef = useLoadingManager(manager)
  const loader = new Loader(managerRef.manager)

  const { loading, complete, progress, loaded, total, data, error, onLoadEvent, onProgressEvent, onErrorEvent } = useLoading<T, unknown, ProgressEvent, void>()

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
