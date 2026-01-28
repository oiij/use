import type { UseRafFnCallbackArguments } from '@vueuse/core'
import type { CameraOptions, RendererOptions } from 'ogl'
import type { TemplateRef } from 'vue'
import { createEventHook, useDebounceFn, useRafFn } from '@vueuse/core'
import { Camera, Renderer, Transform } from 'ogl'
import { onUnmounted } from 'vue'
import { watchElementSize } from '../../_utils/custom-watch'

export type OGLOptions = {
  rendererOptions?: RendererOptions
  cameraOptions?: CameraOptions & {
    position?: [number, number, number]
  }
  manual?: boolean
  disableRender?: boolean
}
type ResizeArguments = {
  width: number
  height: number
  aspect: number
  dpr: number
}
export function useOGL(templateRef: TemplateRef<HTMLElement>, options?: OGLOptions) {
  const { manual, disableRender, rendererOptions, cameraOptions } = options ?? {}
  const { position = [0, 0, 5], ...extraCameraOptions } = cameraOptions ?? {}
  const renderer = new Renderer(rendererOptions)
  const gl = renderer.gl
  const camera = new Camera(gl, extraCameraOptions)
  camera.position.set(...position)

  const scene = new Transform()
  let renderDmm: HTMLCanvasElement | null = null

  const onCreatedEvent = createEventHook<[Renderer]>()
  const onResizedEvent = createEventHook<[ResizeArguments]>()
  const onDisposedEvent = createEventHook<[]>()
  const onLoopEvent = createEventHook<[Renderer, UseRafFnCallbackArguments]>()

  function resize(width: number, height: number) {
    const aspect = width / height
    const dpr = window.devicePixelRatio ?? 1
    renderer.setSize(width * dpr, height * dpr)
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    onResizedEvent.trigger({ width, height, aspect, dpr })
  }
  const debounceResize = useDebounceFn(resize, 100)

  function create() {
    if (!renderDmm) {
      templateRef.value?.appendChild(gl.canvas)
      renderDmm = gl.canvas
      onCreatedEvent.trigger(renderer)
    }
  }

  const { resume, pause, isActive } = useRafFn((args) => {
    onLoopEvent.trigger(renderer, args)
  }, { immediate: !manual })

  onLoopEvent.on(() => {
    if (!disableRender) {
      renderer.render({ scene, camera })
    }
  })

  watchElementSize(templateRef, ({ width, height }) => {
    debounceResize(width, height)
    create()
  })

  function dispose() {
    if (renderDmm) {
      templateRef.value?.removeChild(renderDmm)
      renderDmm = null
    }
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    onDisposedEvent.trigger()
  }
  onUnmounted(() => {
    dispose()
  })
  return {
    templateRef,
    renderer,
    gl,
    camera,
    scene,
    onCreated: onCreatedEvent.on,
    onResize: onResizedEvent.on,
    onDisposed: onDisposedEvent.on,
    onLoop: onLoopEvent.on,
    resume,
    pause,
    dispose,
    isActive,
  }
}
