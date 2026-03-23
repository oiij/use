# @oiij/v-charts

[![NPM version](https://img.shields.io/npm/v/@oiij/v-charts)](https://www.npmjs.com/package/@oiij/v-charts)
[![MIT-license](https://img.shields.io/npm/l/@oiij/v-charts)](https://github.com/oiij/use/blob/main/packages/v-charts/LICENSE)

## 简介

Use VCharts 是基于 VChart 的 Vue 3 组合式函数封装，提供便捷的图表渲染功能，帮助开发者快速构建数据可视化应用。

## 特点

### 📊 图表丰富

- 📈 内置折线图、面积图、柱状图、饼图
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
pnpm add @oiij/v-charts

# 使用 npm
npm install @oiij/v-charts

# 使用 yarn
yarn add @oiij/v-charts
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `@visactor/vchart`: ^1.0.0

## 示例

### 基础使用

```vue
<script setup>
import { useVCharts } from '@oiij/v-charts'
import { useTemplateRef } from 'vue'

const { chartOption } = useVCharts(useTemplateRef('chart'), {
  chartOption: {
    type: 'bar',
    data: [
      { month: 'Jan', value: 120 },
      { month: 'Feb', value: 200 },
      { month: 'Mar', value: 150 },
    ],
    xField: 'month',
    yField: 'value'
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
import { useVCharts } from '@oiij/v-charts'
import { computed, ref, useTemplateRef } from 'vue'

const salesData = ref([
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 200 },
])

const chartOption = computed(() => ({
  type: 'bar',
  data: [{ id: 'data', values: salesData.value }],
  xField: 'month',
  yField: 'value'
}))

const { onUpdate } = useVCharts(useTemplateRef('chart'), { chartOption })

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
import { useVCharts } from '@oiij/v-charts'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)

const { setDarkMode } = useVCharts(useTemplateRef('chart'), {
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
import { register } from '@oiij/v-charts'
import { registerGaugeChart, registerRadarChart } from '@visactor/vchart'

// 注册额外的图表类型
register([registerRadarChart, registerGaugeChart])
```

## API

### `useVCharts(templateRef, options?)`

使用 VChart 创建图表。

#### 参数

| 参数          | 类型                       | 说明               |
| ------------- | -------------------------- | ------------------ |
| `templateRef` | `TemplateRef<HTMLElement>` | 图表容器的模板引用 |
| `options`     | `UseVChartsOptions`        | 图表配置选项       |

#### UseVChartsOptions

| 选项          | 类型                        | 默认值  | 说明              |
| ------------- | --------------------------- | ------- | ----------------- |
| `chartOption` | `MaybeRefOrGetter<ISpec>`   | -       | VChart 配置       |
| `darkMode`    | `MaybeRefOrGetter<boolean>` | `false` | 是否开启暗黑模式  |
| `initOptions` | `IInitOption`               | -       | VChart 初始化选项 |

#### 返回值

| 属性                     | 类型                         | 说明             |
| ------------------------ | ---------------------------- | ---------------- |
| `templateRef`            | `TemplateRef<HTMLElement>`   | 图表容器引用     |
| `vChartInst`             | `ShallowRef<VChart \| null>` | VChart 实例      |
| `chartOption`            | `Ref<ISpec>`                 | 图表配置         |
| `darkMode`               | `Ref<boolean>`               | 暗黑模式状态     |
| `setOption(option?)`     | `Function`                   | 设置图表配置     |
| `setDarkMode(darkMode?)` | `Function`                   | 设置暗黑模式     |
| `onRendered(callback)`   | `Function`                   | 图表渲染完成事件 |
| `onUpdate(callback)`     | `Function`                   | 配置更新事件     |
| `onResize(callback)`     | `Function`                   | 容器尺寸变化事件 |
| `onDispose(callback)`    | `Function`                   | 图表销毁事件     |

### `register(comps)`

注册 VChart 扩展组件。

#### 参数

| 参数    | 类型             | 说明                 |
| ------- | ---------------- | -------------------- |
| `comps` | `(() => void)[]` | 扩展组件注册函数数组 |

## 内置图表类型

- `registerLineChart` - 折线图
- `registerAreaChart` - 面积图
- `registerBarChart` - 柱状图
- `registerPieChart` - 饼图

## 类型定义

```ts
import type { IInitOption, ISpec, VChart } from '@visactor/vchart'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type UseVChartsOptions = {
  chartOption?: MaybeRefOrGetter<ISpec>
  darkMode?: MaybeRefOrGetter<boolean>
  initOptions?: IInitOption
}

export type UseVChartsReturns = {
  templateRef: TemplateRef<HTMLElement>
  vChartInst: ShallowRef<VChart | null>
  chartOption: Ref<ISpec | undefined>
  darkMode: Ref<boolean | undefined>
  setOption: (option?: ISpec) => void
  setDarkMode: (darkMode?: boolean) => void
  onRendered: (callback: (instance: VChart) => void) => void
  onUpdate: (callback: (option: ISpec) => void) => void
  onResize: (callback: (size: { width: number, height: number }) => void) => void
  onDispose: (callback: () => void) => void
}

export declare function useVCharts(templateRef: TemplateRef<HTMLElement>, options?: UseVChartsOptions): UseVChartsReturns
export declare function register(comps: (() => void)[]): void
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/v-charts/v-charts)
