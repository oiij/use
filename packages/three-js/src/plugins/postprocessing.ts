import type { BloomEffectOptions, KernelSize, Pass } from 'postprocessing'
import type { Camera, Material, Scene, Texture, WebGLRenderer, WebGLRendererParameters } from 'three'
import { BlendFunction, CopyMaterial, EdgeDetectionMode, EffectComposer, EffectPass, OutlineEffect, PredicationMode, RenderPass, SelectiveBloomEffect, ShaderPass, SMAAEffect, SMAAPreset, TextureEffect } from 'postprocessing'
import { HalfFloatType } from 'three'
import { onUnmounted } from 'vue'

function useDisposable(disposeFn: () => void) {
  onUnmounted(() => disposeFn())
  return disposeFn
}

/**
 * 后期处理渲染器配置
 */
export const RendererOptions: WebGLRendererParameters = {
  powerPreference: 'high-performance',
  antialias: false,
  stencil: false,
  depth: false,
}

/**
 * 效果组合器选项
 */
type EffectComposerOptions = {
  /**
   * 是否启用深度缓冲区
   */
  depthBuffer?: boolean
  /**
   * 是否启用模板缓冲区
   */
  stencilBuffer?: boolean
  /**
   * 是否启用alpha通道
   */
  alpha?: boolean
  /**
   * 多重采样级别
   */
  multisampling?: number
  /**
   * 帧缓冲区类型
   */
  frameBufferType?: number
  /**
   * 通道数组或通道创建函数数组
   */
  passes?: Pass[] | ((renderer: WebGLRenderer, scene: Scene, camera: Camera) => Pass)[]
  /**
   * 覆盖材质
   */
  overrideMaterial?: Material
}

/**
 * 使用后期处理
 *
 * @param renderer - WebGL 渲染器
 * @param scene - 场景
 * @param camera - 相机
 * @param options - 效果组合器选项
 * @returns 效果组合器实例、渲染通道和控制方法
 *
 * @example
 * ```ts
 * import { usePostprocessing, RendererOptions } from '@oiij/three-js/plugins'
 * import { EffectPass, BloomEffect } from 'postprocessing'
 *
 * const renderer = new THREE.WebGLRenderer(RendererOptions)
 * const scene = new THREE.Scene()
 * const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
 *
 * const { composer, resize, dispose } = usePostprocessing(renderer, scene, camera, {
 *   passes: [
 *     new EffectPass(camera, new BloomEffect())
 *   ]
 * })
 *
 * // 调整大小
 * resize({ width: window.innerWidth, height: window.innerHeight })
 *
 * // 渲染
 * composer.render()
 * ```
 */
export function usePostprocessing(renderer: WebGLRenderer, scene: Scene, camera: Camera, options?: EffectComposerOptions) {
  const { passes, overrideMaterial, ...opt } = options ?? {}
  const composer = new EffectComposer(renderer, {
    frameBufferType: HalfFloatType,
    ...opt,
  })
  const renderPass = new RenderPass(scene, camera, overrideMaterial) // 渲染通道
  composer.addPass(renderPass)
  passes?.forEach(pass => composer.addPass(typeof pass === 'function' ? pass(renderer, scene, camera) : pass))

  /**
   * 调整大小
   *
   * @param size - 大小对象
   * @param size.width - 宽度
   * @param size.height - 高度
   */
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

/**
 * 使用复制通道
 *
 * @returns 复制通道和销毁方法
 *
 * @example
 * ```ts
 * import { useCopyPass } from '@oiij/three-js/plugins'
 *
 * const { copyPass, dispose } = useCopyPass()
 *
 * // 添加到组合器
 * composer.addPass(copyPass)
 * ```
 */
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

/**
 * SMAA 效果选项
 */
type SMAAEffectOptions = {
  /**
   * SMAA 配置
   */
  smaa?: {
    /**
     * SMAA 预设
     */
    preset?: SMAAPreset
    /**
     * 边缘检测模式
     */
    edgeDetectionMode?: EdgeDetectionMode
    /**
     * 预测模式
     */
    predicationMode?: PredicationMode
  }
  /**
   * 纹理配置
   */
  texture?: {
    /**
     * 混合函数
     */
    blendFunction?: BlendFunction
    /**
     * 纹理
     */
    texture?: Texture
    /**
     * 是否进行宽高比校正
     */
    aspectCorrection?: boolean
  }
}

/**
 * 使用 SMAA 效果通道
 *
 * @param camera - 相机
 * @param options - SMAA 效果选项
 * @returns SMAA 效果、纹理效果、效果通道和销毁方法
 *
 * @example
 * ```ts
 * import { useSmaaEffectPass } from '@oiij/three-js/plugins'
 *
 * const { smaaEffectPass, dispose } = useSmaaEffectPass(camera)
 *
 * // 添加到组合器
 * composer.addPass(smaaEffectPass)
 * ```
 */
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

/**
 * 轮廓效果选项
 */
type OutlineEffectOptions = {
  /**
   * 混合函数
   */
  blendFunction?: BlendFunction
  /**
   * 图案纹理
   */
  patternTexture?: Texture
  /**
   * 图案缩放
   */
  patternScale?: number
  /**
   * 边缘强度
   */
  edgeStrength?: number
  /**
   * 脉冲速度
   */
  pulseSpeed?: number
  /**
   * 可见边缘颜色
   */
  visibleEdgeColor?: number
  /**
   * 隐藏边缘颜色
   */
  hiddenEdgeColor?: number
  /**
   * 多重采样级别
   */
  multisampling?: number
  /**
   * 分辨率缩放
   */
  resolutionScale?: number
  /**
   * 分辨率宽度
   */
  resolutionX?: number
  /**
   * 分辨率高度
   */
  resolutionY?: number
  /**
   * 宽度
   */
  width?: number
  /**
   * 高度
   */
  height?: number
  /**
   * 内核大小
   */
  kernelSize?: KernelSize
  /**
   * 是否模糊
   */
  blur?: boolean
  /**
   * 是否启用X光模式
   */
  xRay?: boolean
}

/**
 * 使用轮廓通道
 *
 * @param scene - 场景
 * @param camera - 相机
 * @param options - 轮廓效果选项
 * @returns 轮廓效果、效果通道、选择集和销毁方法
 *
 * @example
 * ```ts
 * import { useOutlinePass } from '@oiij/three-js/plugins'
 *
 * const { outlinePass, selection, dispose } = useOutlinePass(scene, camera)
 *
 * // 添加到组合器
 * composer.addPass(outlinePass)
 *
 * // 选择要显示轮廓的对象
 * selection.add(mesh)
 * ```
 */
export function useOutlinePass(scene: Scene, camera: Camera, options?: OutlineEffectOptions) {
  const outlineEffect = new OutlineEffect(scene, camera, {
    blendFunction: BlendFunction.SCREEN,
    multisampling: 4,
    edgeStrength: 2.5,
    pulseSpeed: 0.5,
    visibleEdgeColor: 0xFFFFFF,
    hiddenEdgeColor: 0x22090A,
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

/**
 * 使用选择性发光通道
 *
 * @param scene - 场景
 * @param camera - 相机
 * @param options - 发光效果选项
 * @returns 选择性发光效果、选择集、效果通道和销毁方法
 *
 * @example
 * ```ts
 * import { useSelectiveBloomPass } from '@oiij/three-js/plugins'
 *
 * const { selectiveBloomEffectPass, selection, dispose } = useSelectiveBloomPass(scene, camera)
 *
 * // 添加到组合器
 * composer.addPass(selectiveBloomEffectPass)
 *
 * // 选择要发光的对象
 * selection.add(mesh)
 * ```
 */
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
