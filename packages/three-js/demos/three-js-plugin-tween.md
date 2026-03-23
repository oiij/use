# UseTween

## 功能描述

**UseTween** 是一个基于 Tween.js 的动画补间插件，提供了完整的动画控制能力，包括属性补间、相机动画、对象跟踪等特性。它与 Three.js 无缝集成，为 Vue 应用提供了流畅的 3D 动画效果。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/three-js @tweenjs/tween.js

# 使用 npm
npm install @oiij/three-js @tweenjs/tween.js

# 使用 yarn
yarn add @oiij/three-js @tweenjs/tween.js
```

## 依赖

- `vue`: ^3.0.0
- `three`: ^0.160.0
- `@tweenjs/tween.js`: ^21.0.0

## 基本使用

<demo vue="./three-js-plugin-tween.vue" title="UseTween" />

## API

### `useTween()`

创建 Tween 动画管理器。

#### 返回值

| 属性                                              | 类型       | 说明         |
| ------------------------------------------------- | ---------- | ------------ |
| `tweenGroup`                                      | `Group`    | Tween 动画组 |
| `update(time?)`                                   | `Function` | 更新所有动画 |
| `createTween(from)`                               | `Function` | 创建补间动画 |
| `cameraTween(camera, controls, target, options?)` | `Function` | 相机动画     |
| `lookAtObject(camera, controls, obj, scalar?)`    | `Function` | 相机看向对象 |
| `dispose()`                                       | `Function` | 销毁所有动画 |

### `createTween(from)`

创建补间动画。

#### 参数

| 参数   | 类型 | 说明     |
| ------ | ---- | -------- |
| `from` | `T`  | 起始对象 |

#### 返回值

| 类型       | 说明           |
| ---------- | -------------- |
| `Tween<T>` | Tween 动画实例 |

### `cameraTween(camera, controls, target, options?)`

创建相机动画。

#### 参数

| 参数             | 类型                 | 说明              |
| ---------------- | -------------------- | ----------------- |
| `camera`         | `Camera`             | Three.js 相机     |
| `controls`       | `OrbitControls`      | 轨道控制器        |
| `target`         | `object`             | 目标位置和看向点  |
| `target.x`       | `number`             | 相机目标 X 坐标   |
| `target.y`       | `number`             | 相机目标 Y 坐标   |
| `target.z`       | `number`             | 相机目标 Z 坐标   |
| `target.targetX` | `number`             | 看向点目标 X 坐标 |
| `target.targetY` | `number`             | 看向点目标 Y 坐标 |
| `target.targetZ` | `number`             | 看向点目标 Z 坐标 |
| `options`        | `CameraTweenOptions` | 动画配置选项      |

#### CameraTweenOptions

| 选项       | 类型             | 默认值               | 说明                 |
| ---------- | ---------------- | -------------------- | -------------------- |
| `duration` | `number`         | `1000`               | 动画持续时间（毫秒） |
| `easing`   | `EasingFunction` | `Easing.Linear.None` | 缓动函数             |

### `lookAtObject(camera, controls, obj, scalar?)`

创建相机看向对象的动画。

#### 参数

| 参数       | 类型            | 默认值 | 说明               |
| ---------- | --------------- | ------ | ------------------ |
| `camera`   | `Camera`        | -      | Three.js 相机      |
| `controls` | `OrbitControls` | -      | 轨道控制器         |
| `obj`      | `Object3D`      | -      | 目标对象           |
| `scalar`   | `number`        | `3`    | 相机距离对象的倍数 |

## 类型定义

```ts
import type { Group, Tween } from '@tweenjs/tween.js'
import type { EasingFunction } from '@tweenjs/tween.js/dist/tween.cjs'
import type { Camera, Object3D } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export type CameraTweenOptions = {
  /**
   * 动画持续时间（毫秒）
   * @default 1000
   */
  duration?: number
  /**
   * 缓动函数
   * @default Easing.Linear.None
   */
  easing?: EasingFunction
}

export type UseTweenReturns = {
  /**
   * Tween 动画组
   */
  tweenGroup: Group
  /**
   * 更新所有动画
   */
  update: (time?: number) => void
  /**
   * 创建补间动画
   */
  createTween: <T extends Record<string, any>>(from: T) => Tween<T>
  /**
   * 相机动画
   */
  cameraTween: (
    camera: Camera,
    controls: OrbitControls,
    target: {
      x: number
      y: number
      z: number
      targetX: number
      targetY: number
      targetZ: number
    },
    options?: CameraTweenOptions
  ) => Tween<{ x: number, y: number, z: number, targetX: number, targetY: number, targetZ: number }>
  /**
   * 相机看向对象
   */
  lookAtObject: (
    camera: Camera,
    controls: OrbitControls,
    obj: Object3D,
    scalar?: number
  ) => Tween<{ x: number, y: number, z: number, targetX: number, targetY: number, targetZ: number }>
  /**
   * 销毁所有动画
   */
  dispose: () => void
}

export declare function useTween(): UseTweenReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { useTween } from '@oiij/three-js/plugins'
import { Easing } from '@tweenjs/tween.js'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import { useTemplateRef } from 'vue'

const { scene, controls, camera, onBeforeLoop, onDoubleClick, onIntersectObject } = useThreeJs(useTemplateRef('canvas'))
const { lookAtObject, update } = useTween()

const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshStandardMaterial({ color: 0x00FF00 })
)
scene.add(cube)

onBeforeLoop(() => {
  update()
})

onDoubleClick((event) => {
  onIntersectObject([cube], event, (intersects) => {
    lookAtObject(camera, controls, intersects[0])
  })
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 自定义属性动画

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { useTween } from '@oiij/three-js/plugins'
import { Easing } from '@tweenjs/tween.js'
import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import { useTemplateRef } from 'vue'

const { scene, onBeforeLoop } = useThreeJs(useTemplateRef('canvas'))
const { createTween, update } = useTween()

const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshStandardMaterial({ color: 0x00FF00 })
)
scene.add(cube)

// 创建位置动画
const positionTween = createTween({ x: 0, y: 0, z: 0 })
  .to({ x: 2, y: 2, z: 0 }, 1000)
  .easing(Easing.Bounce.Out)
  .onUpdate(({ x, y, z }) => {
    cube.position.set(x, y, z)
  })
  .repeat(Infinity)
  .yoyo(true)
  .start()

onBeforeLoop(() => {
  update()
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 相机飞行动画

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { useTween } from '@oiij/three-js/plugins'
import { useTemplateRef } from 'vue'

const { scene, camera, controls, onBeforeLoop } = useThreeJs(useTemplateRef('canvas'))
const { cameraTween, update } = useTween()

onBeforeLoop(() => {
  update()
})

// 飞向目标位置
function flyTo(x, y, z, targetX, targetY, targetZ) {
  cameraTween(camera, controls, {
    x,
    y,
    z,
    targetX,
    targetY,
    targetZ
  }, {
    duration: 2000
  }).start()
}
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
  <button @click="flyTo(5, 5, 5, 0, 0, 0)">
    飞向位置
  </button>
</template>
```
