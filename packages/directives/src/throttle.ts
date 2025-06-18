import type { Directive, DirectiveBinding } from 'vue'

type BindingValue = (ev: MouseEvent | TouchEvent) => void
type TargetElement = HTMLElement & {
  _throttle_delay: number
  _throttle_callBack?: BindingValue
  _throttle_controller?: AbortController
}
function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._throttle_delay = binding.arg ? Number(binding.arg) : 500
  target._throttle_callBack = binding.value
}

export const throttle: Directive = {
  beforeMount(target: TargetElement, binding: DirectiveBinding<BindingValue, 'immediate'>) {
    if (!(typeof binding.value === 'function')) {
      return console.warn('Throttle: value is not a function')
    }
    setValue(target, binding)
    target._throttle_controller = new AbortController()

    const immediate = binding.modifiers.immediate ?? false

    let timer: any = null

    target.addEventListener('click', (ev: MouseEvent | TouchEvent) => {
      if (immediate) {
        if (!timer) {
          target._throttle_callBack?.(ev)
          timer = setTimeout(() => {
            timer = null
          }, target._throttle_delay)
        }
      }
      else {
        if (!timer) {
          timer = setTimeout(() => {
            target._throttle_callBack?.(ev)
            timer = null
          }, target._throttle_delay)
        }
      }
    }, {
      signal: target._throttle_controller.signal,
    })
  },
  updated(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    if (!(typeof binding.value === 'function')) {
      return console.warn('longPress: value is not a function')
    }
    setValue(target, binding)
  },
  unmounted(target: TargetElement) {
    target._throttle_controller?.abort()
  },
}
