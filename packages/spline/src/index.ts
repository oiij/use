import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import { Application } from '@splinetool/runtime'
import { createEventHook, useElementSize } from '@vueuse/core'
import { computed, onUnmounted, ref, toValue, watch } from 'vue'

/**
 * Spline 选项类型
 */
export type UseSplineOptions = {
  /**
   * 场景 URL
   */
  scene?: MaybeRefOrGetter<string>
  /**
   * 是否手动控制加载
   * @default false
   */
  manual?: boolean
  /**
   * 是否禁用自动加载
   * @default false
   */
  disableAutoLoad?: boolean
}

/**
 * 使用 Spline
 *
 * @param templateRef - Spline 容器的模板引用
 * @param options - Spline 选项
 * @returns Spline 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useSpline } from '@oiij/spline'
 *
 * const canvasRef = ref()
 * const sceneUrl = ref('https://example.com/scene.splinecode')
 * const { app, isLoading, error, onLoaded, onError } = useSpline(canvasRef, {
 *   scene: sceneUrl
 * })
 *
 * onLoaded(() => {
 *   console.log('Scene loaded')
 * })
 * </script>
 *
 * <template>
 *   <div ref="canvasRef" style="width: 100%; height: 400px;"></div>
 *   <div v-if="isLoading">Loading...</div>
 *   <div v-if="error">{{ error.message }}</div>
 * </template>
 * ```
 */
export function useSpline(templateRef: TemplateRef<HTMLElement>, options?: UseSplineOptions) {
  const { manual, disableAutoLoad, scene } = options ?? {}

  const app = ref<Application | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  let canvasEl: HTMLCanvasElement | null = null

  const onCreatedEvent = createEventHook<[Application]>()
  const onLoadedEvent = createEventHook<[Application]>()
  const onErrorEvent = createEventHook<[Error]>()
  const onDisposedEvent = createEventHook<[]>()

  const { width, height } = useElementSize(templateRef)

  /**
   * 加载场景
   *
   * @param sceneUrl - 场景 URL
   */
  async function load(sceneUrl: string) {
    if (!templateRef.value) {
      return
    }

    try {
      isLoading.value = true
      error.value = null
      if (!canvasEl) {
        canvasEl = document.createElement('canvas')
        templateRef.value.appendChild(canvasEl)
      }
      const spline = new Application(canvasEl)
      await spline.load(sceneUrl)

      app.value = spline
      canvasEl = spline.canvas

      onCreatedEvent.trigger(spline)
      onLoadedEvent.trigger(spline)
    }
    catch (err) {
      const e = err instanceof Error ? err : new Error(String(err))
      error.value = e
      onErrorEvent.trigger(e)
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * 重新加载当前场景
   */
  function reload() {
    const sceneUrl = toValue(scene)
    if (sceneUrl) {
      dispose()
      load(sceneUrl)
    }
  }

  /**
   * 销毁 Spline 实例
   *
   * @example
   * ```ts
   * import { useSpline } from '@oiij/spline'
   *
   * const { dispose } = useSpline(canvasRef)
   * // 当需要销毁时调用
   * dispose()
   * ```
   */
  function dispose() {
    if (app.value) {
      app.value.dispose()
      app.value = null
    }
    if (canvasEl && templateRef.value) {
      templateRef.value.removeChild(canvasEl)
      canvasEl = null
    }
    onDisposedEvent.trigger()
  }

  const shouldLoad = computed(() => {
    return !manual && !disableAutoLoad && toValue(scene) && templateRef.value
  })

  watch(
    [() => toValue(scene), () => toValue(shouldLoad)],
    ([sceneUrl, should], [oldSceneUrl]) => {
      if (should && sceneUrl && sceneUrl !== oldSceneUrl) {
        dispose()
        load(sceneUrl)
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    dispose()
  })

  return {
    templateRef,
    app,
    isLoading,
    error,
    width,
    height,
    load,
    reload,
    dispose,
    onCreated: onCreatedEvent.on,
    onLoaded: onLoadedEvent.on,
    onError: onErrorEvent.on,
    onDisposed: onDisposedEvent.on,
  }
}
