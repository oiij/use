import type { Directive, DirectiveBinding } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = (ev: MouseEvent | TouchEvent) => void

/**
 * 目标元素类型
 */
type TargetElement = HTMLElement & {
  _debounce_delay: number
  _debounce_callBack?: BindingValue
  _debounce_controller?: AbortController
}

function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._debounce_delay = binding.arg ? Number(binding.arg) : 500
  target._debounce_callBack = binding.value
}

/**
 * 防抖指令
 *
 * 为点击事件添加防抖功能
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 基本用法，默认 500ms 防抖 -->
 *   <button v-debounce="handleClick">点击按钮</button>
 *
 *   <!-- 自定义延迟时间，1000ms 防抖 -->
 *   <button v-debounce:1000="handleClick">点击按钮</button>
 *
 *   <!-- 立即执行，然后防抖 -->
 *   <button v-debounce.immediate="handleClick">点击按钮</button>
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 *
 * const handleClick = (event) => {
 *   console.log('点击事件触发', event)
 * }
 * </script>
 * ```
 */
export const debounce: Directive<TargetElement, BindingValue, 'immediate'> = {
  mounted(target, binding) {
    setValue(target, binding)
    target._debounce_controller = new AbortController()
    const immediate = binding.modifiers.immediate ?? false
    let timer: any = null
    let triggered = false
    target.addEventListener('click', (ev: MouseEvent | TouchEvent) => {
      if (immediate) {
        if (!triggered) {
          typeof target._debounce_callBack === 'function' && target._debounce_callBack(ev)
          triggered = true
        }
        else {
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            triggered = false
          }, target._debounce_delay)
        }
      }
      else {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          typeof target._debounce_callBack === 'function' && target._debounce_callBack(ev)
        }, target._debounce_delay)
      }
    }, {
      signal: target._debounce_controller.signal,
    })
  },
  updated(target, binding) {
    if (!(typeof binding.value === 'function')) {
      return console.warn('debounce: value is not a function')
    }
    setValue(target, binding)
  },
  unmounted(target: TargetElement) {
    target._debounce_controller?.abort()
  },
}
