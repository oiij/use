import type { CNode } from 'css-render'
import { useSsrAdapter } from '@css-render/vue3-ssr'
import { onBeforeMount } from 'vue'

/**
 * 使用样式
 *
 * @param mountId - 样式挂载的 ID
 * @param style - CSS Render 节点
 *
 * @example
 * ```ts
 * import { useStyle } from '@oiij/css-render'
 * import { cssr } from './cssr'
 *
 * const style = cssr.node('body', {
 *   margin: 0,
 *   padding: 0,
 * })
 *
 * useStyle('global-style', style)
 * ```
 */
export function useStyle(mountId: string, style: CNode) {
  const ssrAdapter = useSsrAdapter()
  function mountStyle() {
    style.mount({
      id: mountId,
      head: true,
      ssr: ssrAdapter,
    })
  }
  if (ssrAdapter) {
    mountStyle()
  }
  else {
    onBeforeMount(() => {
      mountStyle()
    })
  }
}
