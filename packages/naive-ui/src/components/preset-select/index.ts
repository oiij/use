import type { PaginationProps, SelectGroupOption, SelectInst, SelectOption, SelectProps } from 'naive-ui'
import type { ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from '../../composables/use-data-request'
import type { ClassStyle } from '../data-table-plus/index'
import type { RemoteRequestEmits, RemoteRequestProps } from '../remote-request/index'
import type PresetSelect from './PresetSelect.vue'

export { default as NPresetSelect } from './PresetSelect.vue'

export type ArrayAwareType<V, T> = V extends null ? null : (V extends any[] ? T[] : T) | null

export type OptionFormat<R extends DataObject = DataObject> = (row: R) => SelectOption | SelectGroupOption | false | undefined | null

export type PresetSelectValue = string | number | (string | number)[] | null

export type PresetSelectFields = DataRequestFields & {
  label?: string
  value?: string
  rowKey?: string
  search?: string
  children?: string
}
export type PresetSelectExpose<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = UseDataRequestReturns<P, D, R> & {
  selectRef: Readonly<ShallowRef<SelectInst | null>>
}

export type PresetSelectProps<V extends PresetSelectValue, P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestProps<P, D> & {
  value?: V
  fallbackLabel?: string | ((val: string | number) => SelectOption)
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  debounce?: boolean | number
  optionFormat?: OptionFormat<R>
  fields?: PresetSelectFields
  selectProps?: SelectProps & ClassStyle
  pagination?: Omit<PaginationProps, 'page' | 'pageSize'> & ClassStyle | boolean
}
export type PresetSelectEmits<V extends PresetSelectValue, P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestEmits<P, D> & {
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

export type PresetSelectInst = ComponentExposed<typeof PresetSelect>
