import type { DataTableInst, DatePickerProps, DropdownOption, FormItemProps, InputProps, SelectProps, SwitchProps, TimePickerProps } from 'naive-ui'
import type { CSSProperties, VNode } from 'vue'
import type { SearchInputProps } from '../index'

export { default as NDataTablePlus } from './DataTablePlus.vue'

interface FilterTypeProps {
  'date-picker': DatePickerProps
  'input': InputProps
  'search': SearchInputProps
  'select': SelectProps
  'switch': SwitchProps
  'time-picker': TimePickerProps
}
interface Actions<P extends Record<string, any>, D extends Record<string, any>> {
  run: (params: P) => void
  runAsync: (params: P) => Promise<D>
  refresh: () => void
  refreshAsync: () => Promise<D>
  cancel: () => void
  mutate: (data?: D | ((oldData?: D | undefined) => D | undefined) | undefined) => void
  setParams: (params: P) => void
}
export type DataTableFilterOptions<P extends Record<string, any>, D extends Record<string, any>> = {

  [K in keyof FilterTypeProps]: {
    key?: keyof P
    title?: string
    type?: K
    collapsed?: boolean
    props?: FilterTypeProps[K] & {
      style?: CSSProperties
      class?: string
    }
    labelProps?: FormItemProps & {
      style?: CSSProperties
      class?: string
    }
    render?: (opt: { params: P, data?: D, actions: Actions<P, D>, dataTableRef: DataTableInst | null }) => VNode
  }
}[keyof FilterTypeProps][]

export interface ClickRowType<R extends Record<string, any>> {
  row: R
  index: number
  event: MouseEvent
}
export interface ContextMenuSelectType<R extends Record<string, any>> {
  key: string | number
  option: DropdownOption
  row?: R
}
