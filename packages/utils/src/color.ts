/** 将RGB转化为十六机制 */
export const rgbToHex = (r: number, g: number, b: number): string => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
/** 获取随机十六进制颜色 */
export const randomHex = (): string => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0')}`
/** 是否是16进制颜色 */
export const isHexColor = (color: string): boolean => /^#(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color)

export default {
  isHexColor,
  randomHex,
  rgbToHex,
}
