import type { ButtonProps, InputProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'

export { default as NSearchInput } from './SearchInput.vue'
export interface SearchInputProps {
  value?: string | null
  type?: ButtonProps['type']
  placeholder?: string
  loading?: boolean
  autoTrigger?: boolean | number
  searchButton?: 'text' | 'icon' | boolean
  inputProps?: InputProps & ClassStyle
  buttonProps?: ButtonProps & ClassStyle
}
