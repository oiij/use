import type { ButtonProps, InputProps } from 'naive-ui'

export { default as NSearchInput } from './SearchInput.vue'
export interface SearchInputProps {
  value?: string | null
  type?: ButtonProps['type']
  placeholder?: string
  loading?: boolean
  autoTrigger?: boolean | number
  searchButton?: 'text' | 'icon' | boolean
  inputProps?: InputProps
  buttonProps?: ButtonProps
}
