# UseSpline

## 功能描述

**UseSpline** 是一个用于加载 Spline 3D 模型的 Vue 组合式函数，提供简单易用的 API 来加载和管理 Spline 场景，支持响应式场景 URL、事件监听和自动资源清理。

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

## 基本使用

<demo vue="./spline.vue" title="UseSpline" />

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
  /**
   * 容器引用
   */
  templateRef: TemplateRef<HTMLElement>
  /**
   * Spline 应用实例
   */
  app: Ref<Application | null>
  /**
   * 加载状态
   */
  isLoading: Ref<boolean>
  /**
   * 错误信息
   */
  error: Ref<Error | null>
  /**
   * 容器宽度
   */
  width: Ref<number>
  /**
   * 容器高度
   */
  height: Ref<number>
  /**
   * 加载场景
   */
  load: (sceneUrl: string) => Promise<void>
  /**
   * 重新加载
   */
  reload: () => void
  /**
   * 销毁实例
   */
  dispose: () => void
  /**
   * 创建完成事件
   */
  onCreated: (callback: (app: Application) => void) => void
  /**
   * 加载完成事件
   */
  onLoaded: (callback: (app: Application) => void) => void
  /**
   * 错误事件
   */
  onError: (callback: (error: Error) => void) => void
  /**
   * 销毁事件
   */
  onDisposed: (callback: () => void) => void
}

export declare function useSpline(templateRef: TemplateRef<HTMLElement>, options?: UseSplineOptions): UseSplineReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useSpline } from '@oiij/spline'
import { useTemplateRef } from 'vue'

const sceneUrl = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

const { app, isLoading, error } = useSpline(useTemplateRef('canvas'), {
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

const { isLoading } = useSpline(useTemplateRef('canvas'), {
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

const { onCreated, onLoaded, onError } = useSpline(useTemplateRef('canvas'), {
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

const { load, reload, dispose } = useSpline(useTemplateRef('canvas'), {
  manual: true
})
</script>

<template>
  <button @click="load(sceneUrl)">
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
