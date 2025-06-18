import type { Directive, DirectiveBinding } from 'vue'

type BindingValue = (ev: MouseEvent | TouchEvent) => void
type TargetElement = HTMLElement & {
  _debounce_delay: number
  _debounce_callBack?: BindingValue
  _debounce_controller?: AbortController
}
function setValue(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
  target._debounce_delay = binding.arg ? Number(binding.arg) : 500
  target._debounce_callBack = binding.value
}

export const debounce: Directive = {
  beforeMount(target: TargetElement, binding: DirectiveBinding<BindingValue, 'immediate'>) {
    if (!(typeof binding.value === 'function')) {
      return console.warn('Debounce: value is not a function')
    }
    setValue(target, binding)
    target._debounce_controller = new AbortController()
    const immediate = binding.modifiers.immediate ?? false
    let timer: any = null
    let triggered = false
    target.addEventListener('click', (ev: MouseEvent | TouchEvent) => {
      if (immediate) {
        if (!triggered) {
          target._debounce_callBack?.(ev)
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
          target._debounce_callBack?.(ev)
        }, target._debounce_delay)
      }
    }, {
      signal: target._debounce_controller.signal,
    })
  },
  updated(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    if (!(typeof binding.value === 'function')) {
      return console.warn('longPress: value is not a function')
    }
    setValue(target, binding)
  },
  unmounted(target: TargetElement) {
    target._debounce_controller?.abort()
  },
}
