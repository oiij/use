import { World } from 'cannon-es'

export function cannonPlugin() {
  const world = new World()
  return {
    world,
  }
}
