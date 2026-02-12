import type { UseRafFnCallbackArguments } from '@vueuse/core'
import type { Light, Object3D, WebGLRendererParameters } from 'three'
import type { TemplateRef } from 'vue'
import { createEventHook, useDebounceFn, useEventListener, useRafFn } from '@vueuse/core'
import { Clock, PerspectiveCamera, Scene, VSMShadowMap, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { watchElementSize } from '../../_utils/custom-watch'
import { useDisposable } from './utils/_utils'
import { onIntersectObject as _onIntersectObject } from './utils/utils'

/**
 * Three.js 选项类型
 */
export type ThreeJsOptions = {
  /**
   * 渲染器选项
   */
  rendererOptions?: WebGLRendererParameters
  /**
   * 相机选项
   */
  cameraOptions?: {
    /**
     * 视野角度
     * @default 50
     */
    fov?: number
    /**
     * 宽高比
     * @default 1
     */
    aspect?: number
    /**
     * 近截面
     * @default 0.1
     */
    near?: number
    /**
     * 远截面
     * @default 2000
     */
    far?: number
    /**
     * 相机位置
     * @default [0, 1, 3]
     */
    position?: [number, number, number]
    /**
     * 相机看向的点
     * @default [0, 0, 0]
     */
    lookAt?: [number, number, number]
  }
  /**
   * 是否禁用渲染
   * @default false
   */
  disableRender?: boolean
  /**
   * 光源数组
   */
  lights?: Light[]
  /**
   * 辅助对象数组
   */
  helpers?: Object3D []
  /**
   * 是否手动控制
   * @default false
   */
  manual?: boolean
}

/**
 * 循环事件类型
 */
type LoopEvent = {
  /**
   * 时钟
   */
  clock: Clock
  /**
   * 时间增量
   */
  delta: number
  /**
   * 经过的时间
   */
  elapsed: number
}

/**
 * 调整大小参数类型
 */
type ResizeArguments = {
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

// 计算鼠标与模型对象相交
function createRenderer(options?: WebGLRendererParameters) {
  const renderer = new WebGLRenderer({
    ...options,
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = VSMShadowMap
  return {
    renderer,
  }
}

function createCamera(options?: ThreeJsOptions['cameraOptions']) {
  const { fov = 50, aspect = 1, near = 0.1, far = 2000, position = [0, 1, 3], lookAt = [0, 0, 0] } = options ?? {}
  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(...position)
  camera.lookAt(...lookAt)
  return {
    camera,
  }
}

/**
 * 使用 Three.js
 *
 * @param templateRef - Three.js 容器的模板引用
 * @param options - Three.js 选项
 * @returns Three.js 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useThreeJs } from '@oiij/three-js'
 * import { BoxGeometry, Mesh, MeshStandardMaterial, AmbientLight, PointLight } from 'three'
 *
 * const containerRef = ref()
 * const { scene, onLoop } = useThreeJs(containerRef, {
 *   lights: [
 *     new AmbientLight(0xffffff, 0.5),
 *     new PointLight(0xffffff, 1, 100)
 *   ]
 * })
 *
 * // 添加一个立方体
 * const geometry = new BoxGeometry(1, 1, 1)
 * const material = new MeshStandardMaterial({ color: 0x00ff00 })
 * const cube = new Mesh(geometry, material)
 * scene.add(cube)
 *
 * onLoop(({ renderer, clock }) => {
 *   // 旋转立方体
 *   cube.rotation.x += 0.01
 *   cube.rotation.y += 0.01
 * })
 * </script>
 *
 * <template>
 *   <div ref="containerRef" style="width: 100%; height: 400px;"></div>
 * </template>
 * ```
 */
export function useThreeJs(templateRef: TemplateRef<HTMLElement>, options?: ThreeJsOptions) {
  const { rendererOptions, cameraOptions, disableRender = false, lights = [], helpers = [], manual } = options ?? {}
  const { renderer } = createRenderer(rendererOptions)
  const scene = new Scene()
  scene.add(...[...lights, ...helpers])
  const { camera } = createCamera(cameraOptions)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const onCreatedEvent = createEventHook<[WebGLRenderer]>()
  const onResizedEvent = createEventHook<[ResizeArguments]>()
  const onDisposedEvent = createEventHook<[]>()
  const onLoopEvent = createEventHook<[WebGLRenderer, LoopEvent, UseRafFnCallbackArguments]>()
  const onBeforeLoopEvent = createEventHook<[WebGLRenderer, LoopEvent, UseRafFnCallbackArguments]>()
  const onAfterLoopEvent = createEventHook<[WebGLRenderer, LoopEvent, UseRafFnCallbackArguments]>()

  const onClickEvent = createEventHook<[MouseEvent]>()
  const onDoubleClickEvent = createEventHook<[MouseEvent]>()
  const onContextMenuEvent = createEventHook<[MouseEvent]>()

  /**
   * 调整大小
   *
   * @param width - 宽度
   * @param height - 高度
   */
  function resize(width: number, height: number) {
    const aspect = width / height
    const dpr = window.devicePixelRatio ?? 1
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height)
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    onResizedEvent.trigger({ width, height, aspect, dpr })
  }

  const debounceResize = useDebounceFn(resize, 100)
  let renderDmm: HTMLCanvasElement | null = null

  /**
   * 创建 Three.js 实例
   */
  function create() {
    if (!renderDmm) {
      templateRef.value?.appendChild(renderer.domElement)
      renderDmm = renderer.domElement
      onCreatedEvent.trigger(renderer)
    }
  }

  const clock = new Clock()
  let delta = 0
  let elapsed = 0

  const { pause, resume, isActive } = useRafFn((arg) => {
    onBeforeLoopEvent.trigger(renderer, { clock, delta, elapsed }, arg)
    onLoopEvent.trigger(renderer, { clock, delta, elapsed }, arg)
    onAfterLoopEvent.trigger(renderer, { clock, delta, elapsed }, arg)
  }, {
    immediate: !manual,
  })

  onBeforeLoopEvent.on(() => {
    controls.update()
  })

  onLoopEvent.on(() => {
    if (!disableRender) {
      renderer.render(scene, camera)
    }
  })

  onAfterLoopEvent.on(() => {
    delta = clock.getDelta()
    elapsed = clock.getElapsedTime()
  })

  watchElementSize(templateRef, ({ width, height }) => {
    debounceResize(width, height)
    create()
  })

  const dispose = useDisposable(() => {
    controls.dispose()
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.getContext('webgl')?.getExtension('WEBGL_lose_context')!.loseContext()
    if (renderDmm) {
      templateRef.value?.removeChild(renderDmm)
      renderDmm = null
    }
    onDisposedEvent.trigger()
  })

  /**
   * 检测鼠标与对象相交
   *
   * @param obj - 要检测的对象或对象数组
   * @param event - 鼠标事件
   * @param callback - 相交回调
   * @returns 是否相交
   *
   * @example
   * ```ts
   * import { useThreeJs } from '@oiij/three-js'
   *
   * const { onIntersectObject } = useThreeJs(containerRef)
   *
   * // 监听点击事件
   * containerRef.value.addEventListener('click', (event) => {
   *   const intersected = onIntersectObject(objects, event, (intersectedObjects) => {
   *     console.log('相交的对象:', intersectedObjects)
   *   })
   * })
   * ```
   */
  function onIntersectObject(obj: Object3D | Object3D[], event: PointerEvent | MouseEvent, callback?: (obj: Object3D[]) => void) {
    const intersect = _onIntersectObject(renderer, camera, obj, event)
    if (intersect.length > 0) {
      if (typeof callback === 'function') {
        callback(intersect.map(m => m.object))
      }
    }
    return intersect.length > 0
  }

  useEventListener(renderer.domElement, 'click', onClickEvent.trigger)
  useEventListener(renderer.domElement, 'contextmenu', onContextMenuEvent.trigger)
  useEventListener(renderer.domElement, 'dblclick', onDoubleClickEvent.trigger)

  return {
    templateRef,
    renderer,
    scene,
    camera,
    controls,
    clock,
    pause,
    resume,
    isActive,
    dispose,
    onIntersectObject,
    onRendered: onCreatedEvent.on,
    onResize: onResizedEvent.on,
    onDestroy: onDisposedEvent.on,
    onBeforeLoop: onBeforeLoopEvent.on,
    onLoop: onLoopEvent.on,
    onAfterLoop: onAfterLoopEvent.on,
    onClick: onClickEvent.on,
    onDoubleClick: onDoubleClickEvent.on,
    onContextMenu: onContextMenuEvent.on,
  }
}

/**
 * 使用 Three.js 返回值类型
 */
export type UseThreeJsReturns = ReturnType<typeof useThreeJs>
