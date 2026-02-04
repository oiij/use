# CopyButton 复制按钮

## Demo

<demo vue="./copy-button.vue" title="CopyButton" />

## Props

| Name         | Type                                                                                 | Default | Description    |
| ------------ | ------------------------------------------------------------------------------------ | ------- | -------------- |
| value        | String                                                                               | -       | 复制的值       |
| config       | [UseClipboardOptions](https://vueuse.org/core/useClipboard/#type-declarations)       | -       | 复制配置       |
| tooltipProps | [TooltipProps](https://www.naiveui.com/zh-CN/light/components/tooltip#Tooltip-Props) | -       | 提示框配置     |
| buttonProps  | [ButtonProps](https://www.naiveui.com/zh-CN/light/components/button#Button-Props)    | -       | 按钮配置       |
| @copied      | (value:string) => void                                                               | -       | 复制成功时触发 |

## Slots

| Name    | Description      |
| ------- | ---------------- |
| default | 自定义按钮内容   |
| icon    | 自定义图标内容   |
| tooltip | 自定义提示框内容 |
