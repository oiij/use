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
type EChartsOption = ComposeOption<BarSeriesOption | LineSeriesOption | PieSeriesOption | TitleComponentOption | LegendComponentOption | TooltipComponentOption | GridComponentOption | ToolboxComponentOption | DatasetComponentOption>
declare const baseChat: (typeof BarChart)[]
declare function register(ext: Parameters<typeof use>[0]): void
declare function useECharts(options?: Ref<EChartsOption> | EChartsOption, darkMode?: ComputedRef<boolean>, initOptions?: EChartsInitOpts): {
  domRef: vue0.ShallowRef<HTMLElement | undefined, HTMLElement | undefined>
  eChart: vue0.ShallowRef<ECharts | undefined, ECharts | undefined>
  options: Ref<EChartsOption | undefined, EChartsOption | undefined>
  onRender: _vueuse_core2.EventHookOn<ECharts>
  onUpdate: _vueuse_core2.EventHookOn<EChartsOption>
  onResize: _vueuse_core2.EventHookOn<{
    width: number
    height: number
  }>
  onDispose: _vueuse_core2.EventHookOn<any>
}
```
