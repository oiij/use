import type { Mesh, Object3D, PerspectiveCamera, WebGLRenderer } from 'three'
import { Raycaster, Vector2, Vector3 } from 'three'

/**
 * 检测鼠标与对象相交
 *
 * @param renderer - WebGL 渲染器
 * @param camera - 透视相机
 * @param obj - 要检测的对象或对象数组
 * @param event - 鼠标事件
 * @returns 相交结果数组
 *
 * @example
 * ```ts
 * import { onIntersectObject } from '@oiij/three-js/utils'
 *
 * // 监听点击事件
 * renderer.domElement.addEventListener('click', (event) => {
 *   const intersects = onIntersectObject(renderer, camera, objects, event)
 *   if (intersects.length > 0) {
 *     console.log('相交的对象:', intersects[0].object)
 *   }
 * })
 * ```
 */
export function onIntersectObject(renderer: WebGLRenderer, camera: PerspectiveCamera, obj: Object3D | Object3D[], event: PointerEvent | MouseEvent) {
  // 鼠标设备坐标
  const mouse = new Vector2(1, 1)
  // 创建一个射线投射器
  const raycaster = new Raycaster()
  // 判断是否相交

  const rect = renderer.domElement.getBoundingClientRect()
  // 计算鼠标点击位置的归一化设备坐标
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  // 计算射线与球体的相交情况
  const intersects = raycaster.intersectObjects(Array.isArray(obj) ? obj : [obj])

  return intersects
}

/**
 * 经纬度转球面坐标
 *
 * @param R - 球体半径
 * @param longitude - 经度
 * @param latitude - 纬度
 * @param offset - 偏移量
 * @returns 球面坐标向量
 *
 * @example
 * ```ts
 * import { lon2xyz } from '@oiij/three-js/utils'
 *
 * // 将经纬度转换为球面坐标
 * const position = lon2xyz(1, 0, 0) // 经度0度，纬度0度
 * console.log(position) // Vector3(1, 0, 0)
 * ```
 */
export function lon2xyz(R: number, longitude: number, latitude: number, offset = 1) {
  let lon = longitude * Math.PI / 180 // 转弧度值
  const lat = latitude * Math.PI / 180 // 转弧度值
  lon = -lon // js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  const x = R * offset * Math.cos(lat) * Math.cos(lon)
  const y = R * offset * Math.sin(lat)
  const z = R * offset * Math.cos(lat) * Math.sin(lon)

  return new Vector3(x, y, z)
}

/**
 * 判断对象是否为网格
 *
 * @param object - 要判断的对象
 * @returns 是否为网格
 *
 * @example
 * ```ts
 * import { isMesh } from '@oiij/three-js/utils'
 *
 * // 判断对象是否为网格
 * if (isMesh(object)) {
 *   // 处理网格对象
 *   console.log('这是一个网格对象')
 * }
 * ```
 */
export function isMesh(object?: Object3D): object is Mesh {
  return object?.type === 'Mesh'
}
