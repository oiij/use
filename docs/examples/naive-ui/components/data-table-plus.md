# DataTablePlus 数据表格增强

## Demo

<demo vue="./demos/data-table-plus.vue" title="DataTablePlus" />

## Types

```ts
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
  (e: 'update:checkedRowKeys', keys: (string | number)[], rows: (R | undefined)[], meta: {
    row: R | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }, currentData: R[]): void
  (e: 'update:expandedRowKeys', keys: (string | number)[], currentData: R[]): void
  (e: 'update:filters', filterState: FilterState, sourceColumn: TableBaseColumn): void
  (e: 'update:sorter', options: DataTableSortState | DataTableSortState[] | null): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
```

## Props

| Name           | Type                        | Default | Description                    |
| -------------- | --------------------------- | ------- | ------------------------------ |
| api            | (params:Object)=>Promise    | -       | 异步接口返回的数据的方法       |
| defaultParams  | Object                      | -       | 默认的参数                     |
| manual         | boolean                     | -       | 是否手动触发请求               |
| title          | String                      | -       | 标题                           |
| columns        | DataTableColumns            | -       | 数据表格的列                   |
| fields         | Object                      | -       | 内置参数的字段                 |
| search         | SearchInputProps or Boolean | -       | 搜索框配置                     |
| pagination     | PaginationProps or Boolean  | -       | 数据表格的分页配置             |
| dataTableProps | DataTableProps              | -       | 数据表格的配置                 |
| requestOptions | UseRequestOptions           | -       | VueHooks UseRequest 的请求配置 |
| requestPlugins | UseRequestPlugin[]          | -       | VueHooks UseRequest 的插件配置 |

## Emits

| Name                | Type                                                                              | Description        |
| ------------------- | --------------------------------------------------------------------------------- | ------------------ |
| before              | (params: D[]) => void                                                             | 数据加载前         |
| success             | (data: D, params: P[]) => void                                                    | 数据加载完成       |
| error               | (error: Error, params: P[]) => void                                               | 数据加载失败       |
| finally             | params: (P[], data?: D, err?: Error) => void                                      | 数据加载完成或失败 |
| click-row           | (data: DataTablePlusClickRowType) => void                                         | 行点击事件         |
| context-menu-row    | (data: DataTablePlusClickRowType) => void                                         | 上下文菜单点击事件 |
| context-menu-select | (data: ContextMenuSelectType) => void                                             | 上下文菜单选择事件 |
| n-data-table-emits  | [link](https://www.naiveui.com/zh-CN/light/components/data-table#DataTable-Props) |                    |
