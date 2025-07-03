import type { SelectGroupOption, SelectInst, SelectOption } from 'naive-ui'
import type { ShallowRef } from 'vue'
import type { DataTablePlusExposeActions, DataTablePlusExposeRefsBase } from '../data-table-plus'

export { default as NPresetSelect } from './PresetSelect.vue'
export type OptionFormat<R extends Record<string, any>> = (row: R) => SelectOption | SelectGroupOption
export type PresetSelectValue = string | number | (string | number)[] | null
export type PresetSelectUpdateValue<R extends Record<string, any>> = (val: string | number | (string | number)[] | null, option: SelectOption | SelectOption[] | null, raw: R | R[] | null) => void
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
