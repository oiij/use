# UseVCharts

[官方文档](https://www.visactor.io/vchart)

## 安装

```bash
pnpm add @oiij/v-charts
```

## 示例

<demo vue="./demos/v-charts.vue" />

## Types

```ts
declare const registerBase: (() => void)[]
declare const registerPolar: (() => void)[]
declare const registerCartesian: (() => void)[]
declare const baseChat: (() => void)[]
declare function register(comps: (() => void)[]): void
declare function useVCharts(options?: Ref<ISpec> | ISpec, darkMode?: ComputedRef<boolean>, initOptions?: IInitOption & {
  treeShaking?: boolean
}): {
  domRef: Ref<HTMLElement | undefined, HTMLElement | undefined>
  vChart: vue0.ShallowRef<VChart | undefined, VChart | undefined>
  options: Ref<ISpec | undefined, ISpec | undefined>
  onRender: _vueuse_core1.EventHookOn<VChart>
  onUpdate: _vueuse_core1.EventHookOn<ISpec>
  onResize: _vueuse_core1.EventHookOn<{
    width: number
    height: number
  }>
  onDispose: _vueuse_core1.EventHookOn<any>
}
```
