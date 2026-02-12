import type { Directive, DirectiveBinding } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = (target: Element) => void

/**
 * 目标元素类型
 */
type TargetElement = HTMLElement & {
  _into_view_callBack: BindingValue
  _into_view_observer: IntersectionObserver
}

function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._into_view_callBack = binding.value
}

/**
 * 进入视口指令
 *
 * 当元素进入视口时触发回调函数
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 基本用法 -->
 *   <div v-into-view="handleIntoView">
 *     当我进入视口时触发回调
 *   </div>
 *
 *   <!-- 仅触发一次 -->
 *   <div v-into-view.once="handleIntoViewOnce">
 *     当我进入视口时仅触发一次回调
 *   </div>
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 *
 * const handleIntoView = (element) => {
 *   console.log('元素进入视口', element)
 * }
 *
 * const handleIntoViewOnce = (element) => {
 *   console.log('元素进入视口（仅一次）', element)
 * }
 * </script>
 * ```
 */
export const intoView: Directive<TargetElement, BindingValue, 'once'> = {
  mounted(target, binding) {
    setValue(target, binding)
    const once = binding.modifiers.once ?? false
    target._into_view_observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeof target._into_view_callBack === 'function' && target._into_view_callBack(entry.target)
          if (once) {
            target._into_view_observer.unobserve(target)
            target._into_view_observer.disconnect()
          }
        }
      })
    }, { threshold: 1 })
    target._into_view_observer.observe(target)
  },
  updated(target, binding) {
    setValue(target, binding)
  },
  unmounted(target) {
    target._into_view_observer.unobserve(target)
    target._into_view_observer.disconnect()
  },
}
