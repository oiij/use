# TooltipButton 提示按钮

## Demo

<demo vue="./demos/tooltip-button.vue" title="TooltipButton" />

## Props

| Name         | Type                                                                                 | Default | Description    |
| ------------ | ------------------------------------------------------------------------------------ | ------- | -------------- |
| value        | String                                                                               | -       | 提示框内容值   |
| tooltipProps | [TooltipProps](https://www.naiveui.com/zh-CN/light/components/tooltip#Tooltip-Props) | -       | 提示框配置     |
| buttonProps  | [ButtonProps](https://www.naiveui.com/zh-CN/light/components/button#Button-Props)    | -       | 按钮配置       |
| @click       | (ev:MouseEvent) => void                                                              | -       | 复制成功时触发 |

## Slots

| Name    | Description        |
| ------- | ------------------ |
| default | 自定义按钮内容     |
| icon    | 自定义按钮图标内容 |
| tooltip | 自定义提示框内容   |
