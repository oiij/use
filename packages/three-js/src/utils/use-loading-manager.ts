import { LoadingManager } from 'three'
import { useLoading } from './use-loading'

export type SP = { url: string, loaded: number, total: number }
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
