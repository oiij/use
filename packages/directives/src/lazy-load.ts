import type { Directive, DirectiveBinding } from 'vue'

type BindingValue = string
type TargetElement = HTMLImageElement & {
  _lazy_load_src: BindingValue
  _lazy_load_observer: IntersectionObserver
}
function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._lazy_load_src = binding.value
}
export const lazyLoad: Directive = {
  mounted(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
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
  updated(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    if (!(typeof binding.value === 'string')) {
      return console.warn('LazyLoad: value is not a string')
    }
    if (binding.oldValue === binding.value) {
      return
    }
    setValue(target, binding)
  },
  unmounted(target: TargetElement) {
    target._lazy_load_observer.unobserve(target)
    target._lazy_load_observer.disconnect()
  },
}
