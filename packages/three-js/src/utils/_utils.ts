import { onUnmounted, ref, watchEffect } from 'vue'

/**
 * 监听光源可见性
 *
 * @param light - 光源对象
 * @param light.visible - 光源可见性
 * @param light.dispose - 光源销毁函数
 *
 * @returns 控制光源可见性的响应式对象
 *
 * @example
 * ```ts
 * import { watchVisible } from '@oiij/three-js/utils'
 * import { PointLight } from 'three'
 *
 * const light = new PointLight(0xffffff, 1, 100)
 * const { show } = watchVisible(light)
 *
 * // 控制光源可见性
 * show.value = false // 隐藏光源
 * show.value = true  // 显示光源
 * ```
 */
export function watchVisible(light: { visible: boolean, dispose: () => void }) {
  const show = ref(true)
  watchEffect(() => {
    light.visible = show.value
  })
  onUnmounted(() => {
    light.dispose()
  })
  return {
    show,
  }
}

/**
 * 使用可销毁对象
 *
 * @param disposeFn - 销毁函数
 * @returns 销毁函数
 *
 * @example
 * ```ts
 * import { useDisposable } from '@oiij/three-js/utils'
 *
 * const dispose = useDisposable(() => {
 *   // 清理资源
 *   console.log('清理资源')
 * })
 *
 * // 手动调用销毁
 * dispose()
 * ```
 */
export function useDisposable(disposeFn: () => void) {
  onUnmounted(() => disposeFn())
  return disposeFn
}
