import type { Directive, DirectiveBinding } from 'vue'

type BindingValue = (ev: MouseEvent) => void
type TargetElement = HTMLElement & {
  _click_outside_share_id?: string
  _click_outside_callBack?: BindingValue
  _click_outside_controller?: AbortController
}
const shareIds = new Set<string>()
export const clickOutside: Directive = {
  mounted(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    if (!(typeof binding.value === 'function')) {
      return console.warn('ClickOutside: value is not a function')
    }
    target._click_outside_callBack = binding.value
    const shareId = binding.arg
    if (shareId) {
      target._click_outside_share_id = shareId
      shareIds.add(shareId)
    }
    target._click_outside_controller = new AbortController()
    document.addEventListener('click', (ev) => {
      if (!target.contains(ev.target as Node)) {
        target._click_outside_callBack?.(ev)
      }
    }, {
      signal: target._click_outside_controller.signal,
    })
  },
  updated(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    target._click_outside_callBack = binding.value
  },
  unmounted(target: TargetElement) {
    if (target._click_outside_share_id) {
      shareIds.delete(target._click_outside_share_id)
    }
    target._click_outside_controller?.abort()
  },
}
