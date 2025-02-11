import { isFunction } from '@oiij/utils/is'
import { onMounted, onUnmounted, ref } from 'vue'

export function useScanCode() {
  const code = ref('')
  const pending = ref(true)
  let tempStr = ''
  let timer: NodeJS.Timeout | null = null
  let onScanFun: ((code: string) => void) | null = null
  function onKeyDown(ev: KeyboardEvent) {
    if (timer) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        pending.value = true
      }, 100)
    }
    else {
      timer = setTimeout(() => {
        pending.value = true
      }, 100)
    }
    const key = ev.key

    if (pending.value)
      tempStr = ''

    pending.value = false
    if (key === 'Enter') {
      pending.value = true
      if (tempStr.length > 0) {
        code.value = tempStr
        if (onScanFun && isFunction(onScanFun))
          onScanFun(tempStr)
      }
    }

    if (!pending.value) {
      if (key.length === 1)
        tempStr += key
    }
  }
  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
  return {
    code,
    pending,
    onScan(cb: (code: string) => void) {
      onScanFun = cb
    },
  }
}
