import { createEventHook, useEventListener } from '@vueuse/core'
import { ref } from 'vue'

export function useScanCode() {
  const value = ref('')
  const pending = ref(true)
  let tempStr = ''
  let timer: NodeJS.Timeout

  const onScanEvent = createEventHook<string>()
  function onKeyDown(ev: KeyboardEvent) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      pending.value = true
    }, 100)
    const key = ev.key

    if (pending.value) {
      tempStr = ''
      pending.value = false
    }

    if (key === 'Enter') {
      pending.value = true
      value.value = tempStr
      onScanEvent.trigger(value.value)
      tempStr = ''
    }

    if (key.length === 1) {
      tempStr += key
    }
  }
  useEventListener(window, 'keydown', onKeyDown)

  return {
    value,
    pending,
    onScan: onScanEvent.on,
  }
}
export type UseScanCodeReturns = ReturnType<typeof useScanCode>
