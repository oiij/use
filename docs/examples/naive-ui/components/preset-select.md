# PresetSelect 配置选择器

## Demo

<demo vue="./demos/preset-select.vue" title="PresetSelect" />

## Types

```ts
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
  fallbackLabel?: string
  multiple?: boolean
  disabled?: boolean
  debounce?: boolean | number
  optionFormat?: OptionFormat<R>
  fields?: PresetSelectFields
  selectProps?: SelectProps
  pagination?: Omit<PaginationProps, 'page' | 'pageSize'> | boolean
}
export type PresetSelectEmits<V extends PresetSelectValue, P extends RObject, D extends RObject, R extends RObject> = RemoteRequestEmits<P, D> & {
  (e: 'blur', ev: FocusEvent): void
  (e: 'clear'): void
  (e: 'create', label: string): SelectOption
  (e: 'focus', ev: FocusEvent): void
  (e: 'scroll', ev: Event): void
  (e: 'search', value: string): void
  (e: 'update:value', val: V | null, option: ArrayAwareType<V, SelectOption>, raw: ArrayAwareType<V, R>): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
```

## Props

| Name           | Type                       | Default | Description                    |
| -------------- | -------------------------- | ------- | ------------------------------ |
| api            | (params:Object)=>Promise   | -       | 异步接口返回的数据的方法       |
| value          | PresetSelectValue          | -       | 选择器的值                     |
| fallbackLabel  | String                     | -       | 无数据时的占位符               |
| defaultParams  | Object                     | -       | 默认的参数                     |
| manual         | Boolean                    | -       | 是否手动触发请求               |
| multiple       | Boolean                    | -       | 是否多选                       |
| disabled       | Boolean                    | -       | 是否禁用                       |
| debounce       | Boolean or Number          | -       | 防抖时间                       |
| optionFormat   | OptionFormat               | -       | 选项格式化函数                 |
| fields         | Object                     | -       | 内置参数的字段                 |
| pagination     | PaginationProps or Boolean | -       | 数据表格的分页配置             |
| selectProps    | SelectProps                | -       | 选择器的配置                   |
| requestOptions | UseRequestOptions          | -       | VueHooks UseRequest 的请求配置 |
| requestPlugins | UseRequestPlugin[]         | -       | VueHooks UseRequest 的插件配置 |

## Emits

| Name            | Type                                         | Description        |
| --------------- | -------------------------------------------- | ------------------ |
| before          | (params: D[]) => void                        | 数据加载前         |
| success         | (data: D, params: P[]) => void               | 数据加载完成       |
| error           | (error: Error, params: P[]) => void          | 数据加载失败       |
| finally         | params: (P[], data?: D, err?: Error) => void | 数据加载完成或失败 |
| update:value    | (val: PresetSelectValue) => void             | 值更新时           |
| update:page     | (page: number) => void                       | 页码更新时         |
| update:pageSize | (pageSize: number) => void                   | 每页数量更新时     |
