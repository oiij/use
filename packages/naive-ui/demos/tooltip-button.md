# TooltipButton 提示按钮

## 功能描述

**TooltipButton** 是一个功能强大的提示按钮组件，提供了完整的按钮和提示框组合能力，包括按钮配置、提示框配置、自定义内容等特性。它基于 Naive UI 的 Button 和 Tooltip 组件实现，为 Vue 应用提供了便捷的提示按钮解决方案。

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

<demo vue="./tooltip-button.vue" title="TooltipButton" />

## API

### Props

| Name         | Type                                                                                 | Default | Description  |
| ------------ | ------------------------------------------------------------------------------------ | ------- | ------------ |
| value        | String                                                                               | -       | 提示框内容值 |
| tooltipProps | [TooltipProps](https://www.naiveui.com/zh-CN/light/components/tooltip#Tooltip-Props) | -       | 提示框配置   |
| buttonProps  | [ButtonProps](https://www.naiveui.com/zh-CN/light/components/button#Button-Props)    | -       | 按钮配置     |
| @click       | (ev:MouseEvent) => void                                                              | -       | 点击时触发   |

### Slots

| Name    | Description        |
| ------- | ------------------ |
| default | 自定义按钮内容     |
| icon    | 自定义按钮图标内容 |
| tooltip | 自定义提示框内容   |

## 类型定义

```ts
export type TooltipButtonProps = {
  value: string
  tooltipProps?: TooltipProps
  buttonProps?: ButtonProps
  click?: (ev: MouseEvent) => void
}
```
