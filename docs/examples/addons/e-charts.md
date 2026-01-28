# UseECharts

[官方文档](https://echarts.apache.org/)

## 安装

```bash
pnpm add @oiij/e-charts
```

## 示例

<demo vue="./demos/e-charts.vue" />

## Types

```ts
// #region src/index.d.ts
type EChartsOption = ComposeOption<BarSeriesOption | LineSeriesOption | PieSeriesOption | TitleComponentOption | LegendComponentOption | TooltipComponentOption | GridComponentOption | ToolboxComponentOption | DatasetComponentOption>
declare const BASE_CHARTS: (typeof BarChart)[]
declare function register(ext: Parameters<typeof use>[0]): void
type UseEChartsOptions = {
  chartOption?: MaybeRefOrGetter<EChartsOption>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: EChartsInitOpts
  debug?: boolean
}
declare function useECharts(templateRef: TemplateRef<HTMLElement>, options?: UseEChartsOptions): {
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  eChartInst: vue0.ShallowRef<ECharts | null, ECharts | null>
  chartOptionRef: Ref<EChartsOption | undefined, EChartsOption | undefined>
  darkModeRef: Ref<boolean | undefined, boolean | undefined>
  onRender: _vueuse_core0.EventHookOn<[ECharts]>
  onUpdate: _vueuse_core0.EventHookOn<[EChartsOption]>
  onResize: _vueuse_core0.EventHookOn<[{
    width: number
    height: number
  }]>
  onDispose: _vueuse_core0.EventHookOn<any>
}
// #endregion
export { BASE_CHARTS, EChartsOption, register, useECharts, UseEChartsOptions }
```
