import type { Directive } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = {
  /**
   * 要复制的内容
   */
  value: string
  /**
   * 复制成功回调
   */
  success?: (value: string) => void
  /**
   * 复制失败回调
   */
  error?: (value: string) => void
} | string

/**
 * 目标元素类型
 */
type TargetElement = HTMLElement & {
  _copy_value?: string
  _copy_success?: (value: string) => void
  _copy_error?: (value: string) => void
  _copy_controller?: AbortController
}

function setValue(target: TargetElement, value: BindingValue) {
  if (typeof value === 'object') {
    target._copy_value = value.value
    target._copy_success = value.success
    target._copy_error = value.error
  }
  if (typeof value === 'string') {
    target._copy_value = value
  }
}

/**
 * 复制指令
 *
 * 点击元素时复制指定内容到剪贴板
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 基本用法 -->
 *   <button v-copy="copyText">复制文本</button>
 *
 *   <!-- 带回调 -->
 *   <button v-copy="{
 *     value: copyText,
 *     success: () => console.log('复制成功'),
 *     error: () => console.log('复制失败')
 *   }">复制文本</button>
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 *
 * const copyText = ref('要复制的文本')
 * </script>
 * ```
 */
export const copy: Directive<TargetElement, BindingValue> = {
  mounted(target, binding) {
    setValue(target, binding.value)
    target._copy_controller = new AbortController()
    target.addEventListener('click', () => {
      const { _copy_value, _copy_success, _copy_error } = target
      if (!_copy_value)
        return console.warn('Copy: value is not found.')
      navigator.clipboard.writeText(_copy_value).then(() => {
        typeof _copy_success === 'function' && _copy_success(_copy_value)
      }).catch((err) => {
        typeof _copy_error === 'function' && _copy_error(err)
      })
    }, {
      signal: target._copy_controller.signal,
    })
  },
  updated(target, binding) {
    setValue(target, binding.value)
  },
  unmounted(target: TargetElement) {
    target._copy_controller?.abort()
  },
}
