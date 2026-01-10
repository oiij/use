import type { BladeController, View } from '@tweakpane/core'
import type { BladeApi } from 'tweakpane'
import type { PaneConfig } from 'tweakpane/dist/types/pane/pane-config'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { Pane } from 'tweakpane'
import { ref, watchEffect } from 'vue'
import { useDisposable } from '../utils/_utils'

// 面板控制器插件
export type FPSGraph = {
  begin: () => void
  end: () => void
} & BladeApi<BladeController<View>>
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
