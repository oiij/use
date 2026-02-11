import type { UseClipboardOptions } from '@vueuse/core'
import type { ButtonProps, TooltipProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'

export { default as NCopyButton } from './CopyButton.vue'

/**
 * 复制按钮组件属性
 */
export type CopyButtonProps = {
  /** 要复制的值 */
  value?: string
  /** 剪贴板配置选项 */
  config?: UseClipboardOptions<string | undefined>
  /** 提示框属性 */
  tooltipProps?: TooltipProps & ClassStyle
  /** 按钮属性 */
  buttonProps?: ButtonProps & ClassStyle
}
