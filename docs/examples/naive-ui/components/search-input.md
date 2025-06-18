# SearchInput 搜索框

## Demo

<demo vue="./demos/search-input.vue" title="SearchInput" />

## Props

| Name          | Type                                                                              | Default | Description                                                  |
| ------------- | --------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| value         | String                                                                            | -       | 文本输入的值。                                               |
| autoTrigger   | Boolean&#124;Number                                                               | true    | 是否自动触发搜索，如果值为Number，则设置自动触发的延迟时间。 |
| searchButton  | Boolean                                                                           | true    | 是否显示搜索按钮                                             |
| inputProps    | [InputProps](https://www.naiveui.com/zh-CN/light/components/input#Input-Props)    | -       | 输入框配置                                                   |
| buttonProps   | [ButtonProps](https://www.naiveui.com/zh-CN/light/components/button#Button-Props) | -       | 按钮配置                                                     |
| @update:value | (value:string) => void                                                            | -       | 输入框值 停止输入 时触发                                     |

## Slots

| Name   | Description        |
| ------ | ------------------ |
| icon   | 自定义图标内容     |
| button | 自定义搜索按钮内容 |
