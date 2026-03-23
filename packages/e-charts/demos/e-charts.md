# UseECharts

## 功能描述

**UseECharts** 是一个用于集成 ECharts 的 Vue 组合式函数，支持图表配置、暗黑模式切换、响应式调整和事件监听，可用于创建交互式数据可视化图表。

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

## 基本使用

<demo vue="./e-charts.vue" title="UseECharts" />

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
  /**
   * 图表配置
   */
  chartOption?: MaybeRefOrGetter<EChartsOption>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 初始化选项
   */
  initOptions?: EChartsInitOpts
}

export type UseEChartsReturns = {
  /**
   * 图表容器引用
   */
  templateRef: TemplateRef<HTMLElement>
  /**
   * ECharts 实例
   */
  eChartInst: ShallowRef<ECharts | null>
  /**
   * 图表配置
   */
  chartOption: Ref<EChartsOption | undefined>
  /**
   * 暗黑模式状态
   */
  darkMode: Ref<boolean | undefined>
  /**
   * 设置图表配置
   */
  setOption: (option?: EChartsOption) => void
  /**
   * 设置暗黑模式
   */
  setDarkMode: (darkMode?: boolean) => void
  /**
   * 图表渲染完成事件
   */
  onRendered: (callback: (instance: ECharts) => void) => void
  /**
   * 配置更新事件
   */
  onUpdate: (callback: (option: EChartsOption) => void) => void
  /**
   * 容器尺寸变化事件
   */
  onResize: (callback: (size: { width: number, height: number }) => void) => void
  /**
   * 图表销毁事件
   */
  onDispose: (callback: () => void) => void
}

export declare function useECharts(templateRef: TemplateRef<HTMLElement>, options?: UseEChartsOptions): UseEChartsReturns
export declare function register(ext: Parameters<typeof use>[0]): void
```

## 使用示例

### 基础柱状图

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

### 饼图

```vue
<script setup>
import { useECharts } from '@oiij/e-charts'
import { useTemplateRef } from 'vue'

const { chartOption } = useECharts(useTemplateRef('chart'), {
  chartOption: {
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' }
      ]
    }]
  }
})
</script>

<template>
  <div ref="chart" style="width: 100%; height: 400px;" />
</template>
```

### 响应式数据

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

const { onUpdate } = useECharts(useTemplateRef('chart'), { chartOption })

onUpdate((option) => {
  console.log('配置更新', option)
})

// 更新数据会自动触发图表更新
function updateData() {
  salesData.value = salesData.value.map(v => v + Math.random() * 100)
}
</script>

<template>
  <button @click="updateData">
    更新数据
  </button>
  <div ref="chart" style="width: 100%; height: 400px;" />
</template>
```

### 暗黑模式

```vue
<script setup>
import { useECharts } from '@oiij/e-charts'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)

const { onRendered } = useECharts(useTemplateRef('chart'), {
  chartOption: { /* ... */ },
  darkMode
})

onRendered((instance) => {
  console.log('图表渲染完成', instance)
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

```vue
<script setup>
import { useECharts } from '@oiij/e-charts'
import { useTemplateRef } from 'vue'

const { chartOption } = useECharts(useTemplateRef('chart'), {
  chartOption: {
    radar: {
      indicator: [
        { name: '销售', max: 100 },
        { name: '管理', max: 100 },
        { name: '技术', max: 100 },
        { name: '客服', max: 100 },
        { name: '研发', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [{ value: [80, 90, 70, 85, 95] }]
    }]
  }
})
</script>

<template>
  <div ref="chart" style="width: 100%; height: 400px;" />
</template>
```
