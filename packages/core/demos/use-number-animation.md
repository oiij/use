# UseNumberAnimation

## Demo

<demo vue="./use-number-animation.vue" title="UseNumberAnimation" />

## Types

```ts
// #region src/use-number-animation.d.ts
type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | ((t: number) => number)
type NumberAnimationOptions = {
  from?: number
  manual?: boolean
  duration?: number
  precision?: number
  easing?: EasingFunction
}
declare function useNumberAnimation(to: Ref<number> | number, options?: NumberAnimationOptions): {
  value: Readonly<Ref<string, string>>
  isActive: Readonly<vue63.ShallowRef<boolean>>
  start: () => void
  stop: () => void
  pause: _vueuse_core25.Fn
  resume: _vueuse_core25.Fn
  onStart: _vueuse_core25.EventHookOn<[]>
  onEnd: _vueuse_core25.EventHookOn<[]>
  onProgress: _vueuse_core25.EventHookOn<[number]>
}
type UseNumberAnimationReturns = ReturnType<typeof useNumberAnimation>
// #endregion
export { useNumberAnimation, UseNumberAnimationReturns }
```
