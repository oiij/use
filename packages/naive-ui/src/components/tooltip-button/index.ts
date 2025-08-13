import type { ButtonProps, TooltipProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'

export { default as NTooltipButton } from './TooltipButton.vue'
export type TooltipButtonProps = & {
  value?: string
  tooltipProps?: TooltipProps & ClassStyle
  buttonProps?: ButtonProps & ClassStyle
}
