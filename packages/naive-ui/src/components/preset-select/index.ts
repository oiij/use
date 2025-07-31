import type { PaginationProps, SelectGroupOption, SelectInst, SelectOption, SelectProps } from 'naive-ui'
import type { ShallowRef } from 'vue'
import type { DataTablePlusExposeActions, DataTablePlusExposeRefsBase } from '../data-table-plus/index'
import type { RemoteRequestEmits, RemoteRequestProps, RObject } from '../remote-request/index'

export { default as NPresetSelect } from './PresetSelect.vue'

export type ArrayAwareType<V, T> = V extends null ? null : (V extends any[] ? T[] : T) | null
export type OptionFormat<R extends RObject> = (row: R) => SelectOption | SelectGroupOption | false | undefined | null
export type PresetSelectValue = string | number | (string | number)[] | null
export type PresetSelectFields = Partial<Record<'page' | 'pageSize' | 'search' | 'list' | 'count' | 'rowKey' | 'label' | 'value' | 'children', string>>
export interface PresetSelectPagination {
  page: number
  pageSize: number
  itemCount: number
}
export type PresetSelectExposeRefs<P extends RObject, D extends RObject, R extends RObject> = DataTablePlusExposeRefsBase<P, D, R> & {
  selectRef: Readonly<ShallowRef<SelectInst | null>>
}
export type PresetSelectExposeActions<P extends RObject, D extends RObject> = DataTablePlusExposeActions<P, D>

export type PresetSelectProps<V extends PresetSelectValue, P extends RObject, D extends RObject, R extends RObject> = RemoteRequestProps<P, D> & {
  value?: V
  fallbackLabel?: string | ((val: string | number) => SelectOption)
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  debounce?: boolean | number
  optionFormat?: OptionFormat<R>
  fields?: PresetSelectFields
  selectProps?: SelectProps
  pagination?: Omit<PaginationProps, 'page' | 'pageSize'> | boolean
}
export type PresetSelectEmits<V extends PresetSelectValue, P extends RObject, D extends RObject, R extends RObject> = RemoteRequestEmits<P, D> & {
  (e: 'blur', ev: FocusEvent): void
  (e: 'clear',): void
  (e: 'create', label: string): SelectOption
  (e: 'focus', ev: FocusEvent): void
  (e: 'scroll', ev: Event): void
  (e: 'search', value: string): void
  (e: 'update:value', val: V | null, option: SelectOption | SelectOption[] | null, raw: R | R[] | null): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
