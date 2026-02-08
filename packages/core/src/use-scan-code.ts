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
 * ```typescript
 * import { useScanCode } from '@/core'
 *
 * const { value, pending, onScan } = useScanCode()
 *
 * // 监听扫码完成事件
 * onScan((code) => {
 *   console.log('扫码结果:', code)
 *   // 处理扫码逻辑
 * })
 *
 * // 访问当前扫码值
 * console.log('当前扫码值:', value.value)
 *
 * // 检查是否正在扫码中
 * console.log('是否正在扫码:', pending.value)
 * ```
 */
export function useScanCode() {
  /** 扫码结果值的响应式引用 */
  const valueRef = ref('')

  /**
   * 扫码状态的响应式引用
   * - true: 等待扫码开始（初始状态）
   * - false: 正在扫码中
   */
  const pending = ref(true)

  /** 临时存储扫码输入的字符串 */
  let tempStr = ''

  /** 用于检测输入间隔的定时器 */
  let timer: NodeJS.Timeout

  /** 扫码完成事件钩子 */
  const onScanEvent = createEventHook<string>()

  /**
   * 键盘按下事件处理函数
   * @param ev 键盘事件对象
   */
  function onKeyDown(ev: KeyboardEvent) {
    // 清除之前的定时器
    clearTimeout(timer)

    // 设置新的定时器，100ms 无输入则认为扫码结束
    timer = setTimeout(() => {
      pending.value = true
    }, 100)

    const key = ev.key

    // 如果处于待扫码状态，开始新的扫码
    if (pending.value) {
      tempStr = ''
      pending.value = false
    }

    // 当按下 Enter 键时，扫码完成
    if (key === 'Enter') {
      pending.value = true
      valueRef.value = tempStr
      onScanEvent.trigger(valueRef.value)
      tempStr = ''
    }

    // 只添加单个字符（过滤掉 Ctrl、Alt 等功能键）
    if (key.length === 1) {
      tempStr += key
    }
  }

  // 监听全局键盘按下事件
  useEventListener(window, 'keydown', onKeyDown)

  return {
    /** 扫码结果值（只读） */
    value: readonly(valueRef),

    /** 扫码状态（只读） */
    pending: readonly(pending),

    /** 扫码完成事件监听方法 */
    onScan: onScanEvent.on,
  }
}

/** useScanCode 函数的返回类型 */
export type UseScanCodeReturns = ReturnType<typeof useScanCode>
