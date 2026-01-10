# SearchInput 搜索框

## Demo

<demo vue="./demos/search-input.vue" title="SearchInput" />

## Types

```ts
export type SearchInputProps = {
  value?: string | null
  type?: ButtonProps['type']
  placeholder?: string
  autoTrigger?: boolean | number
  searchButton?: 'text' | 'icon' | boolean
  inputProps?: InputProps
  buttonProps?: ButtonProps
  loading?: boolean
}
```

## Props

| Name          | Type                        | Default | Description                                                  |
| ------------- | --------------------------- | ------- | ------------------------------------------------------------ |
| value         | String                      | -       | 文本输入的值                                                 |
| type          | String                      | -       | 输入框类型                                                   |
| placeholder   | String                      | -       | 输入框占位符                                                 |
| autoTrigger   | Boolean&#124;Number         | true    | 是否自动触发搜索，如果值为Number，则设置自动触发的延迟时间。 |
| searchButton  | Boolean or 'text' or 'icon' | true    | 是否显示搜索按钮                                             |
| loading       | Boolean                     | false   | 搜索按钮是否加载中                                           |
| inputProps    | InputProps                  | -       | 输入框配置                                                   |
| buttonProps   | ButtonProps                 | -       | 按钮配置                                                     |
| @update:value | (value:string) => void      | -       | 输入框值 停止输入 时触发                                     |

## Slots

| Name   | Description        |
| ------ | ------------------ |
| icon   | 自定义图标内容     |
| button | 自定义搜索按钮内容 |
