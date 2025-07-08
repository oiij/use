import type { DataTableInst, DropdownOption, GridItemProps } from 'naive-ui'
import type { ComputedRef, Ref, ShallowRef, VNode } from 'vue'
import type { useRequestResult } from 'vue-hooks-plus/es/useRequest/types'
import type { PresetInputOptions } from '../preset-input'

export { default as NDataTablePlus } from './DataTablePlus.vue'

export interface DataTablePlusExposeActions<P extends Record<string, any>, D extends Record<string, any>> {
  run: (params: P) => void
  runAsync: (params: P) => Promise<D>
  refresh: () => void
  refreshAsync: () => Promise<D>
  cancel: () => void
  mutate: (data?: D | ((oldData?: D | undefined) => D | undefined) | undefined) => void
  setParam: (params: Partial<P>) => void
  runParam: (params: Partial<P>) => void
  runParamAsync: (params: Partial<P>) => Promise<D>
}
export interface DataTablePlusPagination {
  page: number
  pageSize: number
  itemCount: number
}
export type DataTablePlusExposeRefsBase<P extends Record<string, any>, D extends Record<string, any>, R extends Record<string, any>> = Pick<useRequestResult<D, P[], false, false>, 'loading' | 'data' | 'error' | 'params'> & {
  pagination: Readonly<Ref<DataTablePlusPagination, DataTablePlusPagination>>
  rawList: ComputedRef<R[]>
}
export type DataTablePlusExposeRefs<P extends Record<string, any>, D extends Record<string, any>, R extends Record<string, any>> = DataTablePlusExposeRefsBase<P, D, R> & {
  dataTableRef: Readonly<ShallowRef<DataTableInst | null>>
}
export type DataTablePlusFilterOptions<P extends Record<string, any>, D extends Record<string, any>, R extends Record<string, any>> = (PresetInputOptions & {
  key?: keyof P
  collapsed?: boolean
  gridItemProps?: GridItemProps
  render?: (refs: DataTablePlusExposeRefs<P, D, R>, actions: DataTablePlusExposeActions<P, D>) => VNode
})[]

export interface DataTablePlusClickRowType<R extends Record<string, any>> {
  row: R
  index: number
  event: MouseEvent
}
export interface ContextMenuSelectType<R extends Record<string, any>> {
  key: string | number
  option: DropdownOption
  row?: R
}
export type DataTablePlusFields = Partial<Record<'page' | 'pageSize' | 'filter' | 'sorter' | 'list' | 'count' | 'rowKey', string>>
export type OnUpdateCheckedRowKeysParams<R extends Record<string, any>> = (
  keys: keyof R[],
  rows: R[],
  meta: {
    row: R | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }
) => void
export type OnUpdateExpandedRowKeysParams<R extends Record<string, any>> = (keys: R[]) => void
