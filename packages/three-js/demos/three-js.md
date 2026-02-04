# UseThreeJs

官方文档 [ThreeJs](https://threejs.org/) [Tweakpane](https://tweakpane.github.io/docs/v3/)

## 安装

```bash
pnpm add @oiij/three-js
```

## 示例

<demo vue="./three-js.vue"  />

## Types

```ts
// #region src/index.d.ts
type ThreeJsOptions = {
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
type LoopEvent = {
  clock: Clock
  delta: number
  elapsed: number
}
type ResizeArguments = {
  width: number
  height: number
  aspect: number
  dpr: number
}
declare function useThreeJs(templateRef: TemplateRef<HTMLElement>, options?: ThreeJsOptions): {
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
type UseThreeJsReturns = ReturnType<typeof useThreeJs>
// #endregion
export { ThreeJsOptions, useThreeJs, UseThreeJsReturns }
```
