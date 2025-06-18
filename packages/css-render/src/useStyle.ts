import type { CNode } from 'css-render'
import { useSsrAdapter } from '@css-render/vue3-ssr'
import { onBeforeMount } from 'vue'

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
