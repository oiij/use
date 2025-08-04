import type { Directive } from 'vue'

type BindingValue = Uint8Array<ArrayBuffer>
type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/svg+xml' | 'image/webp'
type TargetElement = HTMLImageElement & {

}
function loadSrc(target: TargetElement, data: BindingValue, type: ImageMimeType = 'image/jpeg') {
  const blob = new Blob([data.buffer], { type })
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
export const arrayBufferSrc: Directive<TargetElement, BindingValue, string, ImageMimeType> = {
  mounted(target, binding) {
    if (!(binding.value instanceof Uint8Array)) {
      return console.warn('LazyLoad: value is not a Uint8Array')
    }
    loadSrc(target, binding.value, binding.arg)
  },
  updated(target, binding) {
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
