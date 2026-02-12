import type { BladeController, View } from '@tweakpane/core'
import type { BladeApi } from 'tweakpane'
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { Pane } from 'tweakpane'
import { ref, watchEffect } from 'vue'
import { useDisposable } from '../utils/_utils'

/**
 * FPS 图表类型
 */
export type FPSGraph = {
  /**
   * 开始记录
   */
  begin: () => void
  /**
   * 结束记录
   */
  end: () => void
} & BladeApi<BladeController<View>>

/**
 * 使用 Tweakpane 控制面板
 *
 * @param options - 面板配置
 * @returns 面板实例、FPS 图表和控制方法
 *
 * @example
 * ```ts
 * import { usePane } from '@oiij/three-js/plugins'
 *
 * const { pane, fpsGraph, show, dispose } = usePane()
 *
 * // 添加控制器
 * pane.addInput({ value: 1 }, 'value', {
 *   min: 0,
 *   max: 10,
 *   step: 0.1
 * })
 *
 * // 控制可见性
 * show.value = false // 隐藏面板
 *
 * // 记录 FPS
 * function animate() {
 *   fpsGraph.begin()
 *   // 渲染逻辑
 *   fpsGraph.end()
 *   requestAnimationFrame(animate)
 * }
 * ```
 */
export function usePane(options?: PaneConfig) {
  let container = options?.container
  if (!container) {
    container = document.createElement('div')
    document.body.appendChild(container)
    container.style.position = 'fixed'
    container.style.top = '10px'
    container.style.right = '10px'
    container.style.zIndex = '10000'
  }
  const pane = new Pane({
    container,
    ...options,
  })

  pane.registerPlugin(EssentialsPlugin)
  const fpsGraph = pane.addBlade({
    view: 'fpsgraph',
    label: 'fpsgraph',
  }) as FPSGraph

  const show = ref(true)
  watchEffect(() => {
    pane.hidden = !show.value
  })
  const dispose = useDisposable(() => {
    pane.document.close()
    pane.children.forEach(f => f.dispose())
    pane.dispose()
  })
  return {
    show,
    pane,
    fpsGraph,
    dispose,
  }
}
