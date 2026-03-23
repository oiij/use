# @oiij/three-js

[![NPM version](https://img.shields.io/npm/v/@oiij/three-js)](https://www.npmjs.com/package/@oiij/three-js)
[![MIT-license](https://img.shields.io/npm/l/@oiij/three-js)](https://github.com/oiij/use/blob/main/packages/three-js/LICENSE)

## 简介

Use ThreeJs 是基于 Three.js 的 Vue 3 组合式函数封装，提供便捷的 3D 图形渲染功能，帮助开发者在应用中创建高性能的 3D 场景和动画效果。

## 特点

### 🎮 3D 渲染

- 🔗 提供简洁的 Three.js 集成接口
- 🎛️ 内置 OrbitControls 轨道控制器
- 🌑 支持阴影渲染

### 🔄 响应式设计

- 📐 自动响应容器尺寸变化
- ⏱️ 支持防抖 resize
- 🔄 自动管理渲染循环

### 🛠️ 丰富的工具库

- 💡 提供常用灯光工具函数
- 📐 提供常用辅助工具函数
- 📦 提供模型加载器封装

### 🔌 插件系统

- ⚙️ 支持物理引擎（Cannon.js）
- ✨ 支持后处理效果（Postprocessing）
- 🎬 支持动画补间（Tween.js）
- 🎚️ 支持调试面板（Tweakpane）

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/three-js

# 使用 npm
npm install @oiij/three-js

# 使用 yarn
yarn add @oiij/three-js
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `three`: ^0.160.0

## 示例

### 基础使用

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import { useTemplateRef } from 'vue'

const { scene, onLoop } = useThreeJs(useTemplateRef('canvas'))

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshStandardMaterial({ color: 0x00FF00 })
const cube = new Mesh(geometry, material)
scene.add(cube)

onLoop(() => {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 使用工具函数

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { useAmbientLight, useAxesHelper, useDirectionalLight, useGridHelper } from '@oiij/three-js/utils'
import { useTemplateRef } from 'vue'

const { ambientLight } = useAmbientLight()
const { directionalLight } = useDirectionalLight()
const { gridHelper } = useGridHelper()
const { axesHelper } = useAxesHelper()

const { scene, onLoop } = useThreeJs(useTemplateRef('canvas'), {
  lights: [ambientLight, directionalLight],
  helpers: [axesHelper, gridHelper]
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 加载模型

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { useLoader } from '@oiij/three-js/utils'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useTemplateRef } from 'vue'

const { scene } = useThreeJs(useTemplateRef('canvas'))
const { onLoad } = useLoader(GLTFLoader, '/model.gltf')

onLoad((gltf) => {
  scene.add(gltf.scene)
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

## API

### `useThreeJs(templateRef, options?)`

使用 Three.js 创建 3D 场景。

#### 参数

| 参数          | 类型                       | 说明                    |
| ------------- | -------------------------- | ----------------------- |
| `templateRef` | `TemplateRef<HTMLElement>` | Three.js 容器的模板引用 |
| `options`     | `ThreeJsOptions`           | Three.js 配置选项       |

#### ThreeJsOptions

| 选项                     | 类型                       | 默认值      | 说明                 |
| ------------------------ | -------------------------- | ----------- | -------------------- |
| `rendererOptions`        | `WebGLRendererParameters`  | -           | 渲染器选项           |
| `cameraOptions`          | `object`                   | -           | 相机选项             |
| `cameraOptions.fov`      | `number`                   | `50`        | 视野角度             |
| `cameraOptions.aspect`   | `number`                   | `1`         | 宽高比               |
| `cameraOptions.near`     | `number`                   | `0.1`       | 近截面               |
| `cameraOptions.far`      | `number`                   | `2000`      | 远截面               |
| `cameraOptions.position` | `[number, number, number]` | `[0, 1, 3]` | 相机位置             |
| `cameraOptions.lookAt`   | `[number, number, number]` | `[0, 0, 0]` | 相机看向的点         |
| `disableRender`          | `boolean`                  | `false`     | 是否禁用渲染         |
| `lights`                 | `Light[]`                  | `[]`        | 光源数组             |
| `helpers`                | `Object3D[]`               | `[]`        | 辅助对象数组         |
| `manual`                 | `boolean`                  | `false`     | 是否手动控制渲染循环 |

#### 返回值

| 属性                                      | 类型                       | 说明               |
| ----------------------------------------- | -------------------------- | ------------------ |
| `templateRef`                             | `TemplateRef<HTMLElement>` | 容器引用           |
| `renderer`                                | `WebGLRenderer`            | WebGL 渲染器       |
| `scene`                                   | `Scene`                    | Three.js 场景      |
| `camera`                                  | `PerspectiveCamera`        | 透视相机           |
| `controls`                                | `OrbitControls`            | 轨道控制器         |
| `clock`                                   | `Clock`                    | 时钟               |
| `pause()`                                 | `Function`                 | 暂停渲染循环       |
| `resume()`                                | `Function`                 | 恢复渲染循环       |
| `dispose()`                               | `Function`                 | 销毁实例           |
| `isActive`                                | `Ref<boolean>`             | 渲染循环是否激活   |
| `onRendered(callback)`                    | `Function`                 | 渲染完成事件       |
| `onResize(callback)`                      | `Function`                 | 尺寸变化事件       |
| `onDestroy(callback)`                     | `Function`                 | 销毁事件           |
| `onBeforeLoop(callback)`                  | `Function`                 | 渲染循环前事件     |
| `onLoop(callback)`                        | `Function`                 | 渲染循环事件       |
| `onAfterLoop(callback)`                   | `Function`                 | 渲染循环后事件     |
| `onClick(callback)`                       | `Function`                 | 点击事件           |
| `onDoubleClick(callback)`                 | `Function`                 | 双击事件           |
| `onContextMenu(callback)`                 | `Function`                 | 右键菜单事件       |
| `onIntersectObject(obj, event, callback)` | `Function`                 | 检测鼠标与对象相交 |

## 工具函数

### 灯光工具

```ts
import { useAmbientLight, useDirectionalLight, usePointLight } from '@oiij/three-js/utils'

const { ambientLight } = useAmbientLight({ color: 0xFFFFFF, intensity: 0.5 })
const { directionalLight } = useDirectionalLight({ color: 0xFFFFFF, intensity: 1 })
const { pointLight } = usePointLight({ color: 0xFFFFFF, intensity: 1 })
```

### 辅助工具

```ts
import { useAxesHelper, useBoxHelper, useGridHelper } from '@oiij/three-js/utils'

const { gridHelper } = useGridHelper({ size: 10, divisions: 10 })
const { axesHelper } = useAxesHelper({ size: 5 })
const { boxHelper } = useBoxHelper(object, { color: 0xFFFF00 })
```

### 加载器

```ts
import { useLoader, useLoadingManager } from '@oiij/three-js/utils'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const { onLoad, onProgress, onError } = useLoader(GLTFLoader, '/model.gltf')

onLoad((gltf) => {
  console.log('模型加载完成', gltf)
})
```

## 插件

### 物理引擎插件

```ts
import { useCannon } from '@oiij/three-js/plugins'
```

### 后处理插件

```ts
import { usePostprocessing } from '@oiij/three-js/plugins'
```

### 动画补间插件

```ts
import { useTween } from '@oiij/three-js/plugins'
```

### 调试面板插件

```ts
import { usePane } from '@oiij/three-js/plugins'
```

## 类型定义

```ts
import type { TemplateRef } from 'vue'

export type ThreeJsOptions = {
  rendererOptions?: WebGLRendererParameters
  cameraOptions?: {
    fov?: number
    aspect?: number
    near?: number
    far?: number
    position?: [number, number, number]
    lookAt?: [number, number, number]
  }
  disableRender?: boolean
  lights?: Light[]
  helpers?: Object3D[]
  manual?: boolean
}

export type UseThreeJsReturns = {
  templateRef: TemplateRef<HTMLElement>
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  controls: OrbitControls
  clock: Clock
  pause: () => void
  resume: () => void
  dispose: () => void
  isActive: Ref<boolean>
  onRendered: (callback: (renderer: WebGLRenderer) => void) => void
  onResize: (callback: (args: ResizeArguments) => void) => void
  onDestroy: (callback: () => void) => void
  onLoop: (callback: (renderer: WebGLRenderer, event: LoopEvent) => void) => void
  onClick: (callback: (event: MouseEvent) => void) => void
}

export declare function useThreeJs(templateRef: TemplateRef<HTMLElement>, options?: ThreeJsOptions): UseThreeJsReturns
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/three-js/three-js)
