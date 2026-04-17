import type { TemplateRef } from 'vue'
import { useRafFn } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * SVG命名空间常量，用于创建SVG元素
 * @example
 * ```ts
 * const circle = document.createElementNS(SVG_NS, 'circle')
 * ```
 */
const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * 表示二维坐标系中的一个点
 * @example
 * ```ts
 * const point: Point = { x: 50, y: 100 }
 * ```
 */
export type Point = {
  x: number
  y: number
}

/**
 * 根据动画进度和细节缩放计算点位置的函数类型
 * @param progress - 动画进度，范围 0 到 1
 * @param detailScale - 细节调整的缩放因子
 * @returns 点坐标
 * @example
 * ```ts
 * const pointFn: PointFn = (progress, detailScale) => {
 *   const angle = progress * Math.PI * 2
 *   return {
 *     x: 50 + Math.cos(angle) * 30 * detailScale,
 *     y: 50 + Math.sin(angle) * 30 * detailScale
 *   }
 * }
 * ```
 */
export type PointFn = (progress: number, detailScale: number) => {
  x: number
  y: number
}

/**
 * 表示加载动画中的一个粒子
 * @example
 * ```ts
 * const particle: Particle = {
 *   x: 100,
 *   y: 150,
 *   radius: 2.5,
 *   opacity: 0.8
 * }
 * ```
 */
export type Particle = {
  x: number
  y: number
  radius: number
  opacity: number
}

/**
 * 加载动画的配置选项
 * @example
 * ```ts
 * // 使用默认值
 * const config: LoaderConfig = {}
 *
 * // 自定义配置
 * const config: LoaderConfig = {
 *   particleCount: 30,        // 自定义粒子数量
 *   durationMs: 3000,         // 自定义动画周期
 *   rotate: false             // 禁用旋转
 * }
 * ```
 */
export type LoaderConfig = {
  /**
   * 粒子数量
   * @default 91
   */
  particleCount?: number
  /**
   * 拖尾跨度（0-1之间）
   * @default 0.34
   */
  trailSpan?: number
  /**
   * 动画周期时长（毫秒）
   * @default 2400
   */
  durationMs?: number
  /**
   * 旋转周期时长（毫秒）
   * @default 45500
   */
  rotationDurationMs?: number
  /**
   * 脉冲周期时长（毫秒）
   * @default 4900
   */
  pulseDurationMs?: number
  /**
   * 描边宽度
   * @default 6.2
   */
  strokeWidth?: number
  /**
   * 是否启用旋转
   * @default false
   */
  rotate?: boolean
}

/**
 * 渲染器组合式函数的选项
 * @example
 * ```ts
 * const options: RendererOptions = {
 *   svgRef: svgGroupRef,     // SVG组元素的模板引用
 *   pathRef: pathRef,        // 路径元素的模板引用
 *   config: loaderConfig,    // 加载器配置
 *   point: calculatePoint    // 点位置计算函数
 * }
 * ```
 */
export type RendererOptions = {
  svgRef: TemplateRef<SVGGElement>
  pathRef: TemplateRef<SVGPathElement>
  config?: LoaderConfig
  point: PointFn
}

/**
 * 将进度值标准化到 [0, 1) 范围内
 * @param progress - 原始进度值
 * @returns 标准化后的进度值（0 到 1 之间）
 * @example
 * ```ts
 * normalizeProgress(1.5)   // 返回 0.5
 * normalizeProgress(-0.3)  // 返回 0.7
 * normalizeProgress(2.7)   // 返回 0.7
 * ```
 */
export function normalizeProgress(progress: number): number {
  return ((progress % 1) + 1) % 1
}

/**
 * 根据时间计算脉冲效果的细节缩放因子
 * @param time - 当前时间（毫秒）
 * @param pulseDurationMs - 一个脉冲周期的时长（毫秒）
 * @returns 缩放因子（约 0.52 到 1.0 之间）
 * @example
 * ```ts
 * // 假设脉冲周期为 1000ms
 * getDetailScale(0, 1000)     // 返回约 0.76（起始值）
 * getDetailScale(250, 1000)   // 返回约 1.0（最大值）
 * getDetailScale(500, 1000)   // 返回约 0.76（中间值）
 * getDetailScale(750, 1000)   // 返回约 0.52（最小值）
 * ```
 */
export function getDetailScale(time: number, pulseDurationMs: number): number {
  const pulseProgress = (time % pulseDurationMs) / pulseDurationMs
  const pulseAngle = pulseProgress * Math.PI * 2
  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48
}

/**
 * 根据时间计算旋转角度
 * @param time - 当前时间（毫秒）
 * @param rotationDurationMs - 一个完整旋转周期的时长（毫秒）
 * @param rotate - 是否启用旋转
 * @returns 旋转角度（度数）
 * @example
 * ```ts
 * // 旋转周期为 3000ms
 * getRotation(0, 3000, true)      // 返回 0
 * getRotation(750, 3000, true)    // 返回 -90
 * getRotation(1500, 3000, true)   // 返回 -180
 * getRotation(750, 3000, false)   // 返回 0（旋转被禁用）
 * ```
 */
export function getRotation(time: number, rotationDurationMs: number, rotate: boolean): number {
  if (!rotate)
    return 0
  return -((time % rotationDurationMs) / rotationDurationMs) * 360
}

/**
 * 从点函数构建SVG路径数据字符串
 * @param point - 用于计算路径上点的函数
 * @param detailScale - 细节调整的缩放因子
 * @param steps - 生成的步数（默认：480）
 * @returns SVG路径数据字符串
 * @example
 * ```ts
 * // 创建一个圆形路径
 * const circlePath = buildPath(
 *   (progress, scale) => ({
 *     x: 50 + Math.cos(progress * Math.PI * 2) * 30 * scale,
 *     y: 50 + Math.sin(progress * Math.PI * 2) * 30 * scale
 *   }),
 *   1.0,
 *   100
 * )
 * // 返回: "M 80.00 50.00 L 79.85 51.57 L ..."
 * ```
 */
export function buildPath(point: (progress: number, detailScale: number) => Point, detailScale: number, steps: number = 480): string {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const pointResult = point(index / steps, detailScale)
    return `${index === 0 ? 'M' : 'L'} ${pointResult.x.toFixed(2)} ${pointResult.y.toFixed(2)}`
  }).join(' ')
}

/**
 * 计算粒子在动画拖尾效果中的属性
 * @param index - 粒子在拖尾中的索引
 * @param progress - 当前动画进度
 * @param detailScale - 细节调整的缩放因子
 * @param particleCount - 粒子总数
 * @param trailSpan - 拖尾延伸的长度
 * @param point - 用于计算点位置的函数
 * @returns 包含位置、半径和透明度的粒子对象
 * @example
 * ```ts
 * const particle = getParticle(
 *   0,           // 第一个粒子（头部）
 *   0.5,         // 动画进度 50%
 *   1.0,         // 缩放因子
 *   20,          // 共 20 个粒子
 *   0.3,         // 拖尾跨度
 *   myPointFn    // 点计算函数
 * )
 * // 返回: { x: 100, y: 150, radius: 3.6, opacity: 1.0 }
 * ```
 */
export function getParticle(
  index: number,
  progress: number,
  detailScale: number,
  particleCount: number,
  trailSpan: number,
  point: PointFn,
): Particle {
  const tailOffset = index / (particleCount - 1)
  const pointResult = point(normalizeProgress(progress - tailOffset * trailSpan), detailScale)
  const fade = (1 - tailOffset) ** 0.56
  return {
    x: pointResult.x,
    y: pointResult.y,
    radius: 0.9 + fade * 2.7,
    opacity: 0.04 + fade * 0.96,
  }
}

/**
 * Vue组合式函数，用于渲染带有粒子和路径动画的SVG加载器
 * @param options - 渲染器的配置选项
 * @returns 包含初始化和清理函数的对象
 * @example
 * ```vue
 * <template>
 *   <svg width="100" height="100">
 *     <g ref="svgGroupRef">
 *       <path ref="pathRef" fill="none" stroke="currentColor" />
 *     </g>
 *   </svg>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { useRenderer } from './use-renderer'
 *
 * const svgGroupRef = ref<SVGGElement>()
 * const pathRef = ref<SVGPathElement>()
 *
 * const config = {
 *   particleCount: 20,
 *   trailSpan: 0.3,
 *   durationMs: 2000,
 *   rotationDurationMs: 3000,
 *   pulseDurationMs: 1500,
 *   strokeWidth: 2,
 *   rotate: true
 * }
 *
 * const pointFn = (progress: number, scale: number) => ({
 *   x: 50 + Math.cos(progress * Math.PI * 2) * 30 * scale,
 *   y: 50 + Math.sin(progress * Math.PI * 2) * 30 * scale
 * })
 *
 * useRenderer({
 *   svgRef: svgGroupRef,
 *   pathRef: pathRef,
 *   config,
 *   point: pointFn
 * })
 * </script>
 * ```
 */
export function useRenderer(options: RendererOptions) {
  const { svgRef, pathRef, point } = options
  /**
   * 合并用户配置与默认配置
   * 默认值：particleCount=91, trailSpan=0.34, durationMs=2400,
   * rotationDurationMs=45500, pulseDurationMs=4900, strokeWidth=6.2, rotate=false
   */
  const config: Required<LoaderConfig> = {
    particleCount: 91,
    trailSpan: 0.34,
    durationMs: 2400,
    rotationDurationMs: 45500,
    pulseDurationMs: 4900,
    strokeWidth: 6.2,
    rotate: true,
    ...options.config,
  }
  const particles = ref<SVGCircleElement[]>([])
  const startedAt = ref(performance.now())

  /**
   * 主渲染函数，在每个动画帧上调用
   * 更新SVG变换、路径和粒子的位置/属性
   */
  function render() {
    const now = performance.now()
    const time = now - startedAt.value
    const progress = (time % config.durationMs) / config.durationMs
    const detailScale = getDetailScale(time, config.pulseDurationMs)

    if (svgRef.value) {
      svgRef.value.setAttribute('transform', `rotate(${getRotation(time, config.rotationDurationMs, config.rotate)} 50 50)`)
    }

    if (pathRef.value) {
      pathRef.value.setAttribute('d', buildPath(point, detailScale))
    }

    particles.value.forEach((node, index) => {
      const particle = getParticle(
        index,
        progress,
        detailScale,
        config.particleCount,
        config.trailSpan,
        point,
      )
      node.setAttribute('cx', particle.x.toFixed(2))
      node.setAttribute('cy', particle.y.toFixed(2))
      node.setAttribute('r', particle.radius.toFixed(2))
      node.setAttribute('opacity', particle.opacity.toFixed(3))
    })
  }

  const { resume } = useRafFn(render)

  /**
   * 初始化渲染器 - 设置路径描边并创建粒子元素
   */
  function init() {
    if (pathRef.value) {
      pathRef.value.setAttribute('stroke-width', String(config.strokeWidth))
    }

    particles.value = Array.from({ length: config.particleCount }, () => {
      const circle = document.createElementNS(SVG_NS, 'circle')
      circle.setAttribute('fill', 'currentColor')
      if (svgRef.value) {
        svgRef.value.appendChild(circle)
      }
      return circle
    })
    startedAt.value = performance.now()
    resume()
  }

  /**
   * 清理DOM中的粒子元素
   */
  function cleanup() {
    particles.value.forEach((circle) => {
      if (circle.parentNode) {
        circle.parentNode.removeChild(circle)
      }
    })
    particles.value = []
  }

  onMounted(init)
  onUnmounted(cleanup)
  return {
    init,
    cleanup,
  }
}
