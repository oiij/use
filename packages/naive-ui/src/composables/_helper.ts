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

export function getDarkColor(color: string) {
  if (!color)
    return undefined
  const baseColor = colord(color)
  if (!baseColor.isValid())
    return undefined
  return baseColor.lighten(0.2).toHex()
}
export function getStatusColor(color?: string): StatusColor | undefined {
  if (!color)
    return undefined

  const baseColor = colord(color)
  if (!baseColor.isValid())
    return undefined

  return {
    color,
    hover: baseColor.lighten(0.1).toHex(),
    pressed: baseColor.darken(0.1).toHex(),
    suppl: baseColor.lighten(0.1).toHex(),
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
