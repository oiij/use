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
declare function useVCharts(templateRef: TemplateRef<HTMLElement>, options?: Ref<ISpec> | ComputedRef<ISpec> | ISpec, darkMode?: Ref<boolean> | ComputedRef<boolean>, initOptions?: IInitOption & {
  treeShaking?: boolean
}): {
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  vChart: vue0.ShallowRef<VChart | null, VChart | null>
  options: Ref<ISpec | undefined, ISpec | undefined>
  onRender: _vueuse_core0.EventHookOn<VChart>
  onUpdate: _vueuse_core0.EventHookOn<ISpec>
  onResize: _vueuse_core0.EventHookOn<{
    width: number
    height: number
  }>
  onDispose: _vueuse_core0.EventHookOn<any>
}
```
