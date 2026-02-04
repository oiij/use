# ToggleInput 切换编辑

## 功能描述

**ToggleInput** 是一个功能强大的切换编辑组件，提供了完整的文本编辑切换能力，包括双击编辑、失焦保存等特性。它基于 Naive UI 的 Input 组件实现，为 Vue 应用提供了便捷的文本编辑解决方案。

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

<demo vue="./toggle-input.vue" title="ToggleInput" />

## API

### Props

| Name          | Type                                                                           | Default | Description              |
| ------------- | ------------------------------------------------------------------------------ | ------- | ------------------------ |
| value         | String                                                                         | -       | 文本输入的值。           |
| inputProps    | [InputProps](https://www.naiveui.com/zh-CN/light/components/input#Input-Props) | -       | 输入框配置               |
| @update:value | (value:string) => void                                                         | -       | 输入框值 停止输入 时触发 |

## 类型定义

```ts
export type ToggleInputProps = {
  'value': string
  'inputProps'?: InputProps
  'update:value'?: (value: string) => void
}
```
