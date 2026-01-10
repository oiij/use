# UseNumberAnimation

## Demo

<demo vue="./demos/use-number-animation.vue" title="UseNumberAnimation" />

## Types

```ts
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
  isActive: Readonly<vue53.ShallowRef<boolean>>
  start: () => void
  stop: () => void
  pause: _vueuse_core54.Fn
  resume: _vueuse_core54.Fn
  onStart: _vueuse_core54.EventHookOn<[]>
  onEnd: _vueuse_core54.EventHookOn<[]>
  onProgress: _vueuse_core54.EventHookOn<[number]>
}
```
