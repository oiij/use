# UseThreeJs

官方文档 [ThreeJs](https://threejs.org/) [postprocessing](https://github.com/pmndrs/postprocessing)

## 安装

```bash
pnpm add @oiij/three-js
```

## 示例

### Base

<demo vue="./demos/three-js-plugin-postprocessing.vue"  />

## Types

```ts
declare const RendererOptions: WebGLRendererParameters
interface EffectComposerOptions {
  depthBuffer?: boolean
  stencilBuffer?: boolean
  alpha?: boolean
  multisampling?: number
  frameBufferType?: number
  passes?: Pass[] | ((renderer: WebGLRenderer, scene: Scene, camera: Camera) => Pass)[]
  overrideMaterial?: Material
}
declare function usePostprocessing(renderer: WebGLRenderer, scene: Scene, camera: Camera, options?: EffectComposerOptions): {
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
declare function useCopyPass(): {
  copyPass: ShaderPass
  dispose: () => void
}
interface SMAAEffectOptions {
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
declare function useSmaaEffectPass(camera: Camera, options?: SMAAEffectOptions): {
  smaaEffect: SMAAEffect
  edgesTextureEffect: TextureEffect
  weightsTextureEffect: TextureEffect
  smaaEffectPass: EffectPass
  dispose: () => void
}
interface OutlineEffectOptions {
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
declare function useOutlinePass(scene: Scene, camera: Camera, options?: OutlineEffectOptions): {
  outlineEffect: OutlineEffect
  outlinePass: EffectPass
  selection: postprocessing20.Selection
  dispose: () => void
}
declare function useSelectiveBloomPass(scene: Scene, camera: Camera, options?: BloomEffectOptions): {
  selectiveBloomEffect: SelectiveBloomEffect
  selection: postprocessing20.Selection
  selectiveBloomEffectPass: EffectPass
  dispose: () => void
}
```
