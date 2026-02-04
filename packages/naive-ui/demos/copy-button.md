# CopyButton 复制按钮

## 功能描述

**CopyButton** 是一个功能强大的复制按钮组件，提供了完整的复制功能，包括文本复制、复制反馈、自定义提示等特性。它基于 Naive UI 的 Button 和 Tooltip 组件实现，为 Vue 应用提供了流畅的复制操作体验。

## 安装

```bash
# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui

# 使用 pnpm
pnpm add @oiij/naive-ui
```

## 基本使用

<demo vue="./copy-button.vue" title="CopyButton" />

## API

### Props

| Name         | Type                                                                                 | Default | Description    |
| ------------ | ------------------------------------------------------------------------------------ | ------- | -------------- |
| value        | String                                                                               | -       | 复制的值       |
| config       | [UseClipboardOptions](https://vueuse.org/core/useClipboard/#type-declarations)       | -       | 复制配置       |
| tooltipProps | [TooltipProps](https://www.naiveui.com/zh-CN/light/components/tooltip#Tooltip-Props) | -       | 提示框配置     |
| buttonProps  | [ButtonProps](https://www.naiveui.com/zh-CN/light/components/button#Button-Props)    | -       | 按钮配置       |
| @copied      | (value:string) => void                                                               | -       | 复制成功时触发 |

### Slots

| Name    | Description      |
| ------- | ---------------- |
| default | 自定义按钮内容   |
| icon    | 自定义图标内容   |
| tooltip | 自定义提示框内容 |

## 类型定义

```ts
export type CopyButtonProps = {
  value: string
  config?: UseClipboardOptions
  tooltipProps?: TooltipProps
  buttonProps?: ButtonProps
  copied?: (value: string) => void
}
```
