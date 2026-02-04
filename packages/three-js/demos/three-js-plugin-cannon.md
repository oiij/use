# UseThreeJs

## 功能描述

**UseThreeJs** 是一个功能强大的 Three.js 集成库，提供了完整的 3D 场景管理能力，包括渲染器设置、相机控制、场景管理、物理引擎集成等特性。它基于 Three.js 和 Cannon.js 实现，为 Vue 应用提供了流畅的 3D 物理模拟体验。

## 安装

```bash
# 使用 npm
npm install @oiij/three-js

# 使用 yarn
yarn add @oiij/three-js

# 使用 pnpm
pnpm add @oiij/three-js
```

## 基本使用

<!-- <demo vue="./three-js-plugin-cannon.vue" title="UseThreeJs Cannon" /> -->

## API

### 函数签名

```ts
declare function useCannonPhysics(options?: CannonPhysicsOptions): UseCannonPhysicsReturns
```

## 类型定义

```ts
export type CannonPhysicsOptions = {
  gravity?: Vec3
  broadphase?: Broadphase
  solver?: Solver
  tolerance?: number
  quatNormalizeFast?: boolean
  quatNormalizeSkip?: number
  allowSleep?: boolean
  sleepSpeedLimit?: number
  sleepTimeLimit?: number
  defaultContactMaterial?: ContactMaterial
  contacts?: ContactMaterial[]
  collisionFilterGroups?: number
  collisionFilterMask?: number
}

export type UseCannonPhysicsReturns = {
  world: World
  addBody: (body: Body) => void
  removeBody: (body: Body) => void
  update: (delta: number) => void
  dispose: () => void
}
```
