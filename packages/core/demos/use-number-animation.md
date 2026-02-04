# UseNumberAnimation

## 功能描述

**UseNumberAnimation** 是一个用于数字平滑过渡动画的 Vue 组合式函数，支持从一个值平滑过渡到另一个值，提供了多种缓动函数、动画控制和事件钩子。它基于 RAF (Request Animation Frame) 实现，确保动画流畅且性能高效。

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

<demo vue="./use-number-animation.vue" title="UseNumberAnimation" />

## API

### 函数签名

```ts
declare function useNumberAnimation(
  to: Ref<number> | number,
  options?: NumberAnimationOptions
): UseNumberAnimationReturns
```

## 类型定义

```ts
type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | ((t: number) => number)

export type NumberAnimationOptions = {
  from?: number
  manual?: boolean
  duration?: number
  precision?: number
  easing?: EasingFunction
}

export type UseNumberAnimationReturns = {
  value: Readonly<Ref<string>>
  isActive: Readonly<ShallowRef<boolean>>
  start: () => void
  stop: () => void
  pause: Fn
  resume: Fn
  onStart: EventHookOn<[]>
  onEnd: EventHookOn<[]>
  onProgress: EventHookOn<[number]>
}

export function useNumberAnimation(
  to: Ref<number> | number,
  options?: NumberAnimationOptions
): UseNumberAnimationReturns
```
