# ToggleInput 切换编辑

## Demo

<demo vue="./demos/toggle-input.vue" title="ToggleInput" />

## Props

| Name          | Type                                                                           | Default | Description              |
| ------------- | ------------------------------------------------------------------------------ | ------- | ------------------------ |
| value         | String                                                                         | -       | 文本输入的值。           |
| inputProps    | [InputProps](https://www.naiveui.com/zh-CN/light/components/input#Input-Props) | -       | 输入框配置               |
| @update:value | (value:string) => void                                                         | -       | 输入框值 停止输入 时触发 |
