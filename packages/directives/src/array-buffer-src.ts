import type { Directive } from 'vue'

/**
 * 绑定值类型
 */
type BindingValue = Uint8Array<ArrayBuffer>

/**
 * 图片 MIME 类型
 */
type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/svg+xml' | 'image/webp'

/**
 * 目标元素类型
 */
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

/**
 * 数组缓冲区图片源指令
 *
 * 将 Uint8Array 类型的数组缓冲区转换为图片源
 *
 * @example
 * ```vue
 * <template>
 *   <img v-array-buffer-src:[imageType]="imageData" alt="Array Buffer Image" />
 * </template>
 *
 * <script setup>
 * import { ref } from 'vue'
 *
 * const imageData = ref(new Uint8Array([...])) // 图片的 Uint8Array 数据
 * const imageType = ref('image/jpeg') // 图片类型
 * </script>
 * ```
 */
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
