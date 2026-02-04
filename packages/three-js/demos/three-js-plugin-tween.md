# UseThreeJs

## 功能描述

**UseThreeJs** 是一个功能强大的 Three.js 集成库，提供了完整的动画控制能力，包括属性补间、相机动画、对象跟踪等特性。它基于 Three.js 和 Tween.js 实现，为 Vue 应用提供了流畅的 3D 动画效果。

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

<demo vue="./three-js-plugin-tween.vue" title="UseThreeJs Tween" />

## API

### 函数签名

```ts
declare function useTween(): UseTweenReturns
```

## 类型定义

```ts
export type CameraTweenOptions = {
  duration?: number
  easing?: typeof Easing['Linear']['None']
}

export type UseTweenReturns = {
  tweenGroup: Group$1
  update: (time?: number) => void
  createTween: <T extends Record<string, any>>(from: T) => Tween<T>
  cameraTween: (camera: Camera, controls: OrbitControls, target: {
    x: number
    y: number
    z: number
    targetX: number
    targetY: number
    targetZ: number
  }, options?: CameraTweenOptions) => Tween<{ x: number, y: number, z: number, targetX: number, targetY: number, targetZ: number }>
  lookAtObject: (camera: Camera, controls: OrbitControls, obj: Object3D, scalar?: number) => Tween<{
    x: number
    y: number
    z: number
    targetX: number
    targetY: number
    targetZ: number
  }>
  dispose: () => void
}
```
