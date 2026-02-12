import type { Directive } from 'vue'

/**
 * 目标元素类型
 */
type TargetElement = HTMLElement & {
}

/**
 * 水印选项类型
 */
export type WatermarkOptions = {
  /**
   * 水印文本
   */
  text?: string
  /**
   * 文本颜色
   */
  textColor?: string
  /**
   * 字体
   */
  font?: string
  /**
   * 字体大小
   */
  fontSize?: number
  /**
   * 旋转角度
   */
  rotate?: number
}

/**
 * 绑定值类型
 */
type BindingValue = string | WatermarkOptions

function generateWatermark(options?: WatermarkOptions) {
  const { text = '', textColor = 'rgba(0, 0, 0, 0.3)', font = 'Microsoft JhengHei', fontSize = 16, rotate = -20 } = options ?? {}
  const dpr = window.devicePixelRatio || 2
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(200, text.length * fontSize + 50) * dpr
  canvas.height = Math.max(150, text.length * fontSize + 30) * dpr
  canvas.style.display = 'none'
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.scale(dpr, dpr)
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(rotate * (Math.PI / 180))
  ctx.font = `${fontSize}px ${font}`
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * 水印指令
 *
 * 为元素添加水印效果
 *
 * @example
 * ```vue
 * <template>
 *   <!-- 基本用法 -->
 *   <div v-watermark="'测试水印'">
 *     带水印的内容
 *   </div>
 *
 *   <!-- 带选项 -->
 *   <div v-watermark="{
 *     text: '自定义水印',
 *     textColor: 'rgba(255, 0, 0, 0.2)',
 *     fontSize: 20,
 *     rotate: -15
 *   }">
 *     带自定义水印的内容
 *   </div>
 * </template>
 * ```
 */
export const watermark: Directive<TargetElement, BindingValue> = {
  mounted(target, binding) {
    const options = (typeof binding.value === 'object') ? binding.value : { text: binding.value }
    target.style.backgroundImage = `url(${generateWatermark(options)})`
  },
  updated(target, binding) {
    const options = (typeof binding.value === 'object') ? binding.value : { text: binding.value }
    target.style.backgroundImage = `url(${generateWatermark(options)})`
  },
}
