import type { ButtonProps, InputProps } from 'naive-ui'

export { default as NSearchInput } from './SearchInput.vue'
export interface SearchInputProps {
  value?: string
  type?: ButtonProps['type']
  autoTrigger?: boolean | number
  searchButton?: boolean
  inputProps?: InputProps
  buttonProps?: ButtonProps
  loading?: boolean
}
