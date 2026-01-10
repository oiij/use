import type { ColorRepresentation } from 'three'
import { AmbientLight, DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, PointLight, PointLightHelper, RectAreaLight, SpotLight, SpotLightHelper } from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { watchVisible } from './_utils'

// 环境光插件
type AmbientLightOptions = {
  color?: ColorRepresentation
  intensity?: number
}

export function useAmbientLight(options?: AmbientLightOptions) {
  const { color, intensity } = options ?? {}
  const ambientLight = new AmbientLight(color, intensity)

  const { show } = watchVisible(ambientLight)
  return {
    show,
    ambientLight,
  }
}

// 平行光插件
type DirectionalLightOptions = {
  color?: ColorRepresentation
  intensity?: number
  position?: [number, number, number]
  castShadow?: boolean
}
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

// 半球光插件
type HemisphereLightOptions = {
  skyColor?: ColorRepresentation
  groundColor?: ColorRepresentation
  intensity?: number
  helperSize?: number
  helperColor?: ColorRepresentation
  position?: [number, number, number]
}
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
// 点光源插件
type PointLightOptions = {
  color?: ColorRepresentation
  intensity?: number
  distance?: number
  decay?: number
}
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

// 平面光插件
type RectAreaLightOptions = {
  color?: ColorRepresentation
  intensity?: number
  width?: number
  height?: number
  position?: [number, number, number]
  lookAt?: [number, number, number]
}
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
// 聚光灯插件
type SpotLightOptions = {
  color?: ColorRepresentation
  intensity?: number
  distance?: number
  angle?: number
  penumbra?: number
  decay?: number
  position?: [number, number, number]
}
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
