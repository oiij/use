import type { UseRafFnCallbackArguments } from '@vueuse/core'
import type { Light, Object3D, WebGLRendererParameters } from 'three'
import type { TemplateRef } from 'vue'
import { createEventHook, useDebounceFn, useEventListener, useRafFn } from '@vueuse/core'
import { Clock, PerspectiveCamera, Scene, VSMShadowMap, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { watchElementSize } from '../../_utils/custom-watch'
import { useDisposable } from './utils/_utils'
import { onIntersectObject as _onIntersectObject } from './utils/utils'

export type ThreeJsOptions = {
  rendererOptions?: WebGLRendererParameters
  cameraOptions?: {
    fov?: number
    aspect?: number
    near?: number
    far?: number
    position?: [number, number, number]
    lookAt?: [number, number, number]
  }
  disableRender?: boolean
  lights?: Light[]
  helpers?: Object3D []
  manual?: boolean
}
type LoopEvent = {
  clock: Clock
  delta: number
  elapsed: number
}
type ResizeArguments = {
  width: number
  height: number
  aspect: number
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

export type UseThreeJsReturns = ReturnType<typeof useThreeJs>
