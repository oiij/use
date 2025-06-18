import type { Directive, DirectiveBinding } from 'vue'

type BindingValue = {
  value: string
  success?: (value: string) => void
  error?: (value: string) => void
} | string
type TargetElement = HTMLElement & {
  _copy_value?: string
  _copy_success?: (value: string) => void
  _copy_error?: (value: string) => void
  _copy_controller?: AbortController
}
function setValue(target: TargetElement, value: BindingValue) {
  if (typeof value === 'object') {
    target._copy_value = value.value.toString()
    target._copy_success = value.success
    target._copy_error = value.error
  }
  else {
    target._copy_value = value.toString()
  }
}
export const copy: Directive = {
  beforeMount(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    setValue(target, binding.value)
    target._copy_controller = new AbortController()
    target.addEventListener('click', () => {
      const { _copy_value, _copy_success, _copy_error } = target
      if (!_copy_value)
        return
      navigator.clipboard.writeText(_copy_value).then(() => {
        if (!(typeof _copy_success === 'function')) {
          return console.warn('Copy: success callback is not a function')
        }
        _copy_success(_copy_value)
      }).catch((err) => {
        if (!(typeof _copy_error === 'function')) {
          return console.warn('Copy: error callback is not a function')
        }
        _copy_error(err)
      })
    }, {
      signal: target._copy_controller.signal,
    })
  },
  updated(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    setValue(target, binding.value)
  },
  unmounted(target: TargetElement) {
    target._copy_controller?.abort()
  },
}
