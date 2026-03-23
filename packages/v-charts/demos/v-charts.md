# UseVCharts

## 功能描述

**UseVCharts** 是一个基于 VChart 的图表库 Vue 组合式函数，提供了丰富的图表类型和配置选项，支持响应式更新和主题切换，适用于各种数据可视化场景。

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

## 基本使用

<demo vue="./v-charts.vue" title="UseVCharts" />

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

## 类型定义

```ts
import type { IInitOption, ISpec, VChart } from '@visactor/vchart'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type UseVChartsOptions = {
  /**
   * 图表配置
   */
  chartOption?: MaybeRefOrGetter<ISpec>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 初始化选项
   */
  initOptions?: IInitOption
}

export type UseVChartsReturns = {
  /**
   * 图表容器引用
   */
  templateRef: TemplateRef<HTMLElement>
  /**
   * VChart 实例
   */
  vChartInst: ShallowRef<VChart | null>
  /**
   * 图表配置
   */
  chartOption: Ref<ISpec | undefined>
  /**
   * 暗黑模式状态
   */
  darkMode: Ref<boolean | undefined>
  /**
   * 设置图表配置
   */
  setOption: (option?: ISpec) => void
  /**
   * 设置暗黑模式
   */
  setDarkMode: (darkMode?: boolean) => void
  /**
   * 图表渲染完成事件
   */
  onRendered: (callback: (instance: VChart) => void) => void
  /**
   * 配置更新事件
   */
  onUpdate: (callback: (option: ISpec) => void) => void
  /**
   * 容器尺寸变化事件
   */
  onResize: (callback: (size: { width: number, height: number }) => void) => void
  /**
   * 图表销毁事件
   */
  onDispose: (callback: () => void) => void
}

export declare function useVCharts(templateRef: TemplateRef<HTMLElement>, options?: UseVChartsOptions): UseVChartsReturns
export declare function register(comps: (() => void)[]): void
```

## 使用示例

### 基础饼图

```vue
<script setup>
import type { ISpec } from '@oiij/v-charts'
import { useVCharts } from '@oiij/v-charts'
import { useTemplateRef } from 'vue'

const chartOption: ISpec = {
  type: 'pie',
  data: [{
    values: [
      { type: 'oxygen', value: 46.6 },
      { type: 'silicon', value: 27.7 },
      { type: 'aluminum', value: 8.13 },
    ]
  }],
  valueField: 'value',
  categoryField: 'type'
}

const { onRendered } = useVCharts(useTemplateRef('chart'), { chartOption })
</script>

<template>
  <div ref="chart" style="width: 100%; height: 400px;" />
</template>
```

### 响应式数据

```vue
<script setup>
import type { ISpec } from '@oiij/v-charts'
import { useVCharts } from '@oiij/v-charts'
import { computed, ref, useTemplateRef } from 'vue'

const value = ref(20)

const chartOption = computed<ISpec>(() => ({
  type: 'pie',
  data: [{
    values: [
      { type: 'oxygen', value: value.value * 1.2 },
      { type: 'silicon', value: value.value * 2 },
    ]
  }],
  valueField: 'value',
  categoryField: 'type'
}))

const { onUpdate } = useVCharts(useTemplateRef('chart'), { chartOption })

onUpdate((option) => {
  console.log('配置更新', option)
})

function updateData() {
  value.value += 10
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
import { useVCharts } from '@oiij/v-charts'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)

const { onRendered } = useVCharts(useTemplateRef('chart'), {
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
import { register } from '@oiij/v-charts'
import { registerGaugeChart, registerRadarChart } from '@visactor/vchart'

// 注册额外的图表类型
register([registerRadarChart, registerGaugeChart])
```
