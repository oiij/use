# UseScrollView

## Demo

<demo vue="./demos/use-scroll-view.vue" title="UseScrollView" />

## Types

```ts
interface ScrollViewOptions {
  activeClassName?: string
  enableWheel?: boolean
  direction?: 'horizontal' | 'vertical'
}
declare function useScrollView(options?: ScrollViewOptions): {
  scrollRef: vue55.Ref<HTMLElement | undefined, HTMLElement | undefined>
  scrollToView: (options?: ScrollIntoViewOptions) => Promise<void>
}
```
