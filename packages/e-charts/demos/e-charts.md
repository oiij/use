# UseECharts

## 功能描述

**UseECharts** 是一个用于集成 ECharts 的 Vue 组合式函数，支持图表配置、暗黑模式切换、响应式调整和事件监听，可用于创建交互式数据可视化图表。

## 安装

```bash
# 使用 npm
npm install @oiij/e-charts

# 使用 yarn
yarn add @oiij/e-charts

# 使用 pnpm
pnpm add @oiij/e-charts
```

## 基本使用

<demo vue="./e-charts.vue" title="UseECharts" />

## API

### 函数签名

```ts
declare function useECharts(templateRef: TemplateRef<HTMLElement>, options?: UseEChartsOptions): UseEChartsReturns
declare function register(ext: Parameters<typeof use>[0]): void
```

## 类型定义

```ts
type EChartsOption = ComposeOption<BarSeriesOption | LineSeriesOption | PieSeriesOption | TitleComponentOption | LegendComponentOption | TooltipComponentOption | GridComponentOption | ToolboxComponentOption | DatasetComponentOption>
type UseEChartsOptions = {
  chartOption?: MaybeRefOrGetter<EChartsOption>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: EChartsInitOpts
  debug?: boolean
}
export type UseEChartsReturns = {
  templateRef: Readonly<ShallowRef<HTMLElement | null>>
  eChartInst: ShallowRef<ECharts | null>
  chartOptionRef: Ref<EChartsOption | undefined>
  darkModeRef: Ref<boolean | undefined>
  onRender: EventHookOn<[ECharts]>
  onUpdate: EventHookOn<[EChartsOption]>
  onResize: EventHookOn<[{
    width: number
    height: number
  }]>
  onDispose: EventHookOn<any>
}
declare const BASE_CHARTS: (typeof BarChart)[]
declare function register(ext: Parameters<typeof use>[0]): void
declare function useECharts(templateRef: TemplateRef<HTMLElement>, options?: UseEChartsOptions): UseEChartsReturns
```
