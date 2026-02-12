import type { ColorRepresentation } from 'three'
import { AmbientLight, DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, PointLight, PointLightHelper, RectAreaLight, SpotLight, SpotLightHelper } from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { watchVisible } from './_utils'

/**
 * 环境光选项
 */
type AmbientLightOptions = {
  /**
   * 颜色
   */
  color?: ColorRepresentation
  /**
   * 强度
   */
  intensity?: number
}

/**
 * 使用环境光
 *
 * @param options - 环境光选项
 * @returns 环境光实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useAmbientLight } from '@oiij/three-js/utils'
 *
 * const { ambientLight, show } = useAmbientLight({
 *   color: 0xffffff,
 *   intensity: 0.5
 * })
 *
 * // 添加到场景
 * scene.add(ambientLight)
 *
 * // 控制可见性
 * show.value = false // 隐藏环境光
 * ```
 */
export function useAmbientLight(options?: AmbientLightOptions) {
  const { color, intensity } = options ?? {}
  const ambientLight = new AmbientLight(color, intensity)

  const { show } = watchVisible(ambientLight)
  return {
    show,
    ambientLight,
  }
}

/**
 * 平行光选项
 */
type DirectionalLightOptions = {
  /**
   * 颜色
   */
  color?: ColorRepresentation
  /**
   * 强度
   */
  intensity?: number
  /**
   * 位置
   * @default [1, 1, 1]
   */
  position?: [number, number, number]
  /**
   * 是否投射阴影
   * @default true
   */
  castShadow?: boolean
}

/**
 * 使用平行光
 *
 * @param options - 平行光选项
 * @returns 平行光实例、辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useDirectionalLight } from '@oiij/three-js/utils'
 *
 * const { directionalLight, directionalLightHelper, show, showHelper } = useDirectionalLight({
 *   color: 0xffffff,
 *   intensity: 1,
 *   position: [5, 5, 5],
 *   castShadow: true
 * })
 *
 * // 添加到场景
 * scene.add(directionalLight)
 * scene.add(directionalLightHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏平行光
 * showHelper.value = false // 隐藏平行光辅助线
 * ```
 */
export function useDirectionalLight(options?: DirectionalLightOptions) {
  const { color, intensity, position = [1, 1, 1], castShadow = true } = options ?? {}
  const directionalLight = new DirectionalLight(color, intensity)
  directionalLight.position.set(...position)
  directionalLight.castShadow = castShadow
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.radius = 3
  const directionalLightHelper = new DirectionalLightHelper(directionalLight)

  const { show } = watchVisible(directionalLight)
  const { show: showHelper } = watchVisible(directionalLightHelper)
  return {
    show,
    showHelper,
    directionalLight,
    directionalLightHelper,
  }
}

/**
 * 半球光选项
 */
type HemisphereLightOptions = {
  /**
   * 天空颜色
   */
  skyColor?: ColorRepresentation
  /**
   * 地面颜色
   */
  groundColor?: ColorRepresentation
  /**
   * 强度
   */
  intensity?: number
  /**
   * 辅助线大小
   * @default 5
   */
  helperSize?: number
  /**
   * 辅助线颜色
   */
  helperColor?: ColorRepresentation
  /**
   * 位置
   * @default [0, 1, 0]
   */
  position?: [number, number, number]
}

/**
 * 使用半球光
 *
 * @param options - 半球光选项
 * @returns 半球光实例、辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useHemisphereLight } from '@oiij/three-js/utils'
 *
 * const { hemisphereLight, hemisphereLightHelper, show, showHelper } = useHemisphereLight({
 *   skyColor: 0xffffff,
 *   groundColor: 0x000000,
 *   intensity: 1,
 *   position: [0, 10, 0]
 * })
 *
 * // 添加到场景
 * scene.add(hemisphereLight)
 * scene.add(hemisphereLightHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏半球光
 * showHelper.value = false // 隐藏半球光辅助线
 * ```
 */
export function useHemisphereLight(options?: HemisphereLightOptions) {
  const { skyColor, groundColor, intensity, helperSize = 5, helperColor, position = [0, 1, 0] } = options ?? {}
  const hemisphereLight = new HemisphereLight(skyColor, groundColor, intensity)
  hemisphereLight.position.set(...position)
  const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, helperSize, helperColor)

  const { show } = watchVisible(hemisphereLight)
  const { show: showHelper } = watchVisible(hemisphereLightHelper)
  return {
    show,
    hemisphereLight,
    showHelper,
    hemisphereLightHelper,
  }
}

/**
 * 点光源选项
 */
type PointLightOptions = {
  /**
   * 颜色
   */
  color?: ColorRepresentation
  /**
   * 强度
   */
  intensity?: number
  /**
   * 距离
   */
  distance?: number
  /**
   * 衰减
   */
  decay?: number
}

/**
 * 使用点光源
 *
 * @param options - 点光源选项
 * @returns 点光源实例、辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { usePointLight } from '@oiij/three-js/utils'
 *
 * const { pointLight, pointLightHelper, show, showHelper } = usePointLight({
 *   color: 0xffffff,
 *   intensity: 1,
 *   distance: 100,
 *   decay: 2
 * })
 *
 * // 添加到场景
 * scene.add(pointLight)
 * scene.add(pointLightHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏点光源
 * showHelper.value = false // 隐藏点光源辅助线
 * ```
 */
export function usePointLight(options?: PointLightOptions) {
  const { color, intensity, distance, decay } = options ?? {}
  const pointLight = new PointLight(color, intensity, distance, decay)
  const pointLightHelper = new PointLightHelper(pointLight)

  const { show } = watchVisible(pointLight)
  const { show: showHelper } = watchVisible(pointLightHelper)
  return {
    show,
    pointLight,
    showHelper,
    pointLightHelper,
  }
}

/**
 * 平面光选项
 */
type RectAreaLightOptions = {
  /**
   * 颜色
   */
  color?: ColorRepresentation
  /**
   * 强度
   * @default 1
   */
  intensity?: number
  /**
   * 宽度
   * @default 10
   */
  width?: number
  /**
   * 高度
   * @default 10
   */
  height?: number
  /**
   * 位置
   * @default [0, 0, 0]
   */
  position?: [number, number, number]
  /**
   * 看向的点
   * @default [0, 0, 0]
   */
  lookAt?: [number, number, number]
}

/**
 * 使用平面光
 *
 * @param options - 平面光选项
 * @returns 平面光实例、辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useRectAreaLight } from '@oiij/three-js/utils'
 *
 * const { rectAreaLight, rectAreaLightHelper, show, showHelper } = useRectAreaLight({
 *   color: 0xffffff,
 *   intensity: 1,
 *   width: 5,
 *   height: 5,
 *   position: [0, 0, 5],
 *   lookAt: [0, 0, 0]
 * })
 *
 * // 添加到场景
 * scene.add(rectAreaLight)
 * scene.add(rectAreaLightHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏平面光
 * showHelper.value = false // 隐藏平面光辅助线
 * ```
 */
export function useRectAreaLight(options?: RectAreaLightOptions) {
  RectAreaLightUniformsLib.init()
  const { color, intensity = 1, width = 10, height = 10, position = [0, 0, 0], lookAt = [0, 0, 0] } = options ?? {}
  const rectAreaLight = new RectAreaLight(color, intensity, width, height)
  rectAreaLight.position.set(...position)
  rectAreaLight.lookAt(...lookAt)
  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

  const { show } = watchVisible(rectAreaLight)
  const { show: showHelper } = watchVisible(rectAreaLightHelper)
  return {
    show,
    rectAreaLight,
    showHelper,
    rectAreaLightHelper,
  }
}

/**
 * 聚光灯选项
 */
type SpotLightOptions = {
  /**
   * 颜色
   */
  color?: ColorRepresentation
  /**
   * 强度
   * @default 1
   */
  intensity?: number
  /**
   * 距离
   */
  distance?: number
  /**
   * 角度
   */
  angle?: number
  /**
   * 半影
   */
  penumbra?: number
  /**
   * 衰减
   */
  decay?: number
  /**
   * 位置
   * @default [0, 0, 0]
   */
  position?: [number, number, number]
}

/**
 * 使用聚光灯
 *
 * @param options - 聚光灯选项
 * @returns 聚光灯实例、辅助线实例和控制可见性的响应式对象
 *
 * @example
 * ```ts
 * import { useSpotLight } from '@oiij/three-js/utils'
 *
 * const { spotLight, spotLightHelper, show, showHelper } = useSpotLight({
 *   color: 0xffffff,
 *   intensity: 1,
 *   distance: 100,
 *   angle: Math.PI / 4,
 *   penumbra: 0.1,
 *   decay: 2,
 *   position: [5, 5, 5]
 * })
 *
 * // 添加到场景
 * scene.add(spotLight)
 * scene.add(spotLightHelper)
 *
 * // 控制可见性
 * show.value = false // 隐藏聚光灯
 * showHelper.value = false // 隐藏聚光灯辅助线
 * ```
 */
export function useSpotLight(options?: SpotLightOptions) {
  RectAreaLightUniformsLib.init()
  const { color, intensity = 1, distance, angle, penumbra, decay, position = [0, 0, 0] } = options ?? {}
  const spotLight = new SpotLight(color, intensity, distance, angle, penumbra, decay)
  spotLight.position.set(...position)
  const spotLightHelper = new SpotLightHelper(spotLight)

  const { show } = watchVisible(spotLight)
  const { show: showHelper } = watchVisible(spotLightHelper)
  return {
    show,
    spotLight,
    showHelper,
    spotLightHelper,
  }
}
