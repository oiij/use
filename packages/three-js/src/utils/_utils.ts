import { onUnmounted, ref, watchEffect } from 'vue'

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
export function useDisposable(disposeFn: () => void) {
  onUnmounted(() => disposeFn())
  return disposeFn
}
