# UseViewTransition

## Demo

<demo vue="./demos/use-view-transition.vue" title="UseViewTransition" />

## Types

```ts
interface ViewTransitionOptions {
  duration?: number
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  effect?: boolean
  reverseSelector?: string
}
declare function useViewTransition(options?: ViewTransitionOptions): {
  run: (cb: () => void, opt?: {
    reverse?: boolean
    x: number
    y: number
  }) => Promise<void>
}
```
