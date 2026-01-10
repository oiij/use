import type { BloomEffectOptions, KernelSize, Pass } from 'postprocessing'
import type { Camera, Material, Scene, Texture, WebGLRenderer, WebGLRendererParameters } from 'three'
import { BlendFunction, CopyMaterial, EdgeDetectionMode, EffectComposer, EffectPass, OutlineEffect, PredicationMode, RenderPass, SelectiveBloomEffect, ShaderPass, SMAAEffect, SMAAPreset, TextureEffect } from 'postprocessing'
import { HalfFloatType } from 'three'
import { onUnmounted } from 'vue'

function useDisposable(disposeFn: () => void) {
  onUnmounted(() => disposeFn())
  return disposeFn
}
// 后期处理Renderer配置
export const RendererOptions: WebGLRendererParameters = {
  powerPreference: 'high-performance',
  antialias: false,
  stencil: false,
  depth: false,
}
type EffectComposerOptions = {
  depthBuffer?: boolean
  stencilBuffer?: boolean
  alpha?: boolean
  multisampling?: number
  frameBufferType?: number
  passes?: Pass[] | ((renderer: WebGLRenderer, scene: Scene, camera: Camera) => Pass)[]
  overrideMaterial?: Material
}
export function usePostprocessing(renderer: WebGLRenderer, scene: Scene, camera: Camera, options?: EffectComposerOptions) {
  const { passes, overrideMaterial, ...opt } = options ?? {}
  const composer = new EffectComposer(renderer, {
    frameBufferType: HalfFloatType,
    ...opt,
  })
  const renderPass = new RenderPass(scene, camera, overrideMaterial) // 渲染通道
  composer.addPass(renderPass)
  passes?.forEach(pass => composer.addPass(typeof pass === 'function' ? pass(renderer, scene, camera) : pass))

  function resize({ width, height }: { width: number, height: number }) {
    composer.setSize(width, height)
    composer.passes.forEach(pass => pass.setSize(width, height))
  }
  const dispose = useDisposable(() => {
    composer.passes.forEach(pass => pass.dispose())
    composer.dispose()
  })
  return {
    composer,
    renderPass,
    dispose,
    resize,
  }
}

export function useCopyPass() {
  const copyPass = new ShaderPass(new CopyMaterial())
  copyPass.renderToScreen = true
  const dispose = useDisposable(() => {
    copyPass.dispose()
  })
  return {
    copyPass,
    dispose,
  }
}

// 伽马矫正抗锯齿优化
type SMAAEffectOptions = {
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
export function useSmaaEffectPass(camera: Camera, options?: SMAAEffectOptions) {
  const { smaa, texture } = options ?? {}
  const smaaEffect = new SMAAEffect({
    preset: SMAAPreset.HIGH,
    edgeDetectionMode: EdgeDetectionMode.COLOR,
    predicationMode: PredicationMode.DEPTH,
    ...smaa,
  })
  smaaEffect.edgeDetectionMaterial.edgeDetectionThreshold = 0.02
  smaaEffect.edgeDetectionMaterial.predicationThreshold = 0.002
  smaaEffect.edgeDetectionMaterial.predicationScale = 1

  const edgesTextureEffect = new TextureEffect({
    blendFunction: BlendFunction.SKIP,
    texture: smaaEffect.weightsTexture,
    ...texture,
  })
  const weightsTextureEffect = new TextureEffect({
    blendFunction: BlendFunction.SKIP,
    texture: smaaEffect.edgesTexture,
    ...texture,
  })

  const smaaEffectPass = new EffectPass(
    camera,
    smaaEffect,
    edgesTextureEffect,
    weightsTextureEffect,
  )

  const dispose = useDisposable(() => {
    smaaEffect.dispose()
    edgesTextureEffect.dispose()
    weightsTextureEffect.dispose()
    smaaEffectPass.dispose()
  })
  return {
    smaaEffect,
    edgesTextureEffect,
    weightsTextureEffect,
    smaaEffectPass,
    dispose,
  }
}

// 发光描边效果
type OutlineEffectOptions = {
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
export function useOutlinePass(scene: Scene, camera: Camera, options?: OutlineEffectOptions) {
  const outlineEffect = new OutlineEffect(scene, camera, {
    blendFunction: BlendFunction.SCREEN,
    multisampling: 4,
    edgeStrength: 2.5, // 边框的亮度强度
    pulseSpeed: 0.5,
    visibleEdgeColor: 0xFFFFFF, // 呼吸显示颜色
    hiddenEdgeColor: 0x22090A, // 呼吸消失颜色
    blur: false,
    xRay: true,
    ...options,
  })
  const selection = outlineEffect.selection
  const outlinePass = new EffectPass(camera, outlineEffect)

  const dispose = useDisposable(() => {
    outlineEffect.dispose()
    outlinePass.dispose()
  })
  return {
    outlineEffect,
    outlinePass,
    selection,
    dispose,
  }
}

// 发光对象效果
export function useSelectiveBloomPass(scene: Scene, camera: Camera, options?: BloomEffectOptions) {
  const selectiveBloomEffect = new SelectiveBloomEffect(scene, camera, {
    blendFunction: BlendFunction.ADD,
    mipmapBlur: true,
    luminanceThreshold: 0.4,
    luminanceSmoothing: 0.2,
    intensity: 3.0,
    ...options,
  })
  const selection = selectiveBloomEffect.selection
  const selectiveBloomEffectPass = new EffectPass(camera, selectiveBloomEffect)
  const dispose = useDisposable(() => {
    selectiveBloomEffect.dispose()
    selectiveBloomEffectPass.dispose()
  })
  return {
    selectiveBloomEffect,
    selection,
    selectiveBloomEffectPass,
    dispose,
  }
}
