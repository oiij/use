# Transition 过渡动画

## 功能描述

**Transition** 是一个功能强大的过渡动画组件，提供了完整的元素进入/离开动画能力，包括动画名称配置、过渡属性自定义等特性。它基于 Vue 的内置 Transition 组件实现，为 Vue 应用提供了流畅的过渡动画效果。

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

<demo vue="./transition.vue" title="Transition" />

## API

### Props

| Name            | Type            | Default | Description             |
| --------------- | --------------- | ------- | ----------------------- |
| name            | String          | fade    | 动画名                  |
| transitionProps | TransitionProps | -       | Transition 组件的 props |

### Slots

| Name    | Description    |
| ------- | -------------- |
| default | 需要动画的内容 |

## 类型定义

```ts
export type TransitionProps = {
  name?: string
  transitionProps?: TransitionProps
}
```
