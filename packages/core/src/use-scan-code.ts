import { createEventHook, useEventListener } from '@vueuse/core'
import { readonly, ref } from 'vue'

/**
 * 扫码输入监听钩子函数
 *
 * 用于监听键盘输入，识别扫码枪输入的内容。扫码枪通常会快速连续输入字符，
 * 并在最后发送一个 Enter 键。此钩子通过检测输入速度和 Enter 键来识别扫码输入。
 *
 * @returns 返回扫码相关的状态和事件监听方法
 *
 * @example
 * ```ts
 * const { value, pending, onScan } = useScanCode()
 *
 * onScan((code) => {
 *   console.log('扫码结果:', code)
 * })
 * ```
 */
export function useScanCode() {
  const valueRef = ref('')
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
      valueRef.value = tempStr
      onScanEvent.trigger(valueRef.value)
      tempStr = ''
    }

    if (key.length === 1) {
      tempStr += key
    }
  }

  useEventListener(window, 'keydown', onKeyDown)

  return {
    value: readonly(valueRef),
    pending: readonly(pending),
    onScan: onScanEvent.on,
  }
}

/**
 * useScanCode 函数的返回类型
 */
export type UseScanCodeReturns = ReturnType<typeof useScanCode>
