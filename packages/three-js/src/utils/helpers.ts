import type { ColorRepresentation } from 'three'
import { ArrowHelper, AxesHelper, GridHelper, PolarGridHelper, Vector3 } from 'three'
import { watchVisible } from './_utils'

// 模拟方向插件
interface ArrowHelperOptions {
  dir?: [number, number, number] | Vector3
  origin?: [number, number, number] | Vector3
  length?: number
  color?: ColorRepresentation
  headLength?: number
  headWidth?: number
}
export function useArrowHelper(options?: ArrowHelperOptions) {
  const { dir = [1, 1, 1], origin = [0, 0, 0], length = 10, color = 'red', headLength = 1, headWidth = 1 } = options ?? {}
  const arrowHelper = new ArrowHelper(new Vector3(...dir), new Vector3(...origin), length, color, headLength, headWidth)

  const { show } = watchVisible(arrowHelper)
  return {
    show,
    arrowHelper,
  }
}
// 坐标轴插件
export function useAxesHelper(size?: number) {
  const axesHelper = new AxesHelper(size ?? 10)

  const { show } = watchVisible(axesHelper)
  return {
    show,
    axesHelper,
  }
}

// 网格插件
interface GridHelperOptions {
  size?: number
  divisions?: number
  colorCenterLine?: ColorRepresentation
  colorGrid?: ColorRepresentation
}
export function useGridHelper(options?: GridHelperOptions) {
  const { size = 10, divisions = 10, colorCenterLine, colorGrid } = options ?? {}
  const gridHelper = new GridHelper(size, divisions, colorCenterLine, colorGrid)

  const { show } = watchVisible(gridHelper)
  return {
    show,
    gridHelper,
  }
}
// 极坐标网格插件
interface PolarGridHelperOptions {
  radius?: number
  sectors?: number
  rings?: number
  divisions?: number
  color1?: ColorRepresentation
  color2?: ColorRepresentation
}
export function usePolarGridHelper(options?: PolarGridHelperOptions) {
  const { radius = 10, sectors = 16, rings = 8, divisions = 64, color1, color2 } = options ?? {}
  const polarGridHelper = new PolarGridHelper(radius, sectors, rings, divisions, color1, color2)

  const { show } = watchVisible(polarGridHelper)
  return {
    show,
    polarGridHelper,
  }
}
