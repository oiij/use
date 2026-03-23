# LoadingProvider 全屏加载

## 功能描述

**LoadingProvider** 是一个功能强大的全屏加载组件，提供了完整的加载状态管理能力，包括显示/隐藏控制、遮罩配置、背景模糊、自动隐藏等特性。它基于 Naive UI 的 Spin 组件实现，为 Vue 应用提供了统一的加载状态展示方案。

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
- `naive-ui`: ^2.0.0

## 基本使用

<demo vue="./loading-provider.vue" title="LoadingProvider" />

## API

### `<LoadingProvider />`

全屏加载提供者组件。

#### Props

| 属性        | 类型                | 默认值   | 说明                 |
| ----------- | ------------------- | -------- | -------------------- |
| `show`      | `boolean`           | `false`  | 是否显示加载         |
| `appendTo`  | `string`            | `'body'` | 加载元素挂载的父元素 |
| `mask`      | `boolean \| object` | `true`   | 是否显示遮罩         |
| `blur`      | `boolean`           | `true`   | 是否模糊背景         |
| `duration`  | `number`            | -        | 自动隐藏时间（毫秒） |
| `spinProps` | `SpinProps`         | -        | 加载图标配置         |

#### Slots

| 插槽          | 说明           |
| ------------- | -------------- |
| `icon`        | 自定义图标内容 |
| `description` | 自定义文字内容 |

## 类型定义

```ts
export type LoadingProviderProps = {
  /**
   * 是否显示加载
   * @default false
   */
  show: boolean
  /**
   * 加载元素挂载的父元素
   * @default 'body'
   */
  appendTo?: string
  /**
   * 是否显示遮罩
   * @default true
   */
  mask?: boolean | object
  /**
   * 是否模糊背景
   * @default true
   */
  blur?: boolean
  /**
   * 自动隐藏时间（毫秒）
   */
  duration?: number
  /**
   * 加载图标配置
   */
  spinProps?: SpinProps
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { LoadingProvider } from '@oiij/naive-ui'
import { ref } from 'vue'

const loading = ref(false)

function showLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <button @click="showLoading">
    显示加载
  </button>
  <LoadingProvider :show="loading" />
</template>
```

### 自动隐藏

```vue
<script setup>
import { LoadingProvider } from '@oiij/naive-ui'
import { ref } from 'vue'

const loading = ref(false)
</script>

<template>
  <button @click="loading = true">
    显示加载（3秒后自动隐藏）
  </button>
  <LoadingProvider :show="loading" :duration="3000" />
</template>
```

### 使用 useLoading

```vue
<script setup>
import { LoadingProvider, useLoading } from '@oiij/naive-ui'

const loading = useLoading()

function fetchData() {
  loading?.start()
  // 模拟请求
  setTimeout(() => {
    loading?.finish()
  }, 2000)
}
</script>

<template>
  <LoadingProvider :show="false" />
  <button @click="fetchData">
    获取数据
  </button>
</template>
```
