import type { ButtonProps, InputProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'

export { default as NSearchInput } from './SearchInput.vue'

/**
 * 搜索输入框属性
 */
export type SearchInputProps = {
  /** 值 */
  value?: string | null
  /** 按钮类型 */
  type?: ButtonProps['type']
  /** 占位符 */
  placeholder?: string
  /** 是否加载中 */
  loading?: boolean
  /** 是否自动触发 */
  autoTrigger?: boolean | number
  /** 搜索按钮类型 */
  searchButton?: 'text' | 'icon' | boolean
  /** 输入框属性 */
  inputProps?: InputProps & ClassStyle
  /** 按钮属性 */
  buttonProps?: ButtonProps & ClassStyle
}
