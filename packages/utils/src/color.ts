/**
 * 将RGB转化为十六进制颜色
 * @param {number} r - 红色通道值 (0-255)
 * @param {number} g - 绿色通道值 (0-255)
 * @param {number} b - 蓝色通道值 (0-255)
 * @returns {string} 十六进制颜色字符串
 * @example
 * // 返回 "#FF5733"
 * rgbToHex(255, 87, 51)
 */
export const rgbToHex = (r: number, g: number, b: number): string => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

/**
 * 获取随机十六进制颜色
 * @returns {string} 随机的十六进制颜色字符串
 * @example
 * // 返回类似 "#A1B2C3" 的随机颜色
 * randomHex()
 */
export const randomHex = (): string => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0')}`
