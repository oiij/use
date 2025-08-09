import type { DataTableColumns, DataTableFilterState, DataTableInst, DataTableProps, DataTableSortState, DropdownOption, FlexProps, FormItemProps, GridItemProps, GridProps, PaginationProps } from 'naive-ui'
import type { FilterState, TableBaseColumn } from 'naive-ui/es/data-table/src/interface'
import type { ComputedRef, CSSProperties, Ref, ShallowRef, VNode } from 'vue'
import type { useRequestResult } from 'vue-hooks-plus/es/useRequest/types'
import type { PresetInputOptions } from '../preset-input/index'
import type { RemoteRequestEmits, RemoteRequestProps, RObject } from '../remote-request/index'
import type { SearchInputProps } from '../search-input/index'

export { default as NDataTablePlus } from './DataTablePlus.vue'

export interface DataTablePlusExposeActions<P extends RObject, D extends RObject> {
  run: (params: P) => void
  runAsync: (params: P) => Promise<D>
  refresh: () => void
  refreshAsync: () => Promise<D>
  cancel: () => void
  mutate: (data?: D | ((oldData?: D | undefined) => D | undefined) | undefined) => void
  setParams: (params: Partial<P>) => void
  runParams: (params: Partial<P>) => void
  runParamsAsync: (params: Partial<P>) => Promise<D>
}
export interface DataTablePlusPagination {
  page: number
  pageSize: number
  itemCount: number
}
export type DataTablePlusExposeRefsBase<P extends RObject, D extends RObject, R extends RObject> = Pick<useRequestResult<D, P[], false, false>, 'loading' | 'data' | 'error' | 'params'> & {
  pagination: Readonly<Ref<DataTablePlusPagination, DataTablePlusPagination>>
  rawList: ComputedRef<R[]>
}
export type DataTablePlusExposeRefs<P extends RObject, D extends RObject, R extends RObject> = DataTablePlusExposeRefsBase<P, D, R> & {
  filters: Ref<DataTableFilterState | undefined>
  sorters: Ref<Record<string, DataTableSortState> | undefined>
  dataTableRef: Readonly<ShallowRef<DataTableInst | null>>
}
export type DataTablePlusFilterOptions<P extends RObject, D extends RObject, R extends RObject> = (PresetInputOptions & {
  key?: keyof P
  label?: string | boolean |(FormItemProps & {
    style?: CSSProperties
    class?: string
  })
  collapsed?: boolean
  hidden?: boolean | ((refs: DataTablePlusExposeRefs<P, D, R>) => boolean)
  gridSpan?: string | number
  gridItemProps?: GridItemProps
  render?: (refs: DataTablePlusExposeRefs<P, D, R>, actions: DataTablePlusExposeActions<P, D>) => VNode | null
})[]

export type DataTablePlusFields = Partial<Record<'page' | 'pageSize' | 'filter' | 'sorter' | 'list' | 'count' | 'rowKey' | 'search' | 'children', string>>

export type DataTablePlusProps<P extends RObject, D extends RObject, R extends RObject> = RemoteRequestProps<P, D> & {
  title?: string
  columns?: DataTableColumns<R>
  filterOptions?: DataTablePlusFilterOptions<P, D, R>
  filterGridProps?: GridProps
  filterFlexProps?: FlexProps
  filterLayout?: 'grid' | 'flex' | ['grid' | 'flex']
  contextMenuOptions?: DropdownOption[]
  fields?: DataTablePlusFields
  search?: SearchInputProps | boolean
  pagination?: Omit<PaginationProps, 'page' | 'pageSize'> | boolean
  columnsFilterOptions?: (filters: DataTableFilterState) => Record<string, any>
  columnsSorterOptions?: (sorters: Record<string, DataTableSortState>) => Record<string, any>
  dataTableProps?: DataTableProps
  customStyle?: CSSProperties
  customClass?: string
}
export type DataTablePlusEmits<P extends RObject, D extends RObject, R extends RObject> = RemoteRequestEmits<P, D> & {
  (e: 'clickRow', row: R, index: number, event: MouseEvent, currentData: R[]): void
  (e: 'contextMenuRow', row: R, index: number, event: MouseEvent, currentData: R[]): void
  (e: 'load', row: R): Promise<void>
  (e: 'scroll', ev: Event): void
  (e: 'update:checkedRowKeys',
    keys: (string | number)[],
    rows: (R | undefined)[],
    meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' },
    currentData: R[]
  ): void
  (e: 'update:expandedRowKeys', keys: (string | number)[], currentData: R[]): void
  (e: 'update:filters', filterState: FilterState, sourceColumn: TableBaseColumn): void
  (e: 'update:sorter', options: DataTableSortState | DataTableSortState[] | null): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
