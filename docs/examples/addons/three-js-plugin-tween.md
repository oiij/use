# UseThreeJs

官方文档 [ThreeJs](https://threejs.org/) [Tween](https://tweenjs.github.io/tween.js/docs/user_guide_zh-CN.html)

## 安装

```bash
pnpm add @oiij/three-js
```

## 示例

### Base

<demo vue="./demos/three-js-plugin-tween.vue"  />

## Types

```ts
type CameraTweenOptions = {
  duration?: number
  easing?: typeof Easing['Linear']['None']
}
declare function useTween(): {
  tweenGroup: Group$1
  update: (time?: number) => void
  createTween: <T extends Record<string, any>>(from: T) => Tween<T>
  cameraTween: (camera: Camera, controls: OrbitControls, target: {
    x: number
    y: number
    z: number
    targetX: number
    targetY: number
    targetZ: number
  }, options?: CameraTweenOptions) => Tween<{ x: number, y: number, z: number, targetX: number, targetY: number, targetZ: number }>
  lookAtObject: (camera: Camera, controls: OrbitControls, obj: Object3D, scalar?: number) => Tween<{
    x: number
    y: number
    z: number
    targetX: number
    targetY: number
    targetZ: number
  }>
  dispose: () => void
}
```
