# DataTablePlus 数据表格增强

## Demo

<demo vue="./demos/data-table-plus.vue" title="DataTablePlus" />

## Types

```ts
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
export type OnUpdateCheckedRowKeysParams<R extends Record<string, any>> = (keys: keyof R[], rows: R[], meta: {
  row: R | undefined
  action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
}) => void
export type OnUpdateExpandedRowKeysParams<R extends Record<string, any>> = (keys: R[]) => void
```

## Props

| Name               | Type                       | Default | Description                    |
| ------------------ | -------------------------- | ------- | ------------------------------ |
| api                | (params:Object)=>Promise   | -       | 异步接口返回的数据的方法       |
| defaultParams      | Object                     | -       | 默认的参数                     |
| manual             | boolean                    | -       | 是否手动触发请求               |
| columns            | DataTableColumns           | -       | 数据表格的列                   |
| filterOptions      | DataTableFilterOptions     | -       | 数据表格的筛选选项配置         |
| contextMenuOptions | DropdownOption[]           | -       | 数据表格的上下文菜单配置       |
| fields             | Object                     | -       | 内置参数的字段                 |
| pagination         | PaginationProps or Boolean | -       | 数据表格的分页配置             |
| dataTableProps     | DataTableProps             | -       | 数据表格的配置                 |
| requestOptions     | UseRequestOptions          | -       | VueHooks UseRequest 的请求配置 |
| requestPlugins     | UseRequestPlugin[]         | -       | VueHooks UseRequest 的插件配置 |
| customStyle        | CSSProperties              | -       | 自定义样式                     |
| customClass        | string                     | -       | 自定义类名                     |

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
