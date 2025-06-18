import type { UseClipboardOptions } from '@vueuse/core'
import type { ButtonProps, TooltipProps } from 'naive-ui'

export { default as NCopyButton } from './CopyButton.vue'
export interface CopyButtonProps {
  value?: string
  config?: UseClipboardOptions<string | undefined>
  tooltipProps?: TooltipProps
  buttonProps?: ButtonProps
}
