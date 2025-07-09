import type { PaginationProps, SelectGroupOption, SelectInst, SelectOption, SelectProps } from 'naive-ui'
import type { ShallowRef } from 'vue'
import type { DataTablePlusExposeActions, DataTablePlusExposeRefsBase } from '../data-table-plus'
import type { RemoteRequestProps } from '../remote-request'

export { default as NPresetSelect } from './PresetSelect.vue'
export type OptionFormat<R extends Record<string, any>> = (row: R) => SelectOption | SelectGroupOption | false | undefined | null
export type PresetSelectValue = string | number | (string | number)[] | null
export type PresetSelectUpdateValue<V extends PresetSelectValue, R extends Record<string, any>> = (val: V, option: SelectOption | SelectOption[] | null, raw: R | R[] | null) => void
export type PresetSelectFields = Partial<Record<'page' | 'pageSize' | 'search' | 'list' | 'count' | 'rowKey' | 'label' | 'value' | 'children', string>>
export interface PresetSelectPagination {
  page: number
  pageSize: number
  itemCount: number
}
export type PresetSelectExposeRefs<P extends Record<string, any>, D extends Record<string, any>, R extends Record<string, any>> = DataTablePlusExposeRefsBase<P, D, R> & {
  selectRef: Readonly<ShallowRef<SelectInst | null>>
}
export type PresetSelectExposeActions<P extends Record<string, any>, D extends Record<string, any>> = DataTablePlusExposeActions<P, D>

export type PresetSelectProps<V extends PresetSelectValue = null, P extends Record<string, any> = Record<string, any>, D extends Record<string, any> = Record<string, any>, R extends Record<string, any> = Record<string, any>> = RemoteRequestProps<P, D> & {
  value?: V
  fallbackLabel?: string
  multiple?: boolean
  disabled?: boolean
  debounce?: boolean | number
  optionFormat?: OptionFormat<R>
  fields?: PresetSelectFields
  selectProps?: SelectProps
  pagination?: Omit<PaginationProps, 'page' | 'pageSize'> | boolean
}
