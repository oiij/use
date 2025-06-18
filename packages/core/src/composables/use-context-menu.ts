import { useEventListener } from '@vueuse/core'
import { nextTick, ref } from 'vue'

export function useContextMenu() {
  const domRef = ref<HTMLElement>()
  const x = ref(0)
  const y = ref(0)
  const show = ref(false)
  function contextMenuEvent(e: MouseEvent) {
    e.preventDefault()
    hide()
    nextTick(() => {
      show.value = true
      x.value = e.clientX
      y.value = e.clientY
    })
  }
  function hide() {
    show.value = false
  }
  useEventListener(domRef, 'contextmenu', contextMenuEvent)
  return {
    domRef,
    x,
    y,
    show,
    hide,
    contextMenuEvent,
  }
}
export type UseContextMenuReturns = ReturnType<typeof useContextMenu>
