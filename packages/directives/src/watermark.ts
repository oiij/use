import type { Directive } from 'vue'

type TargetElement = HTMLElement & {
}
export type WatermarkOptions = {
  text?: string
  textColor?: string
  font?: string
  fontSize?: number
  rotate?: number
}
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
