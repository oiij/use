import type { CSSProperties } from 'vue'

/**
 * 类样式类型
 * 用于向组件透传 class / style
 */
export type ClassStyle = {
  /** CSS 类名，默认 undefined */
  class?: string
  /** CSS 样式，默认 undefined */
  style?: CSSProperties | string
}

/**
 * 预设组件值类型
 * 覆盖单选与多选两种形态
 */
export type PresetValue = string | number | (string | number)[] | null
