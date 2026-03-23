# @oiij/e-charts

[![NPM version](https://img.shields.io/npm/v/@oiij/e-charts)](https://www.npmjs.com/package/@oiij/e-charts)
[![MIT-license](https://img.shields.io/npm/l/@oiij/e-charts)](https://github.com/oiij/use/blob/main/packages/e-charts/LICENSE)

## 简介

Use ECharts 是基于 Apache ECharts 的 Vue 3 组合式函数封装，提供便捷的图表渲染功能，帮助开发者快速构建数据可视化应用。

## 特点

### 📊 图表丰富

- 📈 内置柱状图、折线图、饼图
- 🔌 支持扩展注册更多图表类型
- ⚙️ 提供丰富的配置选项

### 🔄 响应式设计

- 📐 自动响应容器尺寸变化
- ⏱️ 支持防抖 resize
- 📱 自适应屏幕尺寸

### 🌙 暗黑模式

- 🌓 支持暗黑模式切换
- 🔄 自动重建图表应用主题

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/e-charts

# 使用 npm
npm install @oiij/e-charts

# 使用 yarn
yarn add @oiij/e-charts
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `echarts`: ^5.0.0

## 示例

### 基础使用

```vue
<script setup>
import { useECharts } from '@oiij/e-charts'
import { useTemplateRef } from 'vue'

const { chartOption } = useECharts(useTemplateRef('chart'), {
  chartOption: {
    title: { text: '销售数据' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [120, 200, 150, 80, 70] }]
  }
})
</script>

<template>
  <div ref="chart" style="width: 100%; height: 400px;" />
</template>
```

### 响应式配置

```vue
<script setup>
import { useECharts } from '@oiij/e-charts'
import { computed, ref, useTemplateRef } from 'vue'

const salesData = ref([120, 200, 150, 80, 70])

const chartOption = computed(() => ({
  title: { text: '销售数据' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: salesData.value }]
}))

const { onRendered, onUpdate } = useECharts(useTemplateRef('chart'), {
  chartOption
})

onRendered((instance) => {
  console.log('图表渲染完成', instance)
})

onUpdate((option) => {
  console.log('配置更新', option)
})
</script>

<template>
  <div ref="chart" style="width: 100%; height: 400px;" />
</template>
```

### 暗黑模式

```vue
<script setup>
import { useECharts } from '@oiij/e-charts'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)

const { setDarkMode } = useECharts(useTemplateRef('chart'), {
  chartOption: { /* ... */ },
  darkMode
})
</script>

<template>
  <button @click="darkMode = !darkMode">
    切换主题
  </button>
  <div ref="chart" style="width: 100%; height: 400px;" />
</template>
```

### 注册扩展图表

```ts
import { register } from '@oiij/e-charts'
import { RadarChart, ScatterChart } from 'echarts/charts'

// 注册额外的图表类型
register([RadarChart, ScatterChart])
```

## API

### `useECharts(templateRef, options?)`

使用 ECharts 创建图表。

#### 参数

| 参数          | 类型                       | 说明               |
| ------------- | -------------------------- | ------------------ |
| `templateRef` | `TemplateRef<HTMLElement>` | 图表容器的模板引用 |
| `options`     | `UseEChartsOptions`        | 图表配置选项       |

#### UseEChartsOptions

| 选项          | 类型                              | 默认值  | 说明               |
| ------------- | --------------------------------- | ------- | ------------------ |
| `chartOption` | `MaybeRefOrGetter<EChartsOption>` | -       | ECharts 配置       |
| `darkMode`    | `MaybeRefOrGetter<boolean>`       | `false` | 是否开启暗黑模式   |
| `initOptions` | `EChartsInitOpts`                 | -       | ECharts 初始化选项 |

#### 返回值

| 属性                     | 类型                          | 说明             |
| ------------------------ | ----------------------------- | ---------------- |
| `templateRef`            | `TemplateRef<HTMLElement>`    | 图表容器引用     |
| `eChartInst`             | `ShallowRef<ECharts \| null>` | ECharts 实例     |
| `chartOption`            | `Ref<EChartsOption>`          | 图表配置         |
| `darkMode`               | `Ref<boolean>`                | 暗黑模式状态     |
| `setOption(option?)`     | `Function`                    | 设置图表配置     |
| `setDarkMode(darkMode?)` | `Function`                    | 设置暗黑模式     |
| `onRendered(callback)`   | `Function`                    | 图表渲染完成事件 |
| `onUpdate(callback)`     | `Function`                    | 配置更新事件     |
| `onResize(callback)`     | `Function`                    | 容器尺寸变化事件 |
| `onDispose(callback)`    | `Function`                    | 图表销毁事件     |

### `register(ext)`

注册 ECharts 扩展组件。

#### 参数

| 参数  | 类型                        | 说明         |
| ----- | --------------------------- | ------------ |
| `ext` | `Parameters<typeof use>[0]` | 扩展组件数组 |

## 内置图表类型

- `BarChart` - 柱状图
- `LineChart` - 折线图
- `PieChart` - 饼图

## 类型定义

```ts
import type { ECharts, EChartsInitOpts } from 'echarts/core'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type EChartsOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>

export type UseEChartsOptions = {
  chartOption?: MaybeRefOrGetter<EChartsOption>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: EChartsInitOpts
}

export type UseEChartsReturns = {
  templateRef: TemplateRef<HTMLElement>
  eChartInst: ShallowRef<ECharts | null>
  chartOption: Ref<EChartsOption | undefined>
  darkMode: Ref<boolean | undefined>
  setOption: (option?: EChartsOption) => void
  setDarkMode: (darkMode?: boolean) => void
  onRendered: (callback: (instance: ECharts) => void) => void
  onUpdate: (callback: (option: EChartsOption) => void) => void
  onResize: (callback: (size: { width: number, height: number }) => void) => void
  onDispose: (callback: () => void) => void
}

export declare function useECharts(templateRef: TemplateRef<HTMLElement>, options?: UseEChartsOptions): UseEChartsReturns
export declare function register(ext: Parameters<typeof use>[0]): void
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/e-charts/e-charts)
