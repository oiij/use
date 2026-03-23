# UseOGL

## 功能描述

**UseOGL** 是一个用于 OGL 3D 渲染的 Vue 组合式函数，支持自定义渲染器配置、相机设置和事件监听，可用于创建交互式 3D 图形应用。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/ogl

# 使用 npm
npm install @oiij/ogl

# 使用 yarn
yarn add @oiij/ogl
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `ogl`: ^1.0.0

## 基本使用

<demo vue="./ogl.vue" title="UseOGL" />

## API

### `useOGL(templateRef, options?)`

使用 OGL 创建 WebGL 渲染实例。

#### 参数

| 参数          | 类型                       | 说明               |
| ------------- | -------------------------- | ------------------ |
| `templateRef` | `TemplateRef<HTMLElement>` | OGL 容器的模板引用 |
| `options`     | `OGLOptions`               | OGL 配置选项       |

#### OGLOptions

| 选项                     | 类型                       | 默认值      | 说明                 |
| ------------------------ | -------------------------- | ----------- | -------------------- |
| `rendererOptions`        | `RendererOptions`          | -           | 渲染器选项           |
| `cameraOptions`          | `CameraOptions`            | -           | 相机选项             |
| `cameraOptions.position` | `[number, number, number]` | `[0, 0, 5]` | 相机位置             |
| `manual`                 | `boolean`                  | `false`     | 是否手动控制渲染循环 |
| `disableRender`          | `boolean`                  | `false`     | 是否禁用自动渲染     |

#### 返回值

| 属性                   | 类型                       | 说明             |
| ---------------------- | -------------------------- | ---------------- |
| `templateRef`          | `TemplateRef<HTMLElement>` | 容器引用         |
| `renderer`             | `Renderer`                 | OGL 渲染器实例   |
| `gl`                   | `WebGL2RenderingContext`   | WebGL 上下文     |
| `camera`               | `Camera`                   | OGL 相机实例     |
| `scene`                | `Transform`                | OGL 场景根节点   |
| `onRendered(callback)` | `Function`                 | 渲染完成事件     |
| `onResize(callback)`   | `Function`                 | 尺寸变化事件     |
| `onDisposed(callback)` | `Function`                 | 销毁事件         |
| `onLoop(callback)`     | `Function`                 | 渲染循环事件     |
| `resume()`             | `Function`                 | 恢复渲染循环     |
| `pause()`              | `Function`                 | 暂停渲染循环     |
| `dispose()`            | `Function`                 | 销毁实例         |
| `isActive`             | `Ref<boolean>`             | 渲染循环是否激活 |

## 类型定义

```ts
import type { CameraOptions, RendererOptions } from 'ogl'
import type { TemplateRef } from 'vue'

export type OGLOptions = {
  /**
   * 渲染器选项
   */
  rendererOptions?: RendererOptions
  /**
   * 相机选项
   */
  cameraOptions?: CameraOptions & {
    /**
     * 相机位置
     * @default [0, 0, 5]
     */
    position?: [number, number, number]
  }
  /**
   * 是否手动控制
   * @default false
   */
  manual?: boolean
  /**
   * 是否禁用渲染
   * @default false
   */
  disableRender?: boolean
}

export type ResizeArguments = {
  /**
   * 宽度
   */
  width: number
  /**
   * 高度
   */
  height: number
  /**
   * 宽高比
   */
  aspect: number
  /**
   * 设备像素比
   */
  dpr: number
}

export type UseOGLReturns = {
  templateRef: TemplateRef<HTMLElement>
  renderer: Renderer
  gl: WebGL2RenderingContext
  camera: Camera
  scene: Transform
  onRendered: (callback: (renderer: Renderer) => void) => void
  onResize: (callback: (args: ResizeArguments) => void) => void
  onDisposed: (callback: () => void) => void
  onLoop: (callback: (renderer: Renderer, args: UseRafFnCallbackArguments) => void) => void
  resume: () => void
  pause: () => void
  dispose: () => void
  isActive: Ref<boolean>
}

export declare function useOGL(templateRef: TemplateRef<HTMLElement>, options?: OGLOptions): UseOGLReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useOGL } from '@oiij/ogl'
import { useTemplateRef } from 'vue'

const { scene, gl, onLoop } = useOGL(useTemplateRef('canvas'))

onLoop(({ renderer }) => {
  // 在这里添加渲染逻辑
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 自定义着色器

```vue
<script setup>
import { useOGL } from '@oiij/ogl'
import { Geometry, Mesh, Program } from 'ogl'
import { useTemplateRef } from 'vue'

const { gl, onLoop } = useOGL(useTemplateRef('canvas'), {
  disableRender: true
})

const geometry = new Geometry(gl, {
  position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
  uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
})

const program = new Program(gl, {
  vertex: `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
  `,
  fragment: `
    precision highp float;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      gl_FragColor.rgb = vec3(0.8, 0.7, 1.0) + 0.3 * cos(vUv.xyx + uTime);
      gl_FragColor.a = 1.0;
    }
  `,
  uniforms: {
    uTime: { value: 0 },
  },
})

const mesh = new Mesh(gl, { geometry, program })

onLoop((renderer, { timestamp }) => {
  program.uniforms.uTime.value = timestamp * 0.001
  renderer.render({ scene: mesh })
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 自定义相机位置

```vue
<script setup>
import { useOGL } from '@oiij/ogl'
import { useTemplateRef } from 'vue'

const { camera, scene, onLoop } = useOGL(useTemplateRef('canvas'), {
  cameraOptions: {
    position: [0, 0, 10],
    fov: 45
  }
})

onLoop(({ renderer }) => {
  // 渲染逻辑
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```

### 手动控制渲染

```vue
<script setup>
import { useOGL } from '@oiij/ogl'
import { useTemplateRef } from 'vue'

const { resume, pause, isActive, dispose } = useOGL(useTemplateRef('canvas'), {
  manual: true
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
  <button @click="resume">
    开始渲染
  </button>
  <button @click="pause">
    暂停渲染
  </button>
  <button @click="dispose">
    销毁
  </button>
  <p>渲染状态: {{ isActive ? '运行中' : '已暂停' }}</p>
</template>
```

### 监听事件

```vue
<script setup>
import { useOGL } from '@oiij/ogl'
import { useTemplateRef } from 'vue'

const { onRendered, onResize, onDisposed } = useOGL(useTemplateRef('canvas'))

onRendered((renderer) => {
  console.log('渲染器已创建', renderer)
})

onResize(({ width, height, aspect }) => {
  console.log(`尺寸变化: ${width}x${height}, 宽高比: ${aspect}`)
})

onDisposed(() => {
  console.log('渲染器已销毁')
})
</script>

<template>
  <div ref="canvas" style="width: 100%; height: 400px;" />
</template>
```
