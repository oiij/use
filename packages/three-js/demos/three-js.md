# UseThreeJs

## 功能描述

**UseThreeJs** 是一个功能强大的 Three.js 集成库，提供了完整的 3D 场景管理能力，包括渲染器设置、相机控制、场景管理、动画循环、事件系统等特性。它基于 Three.js 和 OrbitControls 实现，为 Vue 应用提供了流畅的 3D 交互体验。

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

<demo vue="./three-js.vue" title="UseThreeJs" />

## API

### 函数签名

```ts
declare function useThreeJs(templateRef: TemplateRef<HTMLElement>, options?: ThreeJsOptions): UseThreeJsReturns
```

## 类型定义

```ts
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

export type LoopEvent = {
  clock: Clock
  delta: number
  elapsed: number
}

export type ResizeArguments = {
  width: number
  height: number
  aspect: number
  dpr: number
}

export type UseThreeJsReturns = {
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  renderer: WebGLRenderer
  scene: Scene<three0.Object3DEventMap>
  camera: PerspectiveCamera
  controls: OrbitControls
  clock: Clock
  pause: _vueuse_core0.Fn
  resume: _vueuse_core0.Fn
  isActive: Readonly<vue0.ShallowRef<boolean>>
  dispose: () => void
  onIntersectObject: (obj: Object3D | Object3D[], event: PointerEvent | MouseEvent, callback?: (obj: Object3D[]) => void) => boolean
  onRendered: _vueuse_core0.EventHookOn<[WebGLRenderer]>
  onResize: _vueuse_core0.EventHookOn<[ResizeArguments]>
  onDestroy: _vueuse_core0.EventHookOn<[]>
  onBeforeLoop: _vueuse_core0.EventHookOn<[WebGLRenderer, LoopEvent, UseRafFnCallbackArguments]>
  onLoop: _vueuse_core0.EventHookOn<[WebGLRenderer, LoopEvent, UseRafFnCallbackArguments]>
  onAfterLoop: _vueuse_core0.EventHookOn<[WebGLRenderer, LoopEvent, UseRafFnCallbackArguments]>
  onClick: _vueuse_core0.EventHookOn<[MouseEvent]>
  onDoubleClick: _vueuse_core0.EventHookOn<[MouseEvent]>
  onContextMenu: _vueuse_core0.EventHookOn<[MouseEvent]>
}
```
