# LoadingProvider 全屏加载

## 功能描述

**LoadingProvider** 是一个功能强大的全屏加载组件，提供了完整的加载状态管理能力，包括显示/隐藏控制、遮罩配置、背景模糊、自动隐藏等特性。它基于 Naive UI 的 Spin 组件实现，为 Vue 应用提供了统一的加载状态展示方案。

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

<demo vue="./loading-provider.vue" title="LoadingProvider" />

## API

### Props

| Name      | Type                | Default | Description          |
| --------- | ------------------- | ------- | -------------------- |
| show      | Boolean             | false   | 是否显示加载         |
| appendTo  | String              | 'body'  | 加载元素挂载的父元素 |
| mask      | Boolean&#124;Object | true    | 是否显示遮罩         |
| blur      | Boolean             | true    | 是否模糊背景         |
| duration  | Number              | -       | 自动隐藏时间         |
| spinProps | SpinProps           | -       | 加载图标配置         |

### Slots

| Name        | Description    |
| ----------- | -------------- |
| icon        | 自定义图标内容 |
| description | 自定义文字内容 |

## 类型定义

```ts
export type LoadingProviderProps = {
  show: boolean
  appendTo?: string
  mask?: boolean | object
  blur?: boolean
  duration?: number
  spinProps?: SpinProps
}
```
