import type { Directive, DirectiveBinding } from 'vue'

type BindingValue = Uint8Array
type TargetElement = HTMLImageElement & {

}
function loadSrc(target: TargetElement, data: BindingValue, type: string = 'image/jpeg') {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  target.src = url
  target.onload = () => {
    URL.revokeObjectURL(url)
  }
}
function areArrayBuffersEqual(buf1: Uint8Array, buf2: Uint8Array) {
  if (buf1 === buf2)
    return true
  if (buf1.byteLength !== buf2.byteLength)
    return false
  return buf1.every((val, i) => val === buf2[i])
}
export const arrayBufferSrc: Directive = {
  mounted(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    if (!(binding.value instanceof Uint8Array)) {
      return console.warn('LazyLoad: value is not a Uint8Array')
    }
    loadSrc(target, binding.value, binding.arg)
  },
  updated(target: TargetElement, binding: DirectiveBinding<BindingValue>) {
    if (!(binding.value instanceof Uint8Array)) {
      return console.warn('LazyLoad: value is not a Uint8Array')
    }
    const oldValue = binding.oldValue
    if (oldValue && areArrayBuffersEqual(oldValue, binding.value)) {
      return
    }
    loadSrc(target, binding.value, binding.arg)
  },
}
