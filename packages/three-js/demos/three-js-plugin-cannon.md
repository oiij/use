# UseCannonPhysics

## 功能描述

**UseCannonPhysics** 是一个基于 Cannon.js 的物理引擎插件，提供了完整的物理模拟能力，包括刚体管理、碰撞检测、重力模拟等特性。它与 Three.js 无缝集成，为 Vue 应用提供了流畅的 3D 物理模拟体验。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/three-js cannon-es

# 使用 npm
npm install @oiij/three-js cannon-es

# 使用 yarn
yarn add @oiij/three-js cannon-es
```

## 依赖

- `vue`: ^3.0.0
- `three`: ^0.160.0
- `cannon-es`: ^0.20.0

## 基本使用

<!-- <demo vue="./three-js-plugin-cannon.vue" title="UseCannonPhysics" /> -->

## API

### `useCannonPhysics(options?)`

创建物理世界。

#### 参数

| 参数      | 类型                   | 说明             |
| --------- | ---------------------- | ---------------- |
| `options` | `CannonPhysicsOptions` | 物理世界配置选项 |

#### CannonPhysicsOptions

| 选项                | 类型         | 默认值                  | 说明                 |
| ------------------- | ------------ | ----------------------- | -------------------- |
| `gravity`           | `Vec3`       | `new Vec3(0, -9.82, 0)` | 重力向量             |
| `broadphase`        | `Broadphase` | `NaiveBroadphase`       | 碰撞检测算法         |
| `solver`            | `Solver`     | `GSSolver`              | 约束求解器           |
| `tolerance`         | `number`     | `0.0001`                | 求解器容差           |
| `quatNormalizeFast` | `boolean`    | `false`                 | 快速四元数归一化     |
| `quatNormalizeSkip` | `number`     | `0`                     | 四元数归一化跳过次数 |
| `allowSleep`        | `boolean`    | `true`                  | 允许休眠             |
| `sleepSpeedLimit`   | `number`     | `0.1`                   | 休眠速度限制         |
| `sleepTimeLimit`    | `number`     | `1`                     | 休眠时间限制         |

#### 返回值

| 属性               | 类型       | 说明                   |
| ------------------ | ---------- | ---------------------- |
| `world`            | `World`    | Cannon.js 物理世界实例 |
| `addBody(body)`    | `Function` | 添加刚体               |
| `removeBody(body)` | `Function` | 移除刚体               |
| `update(delta)`    | `Function` | 更新物理世界           |
| `dispose()`        | `Function` | 销毁物理世界           |

## 类型定义

```ts
import type { Body, Broadphase, ContactMaterial, Solver, Vec3, World } from 'cannon-es'

export type CannonPhysicsOptions = {
  /**
   * 重力向量
   * @default new Vec3(0, -9.82, 0)
   */
  gravity?: Vec3
  /**
   * 碰撞检测算法
   * @default NaiveBroadphase
   */
  broadphase?: Broadphase
  /**
   * 约束求解器
   * @default GSSolver
   */
  solver?: Solver
  /**
   * 求解器容差
   * @default 0.0001
   */
  tolerance?: number
  /**
   * 快速四元数归一化
   * @default false
   */
  quatNormalizeFast?: boolean
  /**
   * 四元数归一化跳过次数
   * @default 0
   */
  quatNormalizeSkip?: number
  /**
   * 允许休眠
   * @default true
   */
  allowSleep?: boolean
  /**
   * 休眠速度限制
   * @default 0.1
   */
  sleepSpeedLimit?: number
  /**
   * 休眠时间限制
   * @default 1
   */
  sleepTimeLimit?: number
  /**
   * 默认接触材质
   */
  defaultContactMaterial?: ContactMaterial
  /**
   * 接触材质数组
   */
  contacts?: ContactMaterial[]
}

export type UseCannonPhysicsReturns = {
  /**
   * Cannon.js 物理世界实例
   */
  world: World
  /**
   * 添加刚体
   */
  addBody: (body: Body) => void
  /**
   * 移除刚体
   */
  removeBody: (body: Body) => void
  /**
   * 更新物理世界
   */
  update: (delta: number) => void
  /**
   * 销毁物理世界
   */
  dispose: () => void
}

export declare function useCannonPhysics(options?: CannonPhysicsOptions): UseCannonPhysicsReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useThreeJs } from '@oiij/three-js'
import { useCannonPhysics } from '@oiij/three-js/plugins'
import { Body, Box, Sphere, Vec3 } from 'cannon-es'
import { BoxGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import { useTemplateRef } from 'vue'

const { scene, onLoop } = useThreeJs(useTemplateRef('canvas'))
const { world, addBody, update } = useCannonPhysics()

// 创建地面
const groundBody = new Body({ mass: 0, shape: new Box(new Vec3(5, 0.1, 5)) })
groundBody.position.set(0, -0.1, 0)
addBody(groundBody)

const groundMesh = new Mesh(
  new BoxGeometry(10, 0.2, 10),
  new MeshStandardMaterial({ color: 0x808080 })
)
groundMesh.position.copy(groundBody.position)
scene.add(groundMesh)

// 创建球体
const sphereBody = new Body({ mass: 1, shape: new Sphere(0.5) })
sphereBody.position.set(0, 5, 0)
addBody(sphereBody)

const sphereMesh = new Mesh(
  new SphereGeometry(0.5),
  new MeshStandardMaterial({ color: 0xFF0000 })
)
scene.add(sphereMesh)

onLoop(({ clock }) => {
  update(clock.getDelta())
  sphereMesh.position.copy(sphereBody.position)
  sphereMesh.quaternion.copy(sphereBody.quaternion)
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```
