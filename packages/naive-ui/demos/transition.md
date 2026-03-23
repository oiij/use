# Transition 过渡动画

## 功能描述

**Transition** 是一个功能强大的过渡动画组件，提供了完整的元素进入/离开动画能力，包括动画名称配置、过渡属性自定义等特性。它基于 Vue 的内置 Transition 组件实现，为 Vue 应用提供了流畅的过渡动画效果。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/naive-ui

# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui
```

## 依赖

- `vue`: ^3.0.0

## 基本使用

<demo vue="./transition.vue" title="Transition" />

## API

### `<Transition />`

过渡动画组件。

#### Props

| 属性              | 类型              | 默认值   | 说明                    |
| ----------------- | ----------------- | -------- | ----------------------- |
| `name`            | `string`          | `'fade'` | 动画名                  |
| `transitionProps` | `TransitionProps` | -        | Transition 组件的 props |

#### Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 需要动画的内容 |

## 支持的动画

| 动画名        | 说明         |
| ------------- | ------------ |
| `fade`        | 淡入淡出     |
| `fade-up`     | 向上淡入淡出 |
| `fade-down`   | 向下淡入淡出 |
| `fade-left`   | 向左淡入淡出 |
| `fade-right`  | 向右淡入淡出 |
| `zoom`        | 缩放         |
| `zoom-up`     | 向上缩放     |
| `zoom-down`   | 向下缩放     |
| `zoom-left`   | 向左缩放     |
| `zoom-right`  | 向右缩放     |
| `slide-up`    | 向上滑动     |
| `slide-down`  | 向下滑动     |
| `slide-left`  | 向左滑动     |
| `slide-right` | 向右滑动     |

## 类型定义

```ts
export type TransitionProps = {
  /**
   * 动画名
   * @default 'fade'
   */
  name?: string
  /**
   * Transition 组件的 props
   */
  transitionProps?: VueTransitionProps
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { Transition } from '@oiij/naive-ui'
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <button @click="show = !show">
    切换
  </button>
  <Transition name="fade">
    <div v-if="show">
      内容
    </div>
  </Transition>
</template>
```

### 向上滑动

```vue
<script setup>
import { Transition } from '@oiij/naive-ui'
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <button @click="show = !show">
    切换
  </button>
  <Transition name="slide-up">
    <div v-if="show">
      内容
    </div>
  </Transition>
</template>
```

### 缩放动画

```vue
<script setup>
import { Transition } from '@oiij/naive-ui'
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <button @click="show = !show">
    切换
  </button>
  <Transition name="zoom">
    <div v-if="show">
      内容
    </div>
  </Transition>
</template>
```
