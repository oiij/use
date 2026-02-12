import type { ColorRepresentation } from 'three'
import { ArrowHelper, AxesHelper, GridHelper, PolarGridHelper, Vector3 } from 'three'
import { watchVisible } from './_utils'

/**
 * 箭头辅助线选项
 */
type ArrowHelperOptions = {
  /**
   * 方向向量
   * @default [1, 1, 1]
   */
  dir?: [number, number, number] | Vector3
  /**
   * 原点
   * @default [0, 0, 0]
   */
  origin?: [number, number, number] | Vector3
  /**
   * 长度
   * @default 10
   */
  length?: number
  /**
   * 颜色
   * @default 'red'
   */
  color?: ColorRepresentation
  /**
   * 箭头头部长度
   * @default 1
   */
  headLength?: number
  /**
   * 箭头头部宽度
   * @default 1
   */
  headWidth?: number
}

/**
 * 使用箭头辅助线
 *
 * @param options - 箭头辅助线选项
 * @returns 箭头辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useArrowHelper } from '@oiij/three-js/utils'
 *
 * const { arrowHelper, show } = useArrowHelper({
 *   dir: [1, 0, 0],
 *   length: 5,
 *   color: 'blue'
 * })
 *
 * // 添加到场景
 * scene.add(arrowHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏箭头辅助线
 * ```
 */
export function useArrowHelper(options?: ArrowHelperOptions) {
  const { dir = [1, 1, 1], origin = [0, 0, 0], length = 10, color = 'red', headLength = 1, headWidth = 1 } = options ?? {}
  const arrowHelper = new ArrowHelper(new Vector3(...dir), new Vector3(...origin), length, color, headLength, headWidth)

  const { show } = watchVisible(arrowHelper)
  return {
    show,
    arrowHelper,
  }
}

/**
 * 使用坐标轴辅助线
 *
 * @param size - 坐标轴大小
 * @returns 坐标轴辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useAxesHelper } from '@oiij/three-js/utils'
 *
 * const { axesHelper, show } = useAxesHelper(10)
 *
 * // 添加到场景
 * scene.add(axesHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏坐标轴辅助线
 * ```
 */
export function useAxesHelper(size?: number) {
  const axesHelper = new AxesHelper(size ?? 10)

  const { show } = watchVisible(axesHelper)
  return {
    show,
    axesHelper,
  }
}

/**
 * 网格辅助线选项
 */
type GridHelperOptions = {
  /**
   * 网格大小
   * @default 10
   */
  size?: number
  /**
   * 网格分割数
   * @default 10
   */
  divisions?: number
  /**
   * 中心线颜色
   */
  colorCenterLine?: ColorRepresentation
  /**
   * 网格线颜色
   */
  colorGrid?: ColorRepresentation
}

/**
 * 使用网格辅助线
 *
 * @param options - 网格辅助线选项
 * @returns 网格辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useGridHelper } from '@oiij/three-js/utils'
 *
 * const { gridHelper, show } = useGridHelper({
 *   size: 20,
 *   divisions: 20,
 *   colorCenterLine: 'red',
 *   colorGrid: 'gray'
 * })
 *
 * // 添加到场景
 * scene.add(gridHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏网格辅助线
 * ```
 */
export function useGridHelper(options?: GridHelperOptions) {
  const { size = 10, divisions = 10, colorCenterLine, colorGrid } = options ?? {}
  const gridHelper = new GridHelper(size, divisions, colorCenterLine, colorGrid)

  const { show } = watchVisible(gridHelper)
  return {
    show,
    gridHelper,
  }
}

/**
 * 极坐标网格辅助线选项
 */
type PolarGridHelperOptions = {
  /**
   * 半径
   * @default 10
   */
  radius?: number
  /**
   * 扇形数量
   * @default 16
   */
  sectors?: number
  /**
   * 圆环数量
   * @default 8
   */
  rings?: number
  /**
   * 分割数
   * @default 64
   */
  divisions?: number
  /**
   * 颜色1
   */
  color1?: ColorRepresentation
  /**
   * 颜色2
   */
  color2?: ColorRepresentation
}

/**
 * 使用极坐标网格辅助线
 *
 * @param options - 极坐标网格辅助线选项
 * @returns 极坐标网格辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { usePolarGridHelper } from '@oiij/three-js/utils'
 *
 * const { polarGridHelper, show } = usePolarGridHelper({
 *   radius: 15,
 *   sectors: 24,
 *   rings: 12,
 *   color1: 'red',
 *   color2: 'blue'
 * })
 *
 * // 添加到场景
 * scene.add(polarGridHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏极坐标网格辅助线
 * ```
 */
export function usePolarGridHelper(options?: PolarGridHelperOptions) {
  const { radius = 10, sectors = 16, rings = 8, divisions = 64, color1, color2 } = options ?? {}
  const polarGridHelper = new PolarGridHelper(radius, sectors, rings, divisions, color1, color2)

  const { show } = watchVisible(polarGridHelper)
  return {
    show,
    polarGridHelper,
  }
}
