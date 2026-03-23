# @oiij/ogl

[![NPM version](https://img.shields.io/npm/v/@oiij/ogl)](https://www.npmjs.com/package/@oiij/ogl)
[![MIT-license](https://img.shields.io/npm/l/@oiij/ogl)](https://github.com/oiij/use/blob/main/packages/ogl/LICENSE)

## 简介

Use OGL 是基于 OGL 的 Vue 3 组合式函数封装，提供便捷的 WebGL 渲染功能，帮助开发者在应用中创建高性能的 3D 图形和动画效果。

## 特点

### 🎮 WebGL 渲染

- 🔗 提供简洁的 WebGL 接口
- ⚡ 高性能渲染引擎
- ✨ 支持多种 3D 特效

### 🔄 响应式设计

- 📐 自动响应容器尺寸变化
- ⏱️ 支持防抖 resize
- 🔄 自动管理渲染循环

### 📡 事件系统

- ✅ 渲染完成事件
- 📐 尺寸变化事件
- 🗑️ 销毁事件
- 🔁 渲染循环事件

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

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

## 示例

### 基础使用

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

### 响应式配置

```vue
<script setup>
import { useOGL } from '@oiij/ogl'
import { useTemplateRef } from 'vue'

const { renderer, camera, scene, onResize, onLoop } = useOGL(useTemplateRef('canvas'), {
  cameraOptions: {
    position: [0, 0, 5]
  }
})

onResize(({ width, height, aspect }) => {
  console.log(`尺寸变化: ${width}x${height}, 宽高比: ${aspect}`)
})

onLoop(({ renderer }) => {
  // 渲染逻辑
})
</script>
```

### 手动控制

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
  width: number
  height: number
  aspect: number
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

## 在线文档

[在线文档](https://oiij-use.vercel.app/ogl/ogl)
