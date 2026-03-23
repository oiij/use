# UseNumberAnimation

## 功能描述

**UseNumberAnimation** 是一个用于数字平滑过渡动画的 Vue 组合式函数，支持从一个值平滑过渡到另一个值，提供了多种缓动函数、动画控制和事件钩子。它基于 RAF (Request Animation Frame) 实现，确保动画流畅且性能高效。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./use-number-animation.vue" title="UseNumberAnimation" />

## API

### `useNumberAnimation(options?)`

创建数字动画。

#### 参数

| 参数      | 类型                     | 说明     |
| --------- | ------------------------ | -------- |
| `options` | `NumberAnimationOptions` | 配置选项 |

#### NumberAnimationOptions

| 选项        | 类型             | 默认值     | 说明                 |
| ----------- | ---------------- | ---------- | -------------------- |
| `from`      | `number`         | `0`        | 起始值               |
| `to`        | `number`         | -          | 目标值               |
| `duration`  | `number`         | `1000`     | 动画持续时间（毫秒） |
| `precision` | `number`         | `0`        | 数字精度（小数位数） |
| `easing`    | `EasingFunction` | `'linear'` | 缓动函数             |
| `manual`    | `boolean`        | `false`    | 是否手动触发         |

#### 返回值

| 属性                   | 类型                     | 说明             |
| ---------------------- | ------------------------ | ---------------- |
| `value`                | `Readonly<Ref<string>>`  | 当前动画值       |
| `isActive`             | `Readonly<Ref<boolean>>` | 动画是否正在进行 |
| `start()`              | `Function`               | 开始动画         |
| `stop()`               | `Function`               | 停止动画         |
| `pause()`              | `Function`               | 暂停动画         |
| `resume()`             | `Function`               | 恢复动画         |
| `onStart(callback)`    | `Function`               | 动画开始事件     |
| `onEnd(callback)`      | `Function`               | 动画结束事件     |
| `onProgress(callback)` | `Function`               | 动画进度事件     |

## 类型定义

```ts
type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | ((t: number) => number)

export type NumberAnimationOptions = {
  /**
   * 起始值
   * @default 0
   */
  from?: number
  /**
   * 目标值
   */
  to?: number
  /**
   * 动画持续时间（毫秒）
   * @default 1000
   */
  duration?: number
  /**
   * 数字精度（小数位数）
   * @default 0
   */
  precision?: number
  /**
   * 缓动函数
   * @default 'linear'
   */
  easing?: EasingFunction
  /**
   * 是否手动触发
   * @default false
   */
  manual?: boolean
}

export type UseNumberAnimationReturns = {
  value: Readonly<Ref<string>>
  isActive: Readonly<Ref<boolean>>
  start: () => void
  stop: () => void
  pause: () => void
  resume: () => void
  onStart: (callback: () => void) => void
  onEnd: (callback: () => void) => void
  onProgress: (callback: (value: number) => void) => void
}

export declare function useNumberAnimation(options?: NumberAnimationOptions): UseNumberAnimationReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useNumberAnimation } from '@oiij/use'

const { value, start, isActive } = useNumberAnimation({
  from: 0,
  to: 1000,
  duration: 2000
})
</script>

<template>
  <p>{{ value }}</p>
  <button :disabled="isActive" @click="start">
    开始动画
  </button>
</template>
```

### 带缓动函数

```ts
import { useNumberAnimation } from '@oiij/use'

const { value } = useNumberAnimation({
  from: 0,
  to: 100,
  duration: 1000,
  easing: 'easeOut'
})
```

### 自定义缓动函数

```ts
import { useNumberAnimation } from '@oiij/use'

const { value } = useNumberAnimation({
  from: 0,
  to: 100,
  duration: 1000,
  easing: t => t * t // 二次方缓动
})
```

### 手动控制

```vue
<script setup>
import { useNumberAnimation } from '@oiij/use'

const { value, start, stop, pause, resume, isActive } = useNumberAnimation({
  from: 0,
  to: 1000,
  duration: 2000,
  manual: true
})
</script>

<template>
  <p>{{ value }}</p>
  <button @click="start">
    开始
  </button>
  <button @click="pause">
    暂停
  </button>
  <button @click="resume">
    继续
  </button>
  <button @click="stop">
    停止
  </button>
</template>
```

### 监听事件

```ts
import { useNumberAnimation } from '@oiij/use'

const { value, onStart, onEnd, onProgress } = useNumberAnimation({
  from: 0,
  to: 1000,
  duration: 2000
})

onStart(() => {
  console.log('动画开始')
})

onEnd(() => {
  console.log('动画结束')
})

onProgress((value) => {
  console.log('当前值:', value)
})
```
