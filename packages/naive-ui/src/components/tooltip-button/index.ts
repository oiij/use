import type { ButtonProps, TooltipProps } from 'naive-ui'

export { default as NTooltipButton } from './TooltipButton.vue'
export interface TooltipButtonProps {
  value?: string
  tooltipProps?: TooltipProps
  buttonProps?: ButtonProps
}
