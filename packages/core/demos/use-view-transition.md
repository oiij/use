# UseViewTransition

## 功能描述

**UseViewTransition** 是一个用于实现视图过渡动画的 Vue 组合式函数，基于浏览器的 View Transitions API，支持自定义过渡 duration、easing 函数和效果控制，可用于创建平滑的页面或组件切换效果。

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

<demo vue="./use-view-transition.vue" title="UseViewTransition" />

## API

### `useViewTransition(options?)`

创建视图过渡动画。

#### 参数

| 参数      | 类型                    | 说明     |
| --------- | ----------------------- | -------- |
| `options` | `ViewTransitionOptions` | 配置选项 |

#### ViewTransitionOptions

| 选项              | 类型      | 默认值          | 说明                     |
| ----------------- | --------- | --------------- | ------------------------ |
| `duration`        | `number`  | `1000`          | 过渡动画持续时间（毫秒） |
| `easing`          | `string`  | `'ease-in-out'` | 缓动函数                 |
| `effect`          | `boolean` | `true`          | 是否启用效果             |
| `reverseSelector` | `string`  | -               | 反向选择器               |

#### 返回值

| 属性                      | 类型                   | 说明                          |
| ------------------------- | ---------------------- | ----------------------------- |
| `isSupported`             | `ComputedRef<boolean>` | 是否支持 View Transitions API |
| `run(callback, options?)` | `Function`             | 执行过渡动画                  |

## 类型定义

```ts
export type ViewTransitionOptions = {
  /**
   * 过渡动画持续时间（毫秒）
   * @default 1000
   */
  duration?: number
  /**
   * 缓动函数
   * @default 'ease-in-out'
   */
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  /**
   * 是否启用效果
   * @default true
   */
  effect?: boolean
  /**
   * 反向选择器
   */
  reverseSelector?: string
}

export type UseViewTransitionReturns = {
  /**
   * 是否支持 View Transitions API
   */
  isSupported: ComputedRef<boolean>
  /**
   * 执行过渡动画
   */
  run: (callback: () => void, options?: { reverse?: boolean, x?: number, y?: number }) => Promise<void>
}

export declare function useViewTransition(options?: ViewTransitionOptions): UseViewTransitionReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useViewTransition } from '@oiij/use'

const { isSupported, run } = useViewTransition()

async function toggleTheme() {
  await run(() => {
    document.documentElement.classList.toggle('dark')
  })
}
</script>

<template>
  <button v-if="isSupported" @click="toggleTheme">
    切换主题
  </button>
</template>
```

### 自定义配置

```ts
import { useViewTransition } from '@oiij/use'

const { run } = useViewTransition({
  duration: 800,
  easing: 'ease-out',
  effect: true
})

await run(() => {
  // 执行 DOM 操作
})
```

### 使用事件定位动画中心

```vue
<script setup>
import { useViewTransition } from '@oiij/use'

const { run } = useViewTransition()

async function handleClick(event) {
  await run(() => {
    document.documentElement.classList.toggle('dark')
  }, {
    x: event.clientX,
    y: event.clientY
  })
}
</script>

<template>
  <button @click="handleClick">
    切换（带动画）
  </button>
</template>
```

### 反向动画

```ts
import { useViewTransition } from '@oiij/use'

const { run } = useViewTransition({
  reverseSelector: '.dark'
})

// 反向动画
await run(() => {
  document.documentElement.classList.remove('dark')
}, {
  reverse: true
})
```
