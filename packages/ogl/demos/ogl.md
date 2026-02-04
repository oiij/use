# UseOGL

[官方文档](https://github.com/oframe/ogl)

## 安装

```bash
pnpm add @oiij/ogl
```

## 示例

<demo vue="./ogl.vue" />

## Types

```ts
// #region src/index.d.ts
type OGLOptions = {
  rendererOptions?: RendererOptions
  cameraOptions?: CameraOptions & {
    position?: [number, number, number]
  }
  manual?: boolean
  disableRender?: boolean
}
type ResizeArguments = {
  width: number
  height: number
  aspect: number
  dpr: number
}
declare function useOGL(templateRef: TemplateRef<HTMLElement>, options?: OGLOptions): {
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  renderer: Renderer
  gl: ogl0.OGLRenderingContext
  camera: Camera
  scene: Transform
  onCreated: _vueuse_core0.EventHookOn<[Renderer]>
  onResize: _vueuse_core0.EventHookOn<[ResizeArguments]>
  onDisposed: _vueuse_core0.EventHookOn<[]>
  onLoop: _vueuse_core0.EventHookOn<[Renderer, UseRafFnCallbackArguments]>
  resume: _vueuse_core0.Fn
  pause: _vueuse_core0.Fn
  dispose: () => void
  isActive: Readonly<vue0.ShallowRef<boolean>>
}
// #endregion
export { OGLOptions, useOGL }
```
