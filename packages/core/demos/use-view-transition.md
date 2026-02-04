# UseViewTransition

## 功能描述

**UseViewTransition** 是一个用于实现视图过渡动画的 Vue 组合式函数，支持自定义过渡 duration、easing 函数和效果控制，可用于创建平滑的页面或组件切换效果。

## 安装

```bash
# 使用 npm
npm install @use/core

# 使用 yarn
yarn add @use/core

# 使用 pnpm
pnpm add @use/core
```

## 基本使用

<demo vue="./use-view-transition.vue" title="UseViewTransition" />

## API

### 函数签名

```ts
declare function useViewTransition(options?: ViewTransitionOptions): UseViewTransitionReturns
```

## 类型定义

```ts
type ViewTransitionOptions = {
  duration?: number
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  effect?: boolean
  reverseSelector?: string
}

export type UseViewTransitionReturns = {
  run: (cb: () => void, opt?: {
    reverse?: boolean
    x: number
    y: number
  }) => Promise<void>
}

export function useViewTransition(options?: ViewTransitionOptions): UseViewTransitionReturns
```
