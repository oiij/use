# @oiij/spline

[![NPM version](https://img.shields.io/npm/v/@oiij/spline)](https://www.npmjs.com/package/@oiij/spline)
[![MIT-license](https://img.shields.io/npm/l/@oiij/spline)](https://github.com/oiij/use/blob/main/packages/spline/LICENSE)

## 简介

Use Spline 是基于 Spline Runtime 的 Vue 3 组合式函数封装，提供便捷的 Spline 3D 模型加载功能，帮助开发者在应用中轻松集成 3D 交互体验。

## 特点

### 🎮 3D 模型加载

- 🔗 提供简洁的 Spline 场景加载接口
- 🔄 支持响应式场景 URL，自动重新加载
- 📡 完整的事件系统，监听加载生命周期

### 🔄 响应式设计

- 📐 自动响应容器尺寸变化
- 🔀 支持动态切换场景
- 🧹 自动清理资源

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/spline @splinetool/runtime

# 使用 npm
npm install @oiij/spline @splinetool/runtime

# 使用 yarn
yarn add @oiij/spline @splinetool/runtime
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `@splinetool/runtime`: ^1.0.0

## 示例

### 基础使用

```vue
<script setup>
import { useSpline } from '@oiij/spline'
import { useTemplateRef } from 'vue'

const canvasRef = useTemplateRef('canvas')
const sceneUrl = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

const { app, isLoading, error } = useSpline(canvasRef, {
  scene: sceneUrl
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-if="error">
    {{ error.message }}
  </div>
</template>
```

### 动态切换场景

```vue
<script setup>
import { useSpline } from '@oiij/spline'
import { computed, ref, useTemplateRef } from 'vue'

const scenes = {
  cube: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  sphere: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
}

const currentScene = ref('cube')
const sceneUrl = computed(() => scenes[currentScene.value])

const { isLoading, reload } = useSpline(useTemplateRef('canvas'), {
  scene: sceneUrl
})
</script>

<template>
  <button @click="currentScene = 'cube'">
    Cube
  </button>
  <button @click="currentScene = 'sphere'">
    Sphere
  </button>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 事件监听

```vue
<script setup>
import { useSpline } from '@oiij/spline'
import { useTemplateRef } from 'vue'

const sceneUrl = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

const { onCreated, onLoaded, onError, onDisposed } = useSpline(useTemplateRef('canvas'), {
  scene: sceneUrl
})

onCreated((spline) => {
  console.log('Spline 实例已创建', spline)
})

onLoaded((spline) => {
  console.log('场景加载完成', spline)
})

onError((err) => {
  console.error('加载失败', err)
})

onDisposed(() => {
  console.log('资源已清理')
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 手动控制

```vue
<script setup>
import { useSpline } from '@oiij/spline'
import { useTemplateRef } from 'vue'

const sceneUrl = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

const { load, reload, dispose, app } = useSpline(useTemplateRef('canvas'), {
  scene: sceneUrl,
  manual: true
})

function handleLoad() {
  load(sceneUrl)
}
</script>

<template>
  <button @click="handleLoad">
    加载场景
  </button>
  <button @click="reload">
    重新加载
  </button>
  <button @click="dispose">
    销毁
  </button>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

## API

### `useSpline(templateRef, options?)`

使用 Spline 加载 3D 场景。

#### 参数

| 参数          | 类型                       | 说明                  |
| ------------- | -------------------------- | --------------------- |
| `templateRef` | `TemplateRef<HTMLElement>` | Spline 容器的模板引用 |
| `options`     | `UseSplineOptions`         | Spline 配置选项       |

#### UseSplineOptions

| 选项              | 类型                       | 默认值  | 说明             |
| ----------------- | -------------------------- | ------- | ---------------- |
| `scene`           | `MaybeRefOrGetter<string>` | -       | 场景 URL         |
| `manual`          | `boolean`                  | `false` | 是否手动控制加载 |
| `disableAutoLoad` | `boolean`                  | `false` | 是否禁用自动加载 |

#### 返回值

| 属性                   | 类型                       | 说明            |
| ---------------------- | -------------------------- | --------------- |
| `templateRef`          | `TemplateRef<HTMLElement>` | 容器引用        |
| `app`                  | `Ref<Application \| null>` | Spline 应用实例 |
| `isLoading`            | `Ref<boolean>`             | 加载状态        |
| `error`                | `Ref<Error \| null>`       | 错误信息        |
| `width`                | `Ref<number>`              | 容器宽度        |
| `height`               | `Ref<number>`              | 容器高度        |
| `load(sceneUrl)`       | `Function`                 | 加载场景        |
| `reload()`             | `Function`                 | 重新加载        |
| `dispose()`            | `Function`                 | 销毁实例        |
| `onCreated(callback)`  | `Function`                 | 创建完成事件    |
| `onLoaded(callback)`   | `Function`                 | 加载完成事件    |
| `onError(callback)`    | `Function`                 | 错误事件        |
| `onDisposed(callback)` | `Function`                 | 销毁事件        |

## 类型定义

```ts
import type { Application } from '@splinetool/runtime'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type UseSplineOptions = {
  /**
   * 场景 URL
   */
  scene?: MaybeRefOrGetter<string>
  /**
   * 是否手动控制加载
   * @default false
   */
  manual?: boolean
  /**
   * 是否禁用自动加载
   * @default false
   */
  disableAutoLoad?: boolean
}

export type UseSplineReturns = {
  templateRef: TemplateRef<HTMLElement>
  app: Ref<Application | null>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  width: Ref<number>
  height: Ref<number>
  load: (sceneUrl: string) => Promise<void>
  reload: () => void
  dispose: () => void
  onCreated: (callback: (app: Application) => void) => void
  onLoaded: (callback: (app: Application) => void) => void
  onError: (callback: (error: Error) => void) => void
  onDisposed: (callback: () => void) => void
}

export declare function useSpline(templateRef: TemplateRef<HTMLElement>, options?: UseSplineOptions): UseSplineReturns
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/spline/spline)
