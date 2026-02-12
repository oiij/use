import { World } from 'cannon-es'

/**
 * Cannon.js 物理引擎插件
 *
 * @returns Cannon.js 世界实例
 *
 * @example
 * ```ts
 * import { cannonPlugin } from '@oiij/three-js/plugins'
 *
 * const { world } = cannonPlugin()
 *
 * // 设置重力
 * world.gravity.set(0, -9.82, 0)
 *
 * // 添加物理对象
 * const body = new CANNON.Body({
 *   mass: 1,
 *   shape: new CANNON.Sphere(0.5)
 * })
 * world.addBody(body)
 * ```
 */
export function cannonPlugin() {
  const world = new World()
  return {
    world,
  }
}
