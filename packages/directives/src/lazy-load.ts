import type { Directive, DirectiveBinding } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = string

/**
 * 目标元素类型
 */
type TargetElement = HTMLImageElement & {
  _lazy_load_src: BindingValue
  _lazy_load_observer: IntersectionObserver
}

function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._lazy_load_src = binding.value
}

/**
 * 图片懒加载指令
 *
 * 当图片进入视口时才加载图片
 *
 * @example
 * ```vue
 * <template>
 *   <img v-lazy-load="imageUrl" alt="懒加载图片" />
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 *
 * const imageUrl = ref('https://example.com/image.jpg')
 * </script>
 * ```
 */
export const lazyLoad: Directive<TargetElement, BindingValue> = {
  mounted(target, binding) {
    if (!(typeof binding.value === 'string')) {
      return console.warn('LazyLoad: value is not a string')
    }
    setValue(target, binding)
    target._lazy_load_observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        target.src = target._lazy_load_src
        target._lazy_load_observer.unobserve(target)
        target._lazy_load_observer.disconnect()
      }
    }, { threshold: 1 })
    target._lazy_load_observer.observe(target)
  },
  updated(target, binding) {
    if (!(typeof binding.value === 'string')) {
      return console.warn('LazyLoad: value is not a string')
    }
    if (binding.oldValue === binding.value) {
      return
    }
    setValue(target, binding)
  },
  unmounted(target) {
    target._lazy_load_observer.unobserve(target)
    target._lazy_load_observer.disconnect()
  },
}
