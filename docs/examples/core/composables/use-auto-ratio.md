# UseAutoRatio

## Demo

<demo vue="./demos/use-auto-ratio.vue" title="UseAutoRatio" />

## Types

```ts
declare function useAutoRatio(ratio?: number, target?: MaybeComputedElementRef): {
  domRef: vue37.Ref<HTMLElement | undefined, HTMLElement | undefined>
  width: vue37.ComputedRef<number>
  height: vue37.ComputedRef<number>
}
```
