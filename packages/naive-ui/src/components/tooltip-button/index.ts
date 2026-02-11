import type { ButtonProps, TooltipProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'

export { default as NTooltipButton } from './TooltipButton.vue'

/**
 * 提示按钮属性
 */
export type TooltipButtonProps = {
  /** 提示文本 */
  tooltip?: string
  /** 提示框属性 */
  tooltipProps?: TooltipProps & ClassStyle
  /** 按钮属性 */
  buttonProps?: ButtonProps & ClassStyle
}
