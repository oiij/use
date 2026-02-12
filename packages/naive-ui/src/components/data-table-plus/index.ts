import type { DataTableColumns, DataTableFilterState, DataTableInst, DataTableProps, DataTableSortState, PaginationProps } from 'naive-ui'
import type { FilterState, RowKey, TableBaseColumn } from 'naive-ui/es/data-table/src/interface'
import type { CSSProperties, Ref, ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from '../../composables/use-data-request'
import type { RemoteRequestEmits, RemoteRequestProps } from '../remote-request/index'
import type { SearchInputProps } from '../search-input/index'
import type DataTablePlus from './DataTablePlus.vue'

export { default as NDataTablePlus } from './DataTablePlus.vue'

/**
 * 类样式类型
 */
export type ClassStyle = {
  /** CSS 类名 */
  class?: string
  /** CSS 样式 */
  style?: CSSProperties | string
}

/**
 * 数据表格增强组件暴露的方法
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type DataTablePlusExpose<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = UseDataRequestReturns<P, D, R> & {
  /** 筛选状态 */
  filters: Ref<DataTableFilterState | undefined>
  /** 排序状态 */
  sorters: Ref<Record<string, DataTableSortState> | undefined>
  /** 数据表格实例 */
  dataTableInst: Readonly<ShallowRef<DataTableInst | null>>
}

/**
 * 数据表格增强字段配置
 */
export type DataTablePlusFields = DataRequestFields & {
  /** 筛选字段名 */
  filter?: string
  /** 排序字段名 */
  sorter?: string
  /** 行键字段名 */
  rowKey?: string
  /** 搜索字段名 */
  search?: string
  /** 子节点字段名 */
  children?: string
}

/**
 * 数据表格增强组件属性
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type DataTablePlusProps<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestProps<P, D> & {
  /** 标题 */
  title?: string
  /** 表格列配置 */
  columns?: DataTableColumns<R>
  /** 字段配置 */
  fields?: DataTablePlusFields
  /** 搜索配置 */
  search?: SearchInputProps & ClassStyle | boolean
  /** 分页配置 */
  pagination?: Omit<PaginationProps, 'page' | 'pageSize' | 'itemCount'> & ClassStyle | boolean
  /** 列筛选选项 */
  columnsFilterOptions?: (filters: DataTableFilterState) => Record<string, any>
  /** 列排序选项 */
  columnsSorterOptions?: (sorters: Record<string, DataTableSortState>) => Record<string, any>
  /** 数据表格属性 */
  dataTableProps?: DataTableProps & ClassStyle
}

/**
 * 数据表格增强组件事件
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type DataTablePlusEmits<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestEmits<P, D> & {
  /** 点击行事件 */
  (e: 'clickRow', row: R, index: number, event: MouseEvent, currentData: R[]): void
  /** 右键点击行事件 */
  (e: 'contextMenuRow', row: R, index: number, event: MouseEvent, currentData: R[]): void
  /** 更新选中行键事件 */
  (e: 'update:checkedRowKeys',
    keys: RowKey[],
    rows: R[],
    meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' },
    currentData: R[]
  ): void
  /** 更新筛选事件 */
  (e: 'update:filters', filterState: FilterState, sourceColumn: TableBaseColumn): void
  /** 更新排序事件 */
  (e: 'update:sorter', options: DataTableSortState | DataTableSortState[] | null): void
  /** 更新页码事件 */
  (e: 'update:page', page: number): void
  /** 更新每页大小事件 */
  (e: 'update:pageSize', pageSize: number): void
  /** 成功事件 */
  (e: 'loadedRows', data: R[]): void
}

/**
 * 数据表格增强组件实例类型
 */
export type DataTablePlusInst = ComponentExposed<typeof DataTablePlus>
