# UseVCharts

## 功能描述

**UseVCharts** 是一个基于 VChart 的图表库 Vue 组合式函数，提供了丰富的图表类型和配置选项，支持响应式更新和主题切换，适用于各种数据可视化场景。

## 安装

```bash
# 使用 npm
npm install @oiij/v-charts

# 使用 yarn
yarn add @oiij/v-charts

# 使用 pnpm
pnpm add @oiij/v-charts
```

## 基本使用

<demo vue="./v-charts.vue" />

## API

### 函数签名

```ts
declare function useVCharts(templateRef: TemplateRef<HTMLElement>, options?: UseVChartsOptions): UseVChartsReturns
declare function register(comps: (() => void)[]): void
```

## 类型定义

```ts
type UseVChartsOptions = {
  chartOption?: MaybeRefOrGetter<ISpec>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: IInitOption
  debug?: boolean
}

type UseVChartsReturns = {
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

declare const REGISTER_BASE: (() => void)[]
declare const REGISTER_POLAR: (() => void)[]
declare const REGISTER_CARTESIAN: (() => void)[]
declare const BASE_CHARTS: (() => void)[]
```
