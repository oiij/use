# UseOGL

## 功能描述

**UseOGL** 是一个用于 OGL 3D 渲染的 Vue 组合式函数，支持自定义渲染器配置、相机设置和事件监听，可用于创建交互式 3D 图形应用。

## 安装

```bash
# 使用 npm
npm install @oiij/ogl

# 使用 yarn
yarn add @oiij/ogl

# 使用 pnpm
pnpm add @oiij/ogl
```

## 基本使用

<demo vue="./ogl.vue" title="UseOGL" />

## API

### 函数签名

```ts
declare function useOGL(templateRef: TemplateRef<HTMLElement>, options?: OGLOptions): UseOGLReturns
```

## 类型定义

```ts
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
export type UseOGLReturns = {
  templateRef: Readonly<ShallowRef<HTMLElement | null>>
  renderer: Renderer
  gl: OGLRenderingContext
  camera: Camera
  scene: Transform
  onCreated: EventHookOn<[Renderer]>
  onResize: EventHookOn<[ResizeArguments]>
  onDisposed: EventHookOn<[]>
  onLoop: EventHookOn<[Renderer, UseRafFnCallbackArguments]>
  resume: Fn
  pause: Fn
  dispose: () => void
  isActive: Readonly<ShallowRef<boolean>>
}
declare function useOGL(templateRef: TemplateRef<HTMLElement>, options?: OGLOptions): UseOGLReturns
```
