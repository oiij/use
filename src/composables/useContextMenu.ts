import { nextTick, ref } from 'vue'

export function useContextMenu() {
  const x = ref(0)
  const y = ref(0)
  const show = ref(false)
  function contextMenuEvent(e: MouseEvent) {
    e.preventDefault()
    show.value = false
    nextTick(() => {
      show.value = true
      x.value = e.clientX
      y.value = e.clientY
    })
  }
  function hide() {
    show.value = false
  }
  return {
    x,
    y,
    show,
    hide,
    contextMenuEvent,
  }
}
