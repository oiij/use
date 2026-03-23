# UseThreeJs

## 功能描述

**UseThreeJs** 是一个功能强大的 Three.js 集成库，提供了完整的 3D 场景管理能力，包括渲染器设置、相机控制、场景管理、动画循环、事件系统等特性。它基于 Three.js 和 OrbitControls 实现，为 Vue 应用提供了流畅的 3D 交互体验。

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

## 基本使用

<demo vue="./three-js.vue" title="UseThreeJs" />

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

| 属性                   | 类型                       | 说明             |
| ---------------------- | -------------------------- | ---------------- |
| `templateRef`          | `TemplateRef<HTMLElement>` | 容器引用         |
| `renderer`             | `WebGLRenderer`            | WebGL 渲染器     |
| `scene`                | `Scene`                    | Three.js 场景    |
| `camera`               | `PerspectiveCamera`        | 透视相机         |
| `controls`             | `OrbitControls`            | 轨道控制器       |
| `clock`                | `Clock`                    | 时钟             |
| `pause()`              | `Function`                 | 暂停渲染循环     |
| `resume()`             | `Function`                 | 恢复渲染循环     |
| `dispose()`            | `Function`                 | 销毁实例         |
| `isActive`             | `Ref<boolean>`             | 渲染循环是否激活 |
| `onRendered(callback)` | `Function`                 | 渲染完成事件     |
| `onResize(callback)`   | `Function`                 | 尺寸变化事件     |
| `onDestroy(callback)`  | `Function`                 | 销毁事件         |
| `onLoop(callback)`     | `Function`                 | 渲染循环事件     |
| `onClick(callback)`    | `Function`                 | 点击事件         |

## 类型定义

```ts
export type ThreeJsOptions = {
  /**
   * 渲染器选项
   */
  rendererOptions?: WebGLRendererParameters
  /**
   * 相机选项
   */
  cameraOptions?: {
    /**
     * 视野角度
     * @default 50
     */
    fov?: number
    /**
     * 宽高比
     * @default 1
     */
    aspect?: number
    /**
     * 近截面
     * @default 0.1
     */
    near?: number
    /**
     * 远截面
     * @default 2000
     */
    far?: number
    /**
     * 相机位置
     * @default [0, 1, 3]
     */
    position?: [number, number, number]
    /**
     * 相机看向的点
     * @default [0, 0, 0]
     */
    lookAt?: [number, number, number]
  }
  /**
   * 是否禁用渲染
   * @default false
   */
  disableRender?: boolean
  /**
   * 光源数组
   */
  lights?: Light[]
  /**
   * 辅助对象数组
   */
  helpers?: Object3D[]
  /**
   * 是否手动控制
   * @default false
   */
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

## 使用示例

### 基础用法

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
import { useAmbientLight, useDirectionalLight, useGridHelper } from '@oiij/three-js/utils'
import { useTemplateRef } from 'vue'

const { ambientLight } = useAmbientLight()
const { directionalLight } = useDirectionalLight()
const { gridHelper } = useGridHelper()

const { scene, onLoop } = useThreeJs(useTemplateRef('canvas'), {
  lights: [ambientLight, directionalLight],
  helpers: [gridHelper]
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 加载 GLTF 模型

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

### 使用调试面板

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { usePane } from '@oiij/three-js/plugins'
import { useTemplateRef } from 'vue'

const { pane, fpsGraph } = usePane()
const { scene, onBeforeLoop, onAfterLoop } = useThreeJs(useTemplateRef('canvas'))

pane.addBinding(scene, 'background', { label: '背景颜色' })

onBeforeLoop(() => fpsGraph.begin())
onAfterLoop(() => fpsGraph.end())
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```
