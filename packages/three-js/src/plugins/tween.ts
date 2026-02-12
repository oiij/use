import type { Camera, Object3D } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Easing, Group, Tween } from '@tweenjs/tween.js'
import { Vector3 } from 'three'
import { useDisposable } from '../utils/_utils'

/**
 * 相机补间选项
 */
type CameraTweenOptions = {
  /**
   * 持续时间（毫秒）
   * @default 1000
   */
  duration?: number
  /**
   * 缓动函数
   * @default Easing.Quadratic.InOut
   */
  easing?: typeof Easing['Linear']['None']
}

/**
 * 使用补间动画
 *
 * @returns 补间动画组和控制方法
 *
 * @example
 * ```ts
 * import { useTween } from '@oiij/three-js/plugins'
 *
 * const { tweenGroup, update, createTween, cameraTween, lookAtObject, dispose } = useTween()
 *
 * // 创建基础补间
 * const tween = createTween({ x: 0 })
 *   .to({ x: 100 }, 1000)
 *   .onUpdate(({ x }) => {
 *     mesh.position.x = x
 *   })
 *   .start()
 *
 * // 相机移动补间
 * cameraTween(camera, controls, {
 *   x: 5,
 *   y: 5,
 *   z: 5,
 *   targetX: 0,
 *   targetY: 0,
 *   targetZ: 0
 * })
 *
 * // 看向物体
 * lookAtObject(camera, controls, mesh)
 *
 * // 在动画循环中更新
 * function animate() {
 *   update()
 *   requestAnimationFrame(animate)
 * }
 * ```
 */
export function useTween() {
  const tweenGroup = new Group()

  /**
   * 创建补间动画
   *
   * @param from - 起始值
   * @returns 补间实例
   */
  function createTween<T extends Record<string, any>>(from: T) {
    const tween = new Tween<T>(from)
    tweenGroup.add(tween)
    return tween
  }

  /**
   * 相机移动补间
   *
   * @param camera - 相机
   * @param controls - 轨道控制器
   * @param target - 目标位置和目标点
   * @param target.x - 目标位置的 x 坐标
   * @param target.y - 目标位置的 y 坐标
   * @param target.z - 目标位置的 z 坐标
   * @param target.targetX - 目标点的 x 坐标
   * @param target.targetY - 目标点的 y 坐标
   * @param target.targetZ - 目标点的 z 坐标
   * @param options - 补间选项
   * @returns 补间实例
   */
  function cameraTween(camera: Camera, controls: OrbitControls, target: { x: number, y: number, z: number, targetX: number, targetY: number, targetZ: number }, options?: CameraTweenOptions) {
    const { duration = 1000, easing = Easing.Quadratic.InOut } = options ?? {}
    const { x, y, z } = camera.position
    const { x: targetX, y: targetY, z: targetZ } = controls.target

    const tween = createTween({
      x,
      y,
      z,
      targetX,
      targetY,
      targetZ,
    }).to(target, duration).onUpdate(({ x, y, z, targetX, targetY, targetZ }) => {
      camera.position.set(x, y, z)
      controls.target.set(targetX, targetY, targetZ)
      controls.update()
    }).easing(easing).start()

    return tween
  }

  /**
   * 相机看向物体
   *
   * @param camera - 相机
   * @param controls - 轨道控制器
   * @param obj - 目标物体
   * @param scalar - 距离物体的距离
   * @returns 补间实例
   */
  function lookAtObject(camera: Camera, controls: OrbitControls, obj: Object3D, scalar = 5) {
    const target = new Vector3()
    obj.getWorldPosition(target)
    const position = target.clone().addScalar(scalar)
    return cameraTween(camera, controls, {
      x: position.x,
      y: position.y,
      z: position.z,
      targetX: target.x,
      targetY: target.y,
      targetZ: target.z,
    })
  }

  /**
   * 更新补间动画
   *
   * @param time - 时间（可选）
   */
  function update(time?: number) {
    tweenGroup.update(time)
  }

  const dispose = useDisposable(() => {
    tweenGroup.removeAll()
  })

  return {
    tweenGroup,
    update,
    createTween,
    cameraTween,
    lookAtObject,
    dispose,
  }
}
