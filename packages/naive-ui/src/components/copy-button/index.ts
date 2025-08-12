import type { UseClipboardOptions } from '@vueuse/core'
import type { ButtonProps, TooltipProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'

export { default as NCopyButton } from './CopyButton.vue'
export interface CopyButtonProps {
  value?: string
  config?: UseClipboardOptions<string | undefined>
  tooltipProps?: TooltipProps & ClassStyle
  buttonProps?: ButtonProps & ClassStyle
}
