import type { UseRafFnCallbackArguments } from '@vueuse/core'
import type { CameraOptions, RendererOptions } from 'ogl'
import type { TemplateRef } from 'vue'
import { createEventHook, useDebounceFn, useRafFn } from '@vueuse/core'
import { Camera, Renderer, Transform } from 'ogl'
import { onUnmounted } from 'vue'
import { watchElementSize } from '../../_utils/custom-watch'

/**
 * OGL 选项类型
 */
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

/**
 * 使用 OGL
 *
 * @param templateRef - OGL 容器的模板引用
 * @param options - OGL 选项
 * @returns OGL 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useOGL } from '@oiij/ogl'
 *
 * const canvasRef = ref()
 * const { scene, gl, onLoop } = useOGL(canvasRef)
 *
 * onLoop(({ renderer }) => {
 *   // 在这里添加渲染逻辑
 * })
 * </script>
 *
 * <template>
 *   <div ref="canvasRef" style="width: 100%; height: 400px;"></div>
 * </template>
 * ```
 */
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

  /**
   * 调整大小
   *
   * @param width - 宽度
   * @param height - 高度
   */
  function resize(width: number, height: number) {
    const aspect = width / height
    const dpr = window.devicePixelRatio ?? 1
    renderer.setSize(width * dpr, height * dpr)
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    onResizedEvent.trigger({ width, height, aspect, dpr })
  }

  const debounceResize = useDebounceFn(resize, 100)

  /**
   * 创建 OGL 实例
   */
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

  /**
   * 销毁 OGL 实例
   *
   * @example
   * ```ts
   * import { useOGL } from '@oiij/ogl'
   *
   * const { dispose } = useOGL(canvasRef)
   * // 当需要销毁时调用
   * dispose()
   * ```
   */
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
