import type { Mesh, Object3D, PerspectiveCamera, WebGLRenderer } from 'three'
import { Raycaster, Vector2, Vector3 } from 'three'

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

export function isMesh(object?: Object3D): object is Mesh {
  return object?.type === 'Mesh'
}
