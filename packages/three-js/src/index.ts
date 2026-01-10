import type { Light, Object3D, WebGLRendererParameters } from 'three'
import type { TemplateRef } from 'vue'
import { createEventHook, useDebounceFn, useElementSize, useEventListener, useRafFn } from '@vueuse/core'
import { Clock, PerspectiveCamera, Scene, VSMShadowMap, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { computed, watch } from 'vue'
import { useDisposable } from './utils/_utils'
import { onIntersectObject as _onIntersectObject } from './utils/utils'

export type ThreeJsOptions = {
  renderer?: WebGLRendererParameters
  camera?: {
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

}
type LoopEvent = {
  clock: Clock
  delta: number
  elapsed: number
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
function createCamera(options?: ThreeJsOptions['camera']) {
  const { fov = 50, aspect = 1, near = 0.1, far = 2000, position = [0, 1, 3], lookAt = [0, 0, 0] } = options ?? {}
  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(...position)
  camera.lookAt(...lookAt)
  return {
    camera,
  }
}
export function useThreeJs(templateRef: TemplateRef<HTMLElement>, options?: ThreeJsOptions) {
  const { renderer: rendererOptions, camera: cameraOptions, disableRender = false, lights = [], helpers = [] } = options ?? {}
  const { renderer } = createRenderer(rendererOptions)
  const scene = new Scene()
  scene.add(...[...lights, ...helpers])
  const { camera } = createCamera(cameraOptions)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const { width, height } = useElementSize(templateRef, {
    width: 0,
    height: 0,
  })
  const aspect = computed(() => width.value / height.value)
  const pixelRatio = window.devicePixelRatio

  const onCreatedEvent = createEventHook<WebGLRenderer>()
  const onResizeEvent = createEventHook<{ width: number, height: number, aspect: number, pixelRatio: number }>()
  const onDestroyEvent = createEventHook<[]>()
  const onLoopEvent = createEventHook<LoopEvent>()
  const onBeforeLoopEvent = createEventHook<LoopEvent>()
  const onAfterLoopEvent = createEventHook<LoopEvent>()

  const onPointerDownEvent = createEventHook<[PointerEvent]>()
  const onPointerUpEvent = createEventHook<[PointerEvent]>()
  const onPointerMoveEvent = createEventHook<[PointerEvent]>()

  const onPointerEnterEvent = createEventHook<[PointerEvent]>()
  const onPointerLeaveEvent = createEventHook<[PointerEvent]>()
  const onPointerOutEvent = createEventHook<[PointerEvent]>()
  const onPointerOverEvent = createEventHook<[PointerEvent]>()
  const onClickEvent = createEventHook<[MouseEvent]>()
  const onDoubleClickEvent = createEventHook<[MouseEvent]>()
  const onContextMenuEvent = createEventHook<[MouseEvent]>()

  function resize() {
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(width.value, height.value)
    camera.aspect = aspect.value
    camera.updateProjectionMatrix()
    onResizeEvent.trigger({ width: width.value, height: height.value, aspect: aspect.value, pixelRatio })
  }
  let renderDmm: HTMLCanvasElement | null = null
  function create() {
    if (templateRef.value) {
      resize()
      if (!renderDmm) {
        templateRef.value.appendChild(renderer.domElement)
        renderDmm = renderer.domElement
        onCreatedEvent.trigger(renderer)
      }
    }
  }
  const createDebounce = useDebounceFn(create, 100)
  const clock = new Clock()
  let delta = 0
  let elapsed = 0
  const { pause, resume, isActive } = useRafFn(() => {
    onBeforeLoopEvent.trigger({ clock, delta, elapsed })
    onLoopEvent.trigger({ clock, delta, elapsed })
    onAfterLoopEvent.trigger({ clock, delta, elapsed })
  }, {
    immediate: true,
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

  watch([width, height], () => {
    if (width.value > 0 && height.value > 0) {
      createDebounce()
    }
  })

  const dispose = useDisposable(() => {
    onDestroyEvent.trigger()
    controls.dispose()
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.getContext('webgl')?.getExtension('WEBGL_lose_context')!.loseContext()
    renderDmm?.parentElement?.removeChild(renderDmm)
    renderDmm = null
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
  useEventListener(renderer.domElement, 'pointerdown', onPointerDownEvent.trigger)
  useEventListener(renderer.domElement, 'pointerup', onPointerUpEvent.trigger)
  useEventListener(renderer.domElement, 'pointermove', onPointerMoveEvent.trigger)
  useEventListener(renderer.domElement, 'pointerenter', onPointerEnterEvent.trigger)
  useEventListener(renderer.domElement, 'pointerleave', onPointerLeaveEvent.trigger)
  useEventListener(renderer.domElement, 'pointerout', onPointerOutEvent.trigger)
  useEventListener(renderer.domElement, 'pointerover', onPointerOverEvent.trigger)

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
    onResize: onResizeEvent.on,
    onDestroy: onDestroyEvent.on,
    onBeforeLoop: onBeforeLoopEvent.on,
    onLoop: onLoopEvent.on,
    onAfterLoop: onAfterLoopEvent.on,
    onPointerDown: onPointerDownEvent.on,
    onPointerUp: onPointerUpEvent.on,
    onPointerMove: onPointerMoveEvent.on,
    onPointerEnter: onPointerEnterEvent.on,
    onPointerLeave: onPointerLeaveEvent.on,
    onPointerOut: onPointerOutEvent.on,
    onPointerOver: onPointerOverEvent.on,
    onClick: onClickEvent.on,
    onDoubleClick: onDoubleClickEvent.on,
    onContextMenu: onContextMenuEvent.on,
  }
}

export type UseThreeJsReturns = ReturnType<typeof useThreeJs>
