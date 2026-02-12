import type { Directive } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = (ev: MouseEvent) => void

/**
 * 目标元素类型
 */
type TargetElement = HTMLElement & {
  _click_outside_callBack?: BindingValue
  _click_outside_controller?: AbortController
}

/**
 * 点击外部指令
 *
 * 当点击元素外部时触发回调函数
 *
 * @example
 * ```vue
 * <template>
 *   <div v-click-outside="handleClickOutside">
 *     点击外部触发回调
 *   </div>
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 *
 * const handleClickOutside = (event) => {
 *   console.log('点击了外部区域', event)
 * }
 * </script>
 * ```
 */
export const clickOutside: Directive<TargetElement, BindingValue> = {
  mounted(target, binding) {
    target._click_outside_callBack = binding.value
    target._click_outside_controller = new AbortController()
    document.addEventListener('click', (ev) => {
      if (!target.contains(ev.target as Node)) {
        typeof target._click_outside_callBack === 'function' && target._click_outside_callBack(ev)
      }
    }, {
      signal: target._click_outside_controller.signal,
    })
  },
  updated(target, binding) {
    target._click_outside_callBack = binding.value
  },
  unmounted(target) {
    target._click_outside_controller?.abort()
  },
}
