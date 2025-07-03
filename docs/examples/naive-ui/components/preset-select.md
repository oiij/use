# PresetSelect 配置选择器

## Demo

<demo vue="./demos/preset-select.vue" title="PresetSelect" />

## Props

| Name           | Type                       | Default | Description                    |
| -------------- | -------------------------- | ------- | ------------------------------ |
| api            | (params:Object)=>Promise   | -       | 异步接口返回的数据的方法       |
| value          | PresetSelectValue          | -       | 选择器的值                     |
| fallbackLabel  | string                     | -       | 无数据时的占位符               |
| defaultParams  | Object                     | -       | 默认的参数                     |
| manual         | boolean                    | -       | 是否手动触发请求               |
| multiple       | boolean                    | -       | 是否多选                       |
| disabled       | boolean                    | -       | 是否禁用                       |
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
