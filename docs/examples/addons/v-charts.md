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
// #region src/index.d.ts
declare const REGISTER_BASE: (() => void)[]
declare const REGISTER_POLAR: (() => void)[]
declare const REGISTER_CARTESIAN: (() => void)[]
declare const BASE_CHARTS: (() => void)[]
declare function register(comps: (() => void)[]): void
type UseVChartsOptions = {
  chartOption?: MaybeRefOrGetter<ISpec>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: IInitOption
  debug?: boolean
}
declare function useVCharts(templateRef: TemplateRef<HTMLElement>, options?: UseVChartsOptions): {
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  vChartInst: vue0.ShallowRef<VChart | null, VChart | null>
  chartOptionsRef: Ref<ISpec | undefined, ISpec | undefined>
  darkModeRef: Ref<boolean | undefined, boolean | undefined>
  onRender: _vueuse_core0.EventHookOn<[VChart]>
  onUpdate: _vueuse_core0.EventHookOn<[ISpec]>
  onResize: _vueuse_core0.EventHookOn<[{
    width: number
    height: number
  }]>
  onDispose: _vueuse_core0.EventHookOn<any>
}
// #endregion
export { BASE_CHARTS, type ISpec, register, REGISTER_BASE, REGISTER_CARTESIAN, REGISTER_POLAR, useVCharts, UseVChartsOptions, VChart }
```
