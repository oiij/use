import type { Directive, DirectiveBinding } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = (ev: MouseEvent | TouchEvent) => void

/**
 * 目标元素类型
 */
type TargetElement = HTMLElement & {
  _throttle_delay: number
  _throttle_callBack?: BindingValue
  _throttle_controller?: AbortController
}

function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._throttle_delay = binding.arg ? Number(binding.arg) : 500
  target._throttle_callBack = binding.value
}

/**
 * 节流指令
 *
 * 为点击事件添加节流功能
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 基本用法，默认 500ms 节流 -->
 *   <button v-throttle="handleClick">点击按钮</button>
 *
 *   <!-- 自定义延迟时间，1000ms 节流 -->
 *   <button v-throttle:1000="handleClick">点击按钮</button>
 *
 *   <!-- 立即执行，然后节流 -->
 *   <button v-throttle.immediate="handleClick">点击按钮</button>
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
export const throttle: Directive<TargetElement, BindingValue, 'immediate'> = {
  mounted(target, binding) {
    setValue(target, binding)
    target._throttle_controller = new AbortController()

    const immediate = binding.modifiers.immediate ?? false

    let timer: any = null

    target.addEventListener('click', (ev: MouseEvent | TouchEvent) => {
      if (immediate) {
        if (!timer) {
          typeof target._throttle_callBack === 'function' && target._throttle_callBack(ev)
          timer = setTimeout(() => {
            timer = null
          }, target._throttle_delay)
        }
      }
      else {
        if (!timer) {
          timer = setTimeout(() => {
            typeof target._throttle_callBack === 'function' && target._throttle_callBack(ev)
            timer = null
          }, target._throttle_delay)
        }
      }
    }, {
      signal: target._throttle_controller.signal,
    })
  },
  updated(target, binding) {
    setValue(target, binding)
  },
  unmounted(target) {
    target._throttle_controller?.abort()
  },
}
