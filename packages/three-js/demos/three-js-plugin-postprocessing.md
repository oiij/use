# UseThreeJs

## 功能描述

**UseThreeJs** 是一个功能强大的 Three.js 集成库，提供了完整的后期处理能力，包括渲染通道管理、效果组合、抗锯齿、轮廓效果、 bloom 效果等特性。它基于 Three.js 和 postprocessing 库实现，为 Vue 应用提供了高质量的 3D 视觉效果。

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

<demo vue="./three-js-plugin-postprocessing.vue" title="UseThreeJs Postprocessing" />

## API

### 函数签名

```ts
declare function usePostprocessing(renderer: WebGLRenderer, scene: Scene, camera: Camera, options?: EffectComposerOptions): UsePostprocessingReturns
declare function useCopyPass(): UseCopyPassReturns
declare function useSmaaEffectPass(camera: Camera, options?: SMAAEffectOptions): UseSmaaEffectPassReturns
declare function useOutlinePass(scene: Scene, camera: Camera, options?: OutlineEffectOptions): UseOutlinePassReturns
declare function useSelectiveBloomPass(scene: Scene, camera: Camera, options?: BloomEffectOptions): UseSelectiveBloomPassReturns
```

## 类型定义

```ts
export type EffectComposerOptions = {
  depthBuffer?: boolean
  stencilBuffer?: boolean
  alpha?: boolean
  multisampling?: number
  frameBufferType?: number
  passes?: Pass[] | ((renderer: WebGLRenderer, scene: Scene, camera: Camera) => Pass)[]
  overrideMaterial?: Material
}

export type UsePostprocessingReturns = {
  composer: EffectComposer
  renderPass: RenderPass
  dispose: () => void
  resize: ({
    width,
    height
  }: {
    width: number
    height: number
  }) => void
}

export type UseCopyPassReturns = {
  copyPass: ShaderPass
  dispose: () => void
}

export type SMAAEffectOptions = {
  smaa?: {
    preset?: SMAAPreset
    edgeDetectionMode?: EdgeDetectionMode
    predicationMode?: PredicationMode
  }
  texture?: {
    blendFunction?: BlendFunction
    texture?: Texture
    aspectCorrection?: boolean
  }
}

export type UseSmaaEffectPassReturns = {
  smaaEffect: SMAAEffect
  edgesTextureEffect: TextureEffect
  weightsTextureEffect: TextureEffect
  smaaEffectPass: EffectPass
  dispose: () => void
}

export type OutlineEffectOptions = {
  blendFunction?: BlendFunction
  patternTexture?: Texture
  patternScale?: number
  edgeStrength?: number
  pulseSpeed?: number
  visibleEdgeColor?: number
  hiddenEdgeColor?: number
  multisampling?: number
  resolutionScale?: number
  resolutionX?: number
  resolutionY?: number
  width?: number
  height?: number
  kernelSize?: KernelSize
  blur?: boolean
  xRay?: boolean
}

export type UseOutlinePassReturns = {
  outlineEffect: OutlineEffect
  outlinePass: EffectPass
  selection: postprocessing20.Selection
  dispose: () => void
}

export type UseSelectiveBloomPassReturns = {
  selectiveBloomEffect: SelectiveBloomEffect
  selection: postprocessing20.Selection
  selectiveBloomEffectPass: EffectPass
  dispose: () => void
}
```
