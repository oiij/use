# UseContextMenu

## Demo

<demo vue="./use-context-menu.vue" title="UseContextMenu" />

## Types

```ts
declare function useContextMenu(): {
  domRef: vue34.Ref<HTMLElement | undefined, HTMLElement | undefined>
  x: vue34.Ref<number, number>
  y: vue34.Ref<number, number>
  show: vue34.Ref<boolean, boolean>
  hide: () => void
  contextMenuEvent: (e: MouseEvent) => void
}
```
