import type { Directive } from 'vue'

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
    target._copy_value = value.value
    target._copy_success = value.success
    target._copy_error = value.error
  }
  if (typeof value === 'string') {
    target._copy_value = value
  }
}
export const copy: Directive<TargetElement, BindingValue> = {
  mounted(target, binding) {
    setValue(target, binding.value)
    target._copy_controller = new AbortController()
    target.addEventListener('click', () => {
      const { _copy_value, _copy_success, _copy_error } = target
      if (!_copy_value)
        return console.warn('Copy: value is not found.')
      navigator.clipboard.writeText(_copy_value).then(() => {
        typeof _copy_success === 'function' && _copy_success(_copy_value)
      }).catch((err) => {
        typeof _copy_error === 'function' && _copy_error(err)
      })
    }, {
      signal: target._copy_controller.signal,
    })
  },
  updated(target, binding) {
    setValue(target, binding.value)
  },
  unmounted(target: TargetElement) {
    target._copy_controller?.abort()
  },
}
