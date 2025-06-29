# DataTablePlus 数据表格增强

## Demo

<demo vue="./demos/data-table-plus.vue" title="DataTablePlus" />

## Types

```ts
interface FilterTypeProps {
  'date-picker': DatePickerProps
  'input': InputProps
  'search': SearchInputProps
  'select': SelectProps
  'switch': SwitchProps
  'time-picker': TimePickerProps
}
interface Actions<P extends Record<string, any>, D extends Record<string, any>> {
  run: (params: P) => void
  runAsync: (params: P) => Promise<D>
  refresh: () => void
  refreshAsync: () => Promise<D>
  cancel: () => void
  mutate: (data?: D | ((oldData?: D | undefined) => D | undefined) | undefined) => void
  setParams: (params: P) => void
}
export type DataTableFilterOptions<P extends Record<string, any>, D extends Record<string, any>> = {

  [K in keyof FilterTypeProps]: {
    key?: keyof P
    title?: string
    type?: K
    collapsed?: boolean
    props?: FilterTypeProps[K] & {
      style?: CSSProperties
      class?: string
    }
    labelProps?: FormItemProps & {
      style?: CSSProperties
      class?: string
    }
    render?: (opt: { params: P, data?: D, actions: Actions<P, D>, dataTableRef: DataTableInst | null }) => VNode
  }
}[keyof FilterTypeProps][]

export interface ClickRowType<R extends Record<string, any>> {
  row: R
  index: number
  event: MouseEvent
}
export interface ContextMenuSelectType<R extends Record<string, any>> {
  key: string | number
  option: DropdownOption
  row?: R
}
```

## Props

| Name               | Type                     | Default | Description                    |
| ------------------ | ------------------------ | ------- | ------------------------------ |
| api                | (params:Object)=>Promise | -       | 异步接口返回的数据的方法       |
| defaultParams      | Object                   | -       | 默认的参数                     |
| columns            | DataTableColumns         | -       | 数据表格的列                   |
| filterOptions      | DataTableFilterOptions   | -       | 数据表格的筛选选项配置         |
| contextMenuOptions | DropdownOption[]         | -       | 数据表格的上下文菜单配置       |
| fields             | Object                   | -       | 内置参数的字段                 |
| pagination         | PaginationProps          | -       | 数据表格的分页配置             |
| dataTableProps     | DataTableProps           | -       | 数据表格的配置                 |
| requestOptions     | UseRequestOptions        | -       | VueHooks UseRequest 的请求配置 |
| requestPlugins     | UseRequestPlugin[]       | -       | VueHooks UseRequest 的插件配置 |
| customStyle        | CSSProperties            | -       | 自定义样式                     |
| customClass        | string                   | -       | 自定义类名                     |

## Emits

| Name                | Type                                                                              | Description        |
| ------------------- | --------------------------------------------------------------------------------- | ------------------ |
| loaded              | (data: Object) => void                                                            | 数据加载完成       |
| click-row           | (data: ClickRowType) => void                                                      | 行点击事件         |
| context-menu-row    | (data: ClickRowType) => void                                                      | 上下文菜单点击事件 |
| context-menu-select | (data: ContextMenuSelectType) => void                                             | 上下文菜单选择事件 |
| n-data-table-emits  | [link](https://www.naiveui.com/zh-CN/light/components/data-table#DataTable-Props) |                    |
