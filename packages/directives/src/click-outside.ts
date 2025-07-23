import type { Directive } from 'vue'

type BindingValue = (ev: MouseEvent) => void
type TargetElement = HTMLElement & {
  _click_outside_callBack?: BindingValue
  _click_outside_controller?: AbortController
}
export const clickOutside: Directive<TargetElement, BindingValue> = {
  mounted(target, binding) {
    if (!(typeof binding.value === 'function')) {
      return console.warn('ClickOutside: value is not a function')
    }
    target._click_outside_callBack = binding.value
    target._click_outside_controller = new AbortController()
    document.addEventListener('click', (ev) => {
      if (!target.contains(ev.target as Node)) {
        target._click_outside_callBack?.(ev)
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
