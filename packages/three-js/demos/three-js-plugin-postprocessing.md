# UsePostprocessing

## 功能描述

**UsePostprocessing** 是一个基于 postprocessing 库的后处理插件，提供了完整的后期处理能力，包括渲染通道管理、效果组合、抗锯齿、轮廓效果、Bloom 效果等特性。它与 Three.js 无缝集成，为 Vue 应用提供了高质量的 3D 视觉效果。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/three-js postprocessing

# 使用 npm
npm install @oiij/three-js postprocessing

# 使用 yarn
yarn add @oiij/three-js postprocessing
```

## 依赖

- `vue`: ^3.0.0
- `three`: ^0.160.0
- `postprocessing`: ^6.0.0

## 基本使用

<demo vue="./three-js-plugin-postprocessing.vue" title="UsePostprocessing" />

## API

### `usePostprocessing(renderer, scene, camera, options?)`

创建后处理效果合成器。

#### 参数

| 参数       | 类型                    | 说明           |
| ---------- | ----------------------- | -------------- |
| `renderer` | `WebGLRenderer`         | WebGL 渲染器   |
| `scene`    | `Scene`                 | Three.js 场景  |
| `camera`   | `Camera`                | Three.js 相机  |
| `options`  | `EffectComposerOptions` | 后处理配置选项 |

#### 返回值

| 属性           | 类型             | 说明             |
| -------------- | ---------------- | ---------------- |
| `composer`     | `EffectComposer` | 后处理效果合成器 |
| `renderPass`   | `RenderPass`     | 渲染通道         |
| `dispose()`    | `Function`       | 销毁后处理效果   |
| `resize(size)` | `Function`       | 调整后处理尺寸   |

### `useSmaaEffectPass(camera, options?)`

创建 SMAA 抗锯齿效果通道。

#### 参数

| 参数      | 类型                | 说明          |
| --------- | ------------------- | ------------- |
| `camera`  | `Camera`            | Three.js 相机 |
| `options` | `SMAAEffectOptions` | SMAA 配置选项 |

#### 返回值

| 属性             | 类型         | 说明          |
| ---------------- | ------------ | ------------- |
| `smaaEffect`     | `SMAAEffect` | SMAA 效果     |
| `smaaEffectPass` | `EffectPass` | SMAA 效果通道 |
| `dispose()`      | `Function`   | 销毁效果      |

### `useOutlinePass(scene, camera, options?)`

创建轮廓效果通道。

#### 参数

| 参数      | 类型                   | 说明             |
| --------- | ---------------------- | ---------------- |
| `scene`   | `Scene`                | Three.js 场景    |
| `camera`  | `Camera`               | Three.js 相机    |
| `options` | `OutlineEffectOptions` | 轮廓效果配置选项 |

#### 返回值

| 属性            | 类型            | 说明         |
| --------------- | --------------- | ------------ |
| `outlineEffect` | `OutlineEffect` | 轮廓效果     |
| `outlinePass`   | `EffectPass`    | 轮廓效果通道 |
| `selection`     | `Selection`     | 选中对象集合 |
| `dispose()`     | `Function`      | 销毁效果     |

### `useSelectiveBloomPass(scene, camera, options?)`

创建选择性 Bloom 发光效果通道。

#### 参数

| 参数      | 类型                 | 说明               |
| --------- | -------------------- | ------------------ |
| `scene`   | `Scene`              | Three.js 场景      |
| `camera`  | `Camera`             | Three.js 相机      |
| `options` | `BloomEffectOptions` | Bloom 效果配置选项 |

#### 返回值

| 属性                       | 类型                   | 说明              |
| -------------------------- | ---------------------- | ----------------- |
| `selectiveBloomEffect`     | `SelectiveBloomEffect` | 选择性 Bloom 效果 |
| `selectiveBloomEffectPass` | `EffectPass`           | Bloom 效果通道    |
| `selection`                | `Selection`            | 选中对象集合      |
| `dispose()`                | `Function`             | 销毁效果          |

## 类型定义

```ts
import type { EffectComposer, Material, Pass, RenderPass } from 'postprocessing'
import type { Camera, Scene, WebGLRenderer } from 'three'

export type EffectComposerOptions = {
  /**
   * 深度缓冲区
   * @default true
   */
  depthBuffer?: boolean
  /**
   * 模板缓冲区
   * @default false
   */
  stencilBuffer?: boolean
  /**
   * Alpha 通道
   * @default false
   */
  alpha?: boolean
  /**
   * 多重采样
   * @default 0
   */
  multisampling?: number
  /**
   * 帧缓冲类型
   */
  frameBufferType?: number
  /**
   * 通道数组或通道工厂函数数组
   */
  passes?: Pass[] | ((renderer: WebGLRenderer, scene: Scene, camera: Camera) => Pass)[]
  /**
   * 覆盖材质
   */
  overrideMaterial?: Material
}

export type UsePostprocessingReturns = {
  composer: EffectComposer
  renderPass: RenderPass
  dispose: () => void
  resize: (size: { width: number, height: number }) => void
}

export declare function usePostprocessing(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  options?: EffectComposerOptions
): UsePostprocessingReturns

export declare function useSmaaEffectPass(camera: Camera, options?: SMAAEffectOptions): UseSmaaEffectPassReturns
export declare function useOutlinePass(scene: Scene, camera: Camera, options?: OutlineEffectOptions): UseOutlinePassReturns
export declare function useSelectiveBloomPass(scene: Scene, camera: Camera, options?: BloomEffectOptions): UseSelectiveBloomPassReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { usePostprocessing, useSmaaEffectPass } from '@oiij/three-js/plugins'
import { useTemplateRef } from 'vue'

const { renderer, scene, camera, onLoop, onResize } = useThreeJs(useTemplateRef('canvas'))

const { smaaEffectPass } = useSmaaEffectPass(camera)
const { composer, resize } = usePostprocessing(renderer, scene, camera, {
  passes: [smaaEffectPass]
})

onLoop(() => {
  composer.render()
})

onResize(({ width, height }) => {
  resize({ width, height })
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 轮廓效果

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { useOutlinePass, usePostprocessing, useSmaaEffectPass } from '@oiij/three-js/plugins'
import { useTemplateRef } from 'vue'

const { renderer, scene, camera, onLoop, onDoubleClick, onIntersectObject } = useThreeJs(useTemplateRef('canvas'))

const { smaaEffectPass } = useSmaaEffectPass(camera)
const { outlinePass, selection } = useOutlinePass(scene, camera)
const { composer } = usePostprocessing(renderer, scene, camera, {
  passes: [smaaEffectPass, outlinePass]
})

onLoop(() => {
  composer.render()
})

onDoubleClick((event) => {
  onIntersectObject(objects, event, (intersects) => {
    selection.set([intersects[0]])
  })
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### Bloom 发光效果

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { usePostprocessing, useSelectiveBloomPass } from '@oiij/three-js/plugins'
import { useTemplateRef } from 'vue'

const { renderer, scene, camera, onLoop } = useThreeJs(useTemplateRef('canvas'))

const { selectiveBloomEffectPass, selection } = useSelectiveBloomPass(scene, camera)
const { composer } = usePostprocessing(renderer, scene, camera, {
  passes: [selectiveBloomEffectPass]
})

// 设置需要发光的对象
selection.set([glowingObject])

onLoop(() => {
  composer.render()
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```
