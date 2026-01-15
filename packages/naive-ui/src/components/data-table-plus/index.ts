import type { ButtonProps, DataTableColumns, DataTableFilterState, DataTableInst, DataTableProps, DataTableSortState, PaginationProps } from 'naive-ui'
import type { FilterState, TableBaseColumn } from 'naive-ui/es/data-table/src/interface'
import type { CSSProperties, Ref, ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from '../../composables/use-data-request'
import type { RemoteRequestEmits, RemoteRequestProps } from '../remote-request/index'
import type { SearchInputProps } from '../search-input/index'
import type DataTablePlus from './DataTablePlus.vue'

export { default as NDataTablePlus } from './DataTablePlus.vue'

export type ClassStyle = {
  class?: string
  style?: CSSProperties | string
}
export type DataTablePlusExpose<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = UseDataRequestReturns<P, D, R> & {
  filters: Ref<DataTableFilterState | undefined>
  sorters: Ref<Record<string, DataTableSortState> | undefined>
  dataTableRef: Readonly<ShallowRef<DataTableInst | null>>
}

export type DataTablePlusFields = DataRequestFields & {
  filter?: string
  sorter?: string
  rowKey?: string
  search?: string
  children?: string
}

export type DataTablePlusProps<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestProps<P, D> & {
  title?: string
  scrollTop?: number | boolean | { top?: number, buttonProps?: ButtonProps & ClassStyle }
  columns?: DataTableColumns<R>
  fields?: DataTablePlusFields
  search?: SearchInputProps & ClassStyle | boolean
  pagination?: Omit<PaginationProps, 'page' | 'pageSize' | 'itemCount'> & ClassStyle | boolean
  columnsFilterOptions?: (filters: DataTableFilterState) => Record<string, any>
  columnsSorterOptions?: (sorters: Record<string, DataTableSortState>) => Record<string, any>
  dataTableProps?: DataTableProps & ClassStyle
}
export type DataTablePlusEmits<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestEmits<P, D> & {
  (e: 'clickRow', row: R, index: number, event: MouseEvent, currentData: R[]): void
  (e: 'contextMenuRow', row: R, index: number, event: MouseEvent, currentData: R[]): void
  (e: 'load', row: R): Promise<void>
  (e: 'scroll', ev: Event): void
  (e: 'scrollBottom', ev: Event): void
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

export type DataTablePlusInst = ComponentExposed<typeof DataTablePlus>
