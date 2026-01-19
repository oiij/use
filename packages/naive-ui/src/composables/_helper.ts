import { colord } from 'colord'

export type Colors = {
  primary?: string
  info?: string
  success?: string
  warning?: string
  error?: string
}
export type StatusColor = {
  color: string
  hover: string
  pressed: string
  suppl: string
}

export function getDarkColor(color?: string) {
  if (!color)
    return undefined
  const colorInst = colord(color)
  if (!colorInst.isValid())
    return undefined
  return colorInst.lighten(0.1).toHex()
}
export function getDarkColors(colors: Colors) {
  return {
    primary: getDarkColor(colors.primary),
    info: getDarkColor(colors.info),
    success: getDarkColor(colors.success),
    warning: getDarkColor(colors.warning),
    error: getDarkColor(colors.error),
  }
}
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
