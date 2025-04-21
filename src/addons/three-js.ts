import type { BladeController, View } from '@tweakpane/core'
import type { EventType } from 'mitt'
import type { Camera, ColorRepresentation, Object3D, WebGLRendererParameters } from 'three'
import type { BladeApi } from 'tweakpane'
import type { Ref } from 'vue'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { useElementSize } from '@vueuse/core'
import mitt from 'mitt'
import { BlendFunction, CopyMaterial, EdgeDetectionMode, EffectComposer, EffectPass, PredicationMode, RenderPass, ShaderPass, SMAAEffect, SMAAPreset, TextureEffect } from 'postprocessing'
import { ACESFilmicToneMapping, AmbientLight, AxesHelper, CameraHelper, HalfFloatType, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, VSMShadowMap, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { Pane } from 'tweakpane'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface FPSGraph extends BladeApi<BladeController<View>> {
  begin: () => void
  end: () => void
}
export interface ThreeJsOptions {
  webGlRendererOptions?: WebGLRendererParameters
  perspectiveCameraOptions?: {
    fov?: number
    aspect?: number
    near?: number
    far?: number
  }
  cameraHelper?: boolean
  ambientLight?: {
    color?: ColorRepresentation
    intensity?: number
  } | boolean
  stats?: boolean
  axesHelper?:boolean|number
  controls?: boolean

}
export type UseThreeJsEventType = {
  'resize': { width: number, height: number }
  'camera-update': void
  'rendered': void
  'before-animate': void
  'after-animate': void
} & Record<EventType, unknown>

// 计算鼠标与模型对象相交
export function onIntersectObject(renderer: WebGLRenderer, camera: PerspectiveCamera, obj: Object3D, event: MouseEvent) {
  // 鼠标设备坐标
  const mouse = new Vector2(1, 1)
  // 创建一个射线投射器
  const raycaster = new Raycaster()
  // 判断是否相交

  const rect = renderer.domElement.getBoundingClientRect()
  // 计算鼠标点击位置的归一化设备坐标
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  // 计算射线与球体的相交情况
  const intersects = raycaster.intersectObject(obj)
  // 如果有相交，则说明点击了球体
  if (intersects.length > 0)
    return true
  else
    return false
}
export function lon2xyz(R: number, longitude: number, latitude: number, offset = 1) {
  let lon = longitude * Math.PI / 180 // 转弧度值
  const lat = latitude * Math.PI / 180 // 转弧度值
  lon = -lon // js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  const x = R * offset * Math.cos(lat) * Math.cos(lon)
  const y = R * offset * Math.sin(lat)
  const z = R * offset * Math.cos(lat) * Math.sin(lon)

  return new Vector3(x, y, z)
}
function createWebGLRenderer(options?: WebGLRendererParameters) {
  const renderer = new WebGLRenderer({
    powerPreference: 'high-performance',
    alpha: true,
    antialias: false,
    stencil: false,
    depth: false,
    ...options,
  })
  renderer.shadowMap.enabled = true // 启用阴影
  renderer.shadowMap.type = VSMShadowMap
  renderer.shadowMap.autoUpdate = false
  renderer.shadowMap.needsUpdate = true
  renderer.toneMapping = ACESFilmicToneMapping
  return {
    renderer,
  }
}
function createCamera(aspect: Ref<number>, perspectiveCamera?: ThreeJsOptions['perspectiveCameraOptions']) {
  const camera = new PerspectiveCamera(perspectiveCamera?.fov ?? 45, perspectiveCamera?.aspect ?? aspect.value, perspectiveCamera?.near ?? 0.1, perspectiveCamera?.far ?? 1000)
  // 相机辅助
  const cameraHelper = new CameraHelper(camera)
  return {
    camera,
    cameraHelper,
  }
}
function createAmbientLight(options?: ThreeJsOptions['ambientLight']) {
  const ambientLightOptions = typeof options === 'object'
    ? options
    : {
        color: 0xFFFFFF,
        intensity: 0.5,
      }
  const ambientLight = new AmbientLight(ambientLightOptions.color, ambientLightOptions.intensity)
  return {
    ambientLight,
  }
}
function createGui(axesHelper: AxesHelper, cameraHelper: CameraHelper, controls: OrbitControls){
  const gui = new Pane()
  gui.registerPlugin(EssentialsPlugin)
  const fpsGraph = gui.addBlade({
    view: 'fpsgraph',
    label: 'fpsgraph',
  }) as FPSGraph
  gui.addBinding(axesHelper, 'visible', {
    label: 'AxesHelper',
  })
  gui.addBinding(cameraHelper, 'visible')
  gui.addBinding(controls, 'autoRotate')
  gui.addBinding(controls, 'autoRotateSpeed', {
    step: 0.1,
    min: 0.1,
    max: 10,
  })
  return {
    gui,
    fpsGraph,
  }
}
function createComposer(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
  // 创建后处理
  const composer = new EffectComposer(renderer, {
    frameBufferType: HalfFloatType,
  })
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const smaaEffect = new SMAAEffect({
    preset: SMAAPreset.HIGH,
    edgeDetectionMode: EdgeDetectionMode.COLOR,
    predicationMode: PredicationMode.DEPTH,
  })
  smaaEffect.edgeDetectionMaterial.edgeDetectionThreshold = 0.02
  smaaEffect.edgeDetectionMaterial.predicationThreshold = 0.002
  smaaEffect.edgeDetectionMaterial.predicationScale = 1
  const edgesTextureEffect = new TextureEffect({
    blendFunction: BlendFunction.SKIP,
    texture: smaaEffect.edgesTexture,
  })
  const weightsTextureEffect = new TextureEffect({
    blendFunction: BlendFunction.SKIP,
    texture: smaaEffect.edgesTexture,
  })
  const copyPass = new ShaderPass(new CopyMaterial())
  copyPass.enabled = false
  copyPass.renderToScreen = true
  const effectPass = new EffectPass(
    camera,
    smaaEffect,
    edgesTextureEffect,
    weightsTextureEffect,
  )
  effectPass.renderToScreen = true
  composer.addPass(copyPass)
  composer.addPass(effectPass)
  return {
    composer,
    renderPass,
    smaaEffect,
    edgesTextureEffect,
    weightsTextureEffect,
    copyPass,
    effectPass,
  }
}
export function useThreeJs(options?: ThreeJsOptions) {
  const { webGlRendererOptions, perspectiveCameraOptions } = options ?? {}
  const { emit, on, off } = mitt<UseThreeJsEventType>()

  const domRef = ref<HTMLElement>()
  const { width, height } = useElementSize(domRef)
  const aspect = computed(() => width.value / height.value)
  const pixelRatio = Math.max(window.devicePixelRatio, 2)

  // 创建渲染器
  const { renderer } = createWebGLRenderer(webGlRendererOptions)

  // 创建场景和相机
  const scene = new Scene()
  const { camera, cameraHelper } = createCamera(aspect, perspectiveCameraOptions)
  const showCameraHelper = ref(options?.cameraHelper ?? false)
  if (showCameraHelper.value) {
    scene.add(cameraHelper)
  }
  watch(showCameraHelper, (v) => {
    if (v) {
      scene.add(cameraHelper)
    }
    else {
      scene.remove(cameraHelper)
    }
  })

  // 性能监控
  const stats = new Stats()
  const showStats = ref(options?.stats ?? true)

  watch(showStats, (v) => {
    if (v) {
      stats.dom.style.display = 'block'
    }
    else {
      stats.dom.style.display = 'none'
    }
  })

  // 全局光
  const { ambientLight } = createAmbientLight(options?.ambientLight)
  const showAmbientLight = ref(typeof options?.ambientLight === 'boolean'
    ? options.ambientLight
    : true)
  if (showAmbientLight.value) {
    scene.add(ambientLight)
  }
  watch(showAmbientLight, (v) => {
    if (v) {
      scene.add(ambientLight)
    }
    else {
      scene.remove(ambientLight)
    }
  })

  // 坐标轴
  const axesHelper = new AxesHelper( typeof options?.axesHelper==='number'? options.axesHelper:10)
  const showAxesHelper = ref(typeof options?.axesHelper==='boolean'? options.axesHelper:true)
  if (showAxesHelper.value) {
    scene.add(axesHelper)
  }
  watch(showAxesHelper, (v) => {
    if (v) {
      scene.add(axesHelper)
    }
    else {
      scene.remove(axesHelper)
    }
  })

  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 调试
  const {gui,fpsGraph} = createGui(axesHelper, cameraHelper, controls)
  const showGui = ref(false)
  watch(showGui, (v) => {
    if (v) {
      gui.hidden = true
    }
    else {
      gui.hidden = false
    }
  })
  // 后处理渲染器
  const useComposer = ref(false)
  const { composer, renderPass, smaaEffect, edgesTextureEffect, weightsTextureEffect, copyPass, effectPass } = createComposer(renderer, scene, camera)

  function resize() {
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(width.value, height.value)
    if (useComposer.value) {
      const pixelRatioWidth = width.value * pixelRatio
      const pixelRatioHeight = height.value * pixelRatio
      composer.setSize(pixelRatioWidth, pixelRatioHeight)
      copyPass.setSize(pixelRatioWidth, pixelRatioHeight)
      effectPass.setSize(pixelRatioWidth, pixelRatioHeight)
      smaaEffect.setSize(pixelRatioWidth, pixelRatioHeight)
    }
    emit('resize', { width: width.value, height: height.value })
    camera.aspect = aspect.value
    camera.updateProjectionMatrix()
    emit('camera-update')
  }
  const rendered = ref(false)
  function render() {
    if (domRef.value) {
      resize()
      domRef.value.appendChild(renderer.domElement)
      rendered.value = true
      emit('rendered')
      domRef.value.appendChild(stats.dom)
    }
  }

  // 动画循环
  let animationId: number | null = null
  function animate() {
    emit('before-animate')
    fpsGraph.begin()

    if (useComposer.value) {
      composer.render()
    }
    else {
      renderer.render(scene, camera)
    }

    fpsGraph.end()
    stats.update()
    controls.update()
    emit('after-animate')
    animationId = requestAnimationFrame(animate)
  }
  animate()

  watch([width, height], () => {
    if (rendered.value) {
      resize()
    }
    else {
      render()
    }
  })
  onMounted(() => {
    render()
  })
  function destroy() {
    try {
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
      const gl = renderer.domElement.getContext('webgl')
      if (gl) {
        gl.getExtension('WEBGL_lose_context')!.loseContext()
      }
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      controls.dispose()
      stats.dom.remove()
      gui.document.close()
      gui.dispose()
    }
    catch (error) {
      console.error(error)
    }
  }
  onUnmounted(() => {
    destroy()
  })
  return {
    domRef,
    renderer,
    scene,
    camera,
    cameraHelper,
    showCameraHelper,
    stats,
    showStats,
    ambientLight,
    showAmbientLight,
    axesHelper,
    showAxesHelper,
    controls,
    gui,
    fpsGraph,
    showGui,
    useComposer,
    composer,
    renderPass,
    smaaEffect,
    edgesTextureEffect,
    weightsTextureEffect,
    copyPass,
    effectPass,
    on,
    off,
    destroy
  }
}
