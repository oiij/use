# UseThreeJs

官方文档 [ThreeJs](https://threejs.org/) [Tweakpane](https://tweakpane.github.io/docs/v3/)

## 安装

```bash
pnpm add @oiij/three-js
```

## 示例

<demo vue="./demos/three-js.vue"  />

## Types

```ts
interface ThreeJsOptions {
  renderer?: WebGLRendererParameters
  camera?: {
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
}
interface LoopEvent {
  clock: Clock
  delta: number
  elapsed: number
}
declare function useThreeJs(options?: ThreeJsOptions): {
  domRef: vue0.Ref<HTMLElement | undefined, HTMLElement | undefined>
  renderer: WebGLRenderer
  scene: Scene
  camera: PerspectiveCamera
  controls: OrbitControls
  clock: Clock
  pause: _vueuse_core1.Fn
  resume: _vueuse_core1.Fn
  isActive: Readonly<vue0.ShallowRef<boolean>>
  dispose: () => void
  onIntersectObject: (obj: Object3D | Object3D[], event: PointerEvent | MouseEvent, callback?: (obj: Object3D[]) => void) => boolean
  onRendered: _vueuse_core1.EventHookOn<WebGLRenderer>
  onResize: _vueuse_core1.EventHookOn<{
    width: number
    height: number
    aspect: number
    pixelRatio: number
  }>
  onDestroy: _vueuse_core1.EventHookOn<[]>
  onBeforeLoop: _vueuse_core1.EventHookOn<LoopEvent>
  onLoop: _vueuse_core1.EventHookOn<LoopEvent>
  onAfterLoop: _vueuse_core1.EventHookOn<LoopEvent>
  onPointerDown: _vueuse_core1.EventHookOn<[PointerEvent]>
  onPointerUp: _vueuse_core1.EventHookOn<[PointerEvent]>
  onPointerMove: _vueuse_core1.EventHookOn<[PointerEvent]>
  onPointerEnter: _vueuse_core1.EventHookOn<[PointerEvent]>
  onPointerLeave: _vueuse_core1.EventHookOn<[PointerEvent]>
  onPointerOut: _vueuse_core1.EventHookOn<[PointerEvent]>
  onPointerOver: _vueuse_core1.EventHookOn<[PointerEvent]>
  onClick: _vueuse_core1.EventHookOn<[MouseEvent]>
  onDoubleClick: _vueuse_core1.EventHookOn<[MouseEvent]>
  onContextMenu: _vueuse_core1.EventHookOn<[MouseEvent]>
}
type UseThreeJsReturns = ReturnType<typeof useThreeJs>
```
