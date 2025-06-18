# UseTypeWriter

## Demo

<demo vue="./demos/use-type-writer.vue" title="UseTypeWriter" />

## Types

```ts
interface TypeWriterOptions {
  step?: number
  interval?: number
  enabled?: boolean
}
declare function useTypeWriter(value: Ref<string> | ComputedRef<string>, options?: TypeWriterOptions): {
  typeIndex: Ref<number, number>
  paused: Ref<boolean, boolean>
  ended: Ref<boolean, boolean>
  isTyping: Ref<boolean, boolean>
  typedValue: ComputedRef<string>
  progress: ComputedRef<number>
  start: () => void
  pause: () => void
  resume: () => void
  restart: () => void
  stop: () => void
  destroy: () => void
  onStat: _vueuse_core59.EventHookOn<void>
  onStop: _vueuse_core59.EventHookOn<string>
  onUpdate: _vueuse_core59.EventHookOn<{
    index: number
    value: string
  }>
}
```
