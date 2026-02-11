import { colord } from 'colord'

/**
 * 颜色配置类型，用于定义主题的基础颜色
 */
export type Colors = {
  /** 主色 */
  primary?: string
  /** 信息色 */
  info?: string
  /** 成功色 */
  success?: string
  /** 警告色 */
  warning?: string
  /** 错误色 */
  error?: string
}

/**
 * 状态颜色类型，包含基础颜色和交互状态颜色
 */
export type StatusColor = {
  /** 基础颜色 */
  color: string
  /** 悬停状态颜色 */
  hover: string
  /** 按下状态颜色 */
  pressed: string
  /** 补充颜色 */
  suppl: string
}

/**
 * 获取变亮的颜色
 * @param color - 原始颜色值
 * @returns 变亮后的颜色值，如果输入无效则返回 undefined
 * @example
 * ```ts
 * const darkColor = getDarkColor('#1890ff')
 * // 返回变亮后的颜色值
 * ```
 */
export function getDarkColor(color?: string) {
  if (!color)
    return undefined
  const colorInst = colord(color)
  if (!colorInst.isValid())
    return undefined
  return colorInst.lighten(0.1).toHex()
}

/**
 * 获取一组变亮的颜色
 * @param colors - 颜色配置对象
 * @returns 包含变亮后颜色的对象
 * @example
 * ```ts
 * const darkColors = getDarkColors({
 *   primary: '#1890ff',
 *   success: '#52c41a'
 * })
 * ```
 */
export function getDarkColors(colors: Colors) {
  return {
    primary: getDarkColor(colors.primary),
    info: getDarkColor(colors.info),
    success: getDarkColor(colors.success),
    warning: getDarkColor(colors.warning),
    error: getDarkColor(colors.error),
  }
}

/**
 * 获取状态颜色对象，包含基础颜色和交互状态颜色
 * @param color - 原始颜色值
 * @returns 状态颜色对象，如果输入无效则返回 undefined
 * @example
 * ```ts
 * const statusColor = getStatusColor('#1890ff')
 * // 返回 { color: '#1890ff', hover: '...', pressed: '...', suppl: '...' }
 * ```
 */
export function getStatusColor(color?: string): StatusColor | undefined {
  if (!color)
    return undefined

  const colorInst = colord(color)
  if (!colorInst.isValid())
    return undefined

  return {
    color,
    hover: colorInst.lighten(0.1).toHex(),
    pressed: colorInst.darken(0.1).toHex(),
    suppl: colorInst.lighten(0.1).toHex(),
  }
}

/**
 * 获取一组状态颜色
 * @param colors - 颜色配置对象
 * @returns 包含各状态颜色的对象
 * @example
 * ```ts
 * const colors = getColors({
 *   primary: '#1890ff',
 *   info: '#1890ff',
 *   success: '#52c41a',
 *   warning: '#faad14',
 *   error: '#f5222d'
 * })
 * ```
 */
export function getColors(colors?: Colors) {
  const { primary, info, success, warning, error } = colors ?? {}
  return {
    primary: getStatusColor(primary),
    info: getStatusColor(info),
    success: getStatusColor(success),
    warning: getStatusColor(warning),
    error: getStatusColor(error),
  }
}
