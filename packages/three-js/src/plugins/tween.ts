import type { Camera, Object3D } from 'three'
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Easing, Group, Tween } from '@tweenjs/tween.js'
import { Vector3 } from 'three'
import { useDisposable } from '../utils/_utils'

interface CameraTweenOptions {
  duration?: number
  easing?: typeof Easing['Linear']['None']
}
export function useTween() {
  const tweenGroup = new Group()
  function createTween<T extends Record<string, any>>(from: T) {
    const tween = new Tween<T>(from)
    tweenGroup.add(tween)
    return tween
  }
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
