# @oiij/math-curve-loaders

基于数学曲线的 Vue 动画加载器组件库。

> 🎯 本项目基于 [math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) 开源项目，使用 Vue 3 + Composition API 重新实现。

## 特性

- 🎨 15+ 种精美的数学曲线动画
- 📦 基于 Vue 3 Composition API
- 🔧 高度可配置，支持自定义参数
- 🎯 TypeScript 支持
- 📱 响应式设计

## 安装

```bash
npm install @oiij/math-curve-loaders
# 或
pnpm add @oiij/math-curve-loaders
# 或
yarn add @oiij/math-curve-loaders
```

## 快速开始

```vue
<script setup>
import { RoseCurve } from '@oiij/math-curve-loaders'
</script>

<template>
  <RoseCurve />
</template>
```

## 组件列表

### 玫瑰线系列

| 组件        | 说明         | 公式                         |
| ----------- | ------------ | ---------------------------- |
| `RoseOrbit` | 玫瑰轨道     | r = a - b·s·cos(k·t)         |
| `RoseCurve` | 玫瑰线 (k=5) | r = (a+b·s)(c+d·s)·cos(5t)   |
| `RoseTwo`   | 玫瑰线 (k=2) | 复用 RoseCurve，设置 roseK=2 |

### 螺旋线系列

| 组件               | 说明         | 公式                                  |
| ------------------ | ------------ | ------------------------------------- |
| `ThreePetalSpiral` | 三瓣螺旋     | R=3, r=1, d=3                         |
| `FourPetalSpiral`  | 四瓣螺旋     | 复用 ThreePetalSpiral，设置 spiralR=4 |
| `SpiralSearch`     | 阿基米德螺旋 | r = base + (1-cos t)(amp+pulse)       |

### 心形线系列

| 组件            | 说明         | 公式                                   |
| --------------- | ------------ | -------------------------------------- |
| `CardioidGlow`  | 心形线（右） | r = a(1 - cos t)                       |
| `CardioidHeart` | 心形线（上） | r = a(1 + cos t)                       |
| `HeartWave`     | 心形波浪     | f(x) = \|x\|^(2/3) + a√(r-x²)·sin(bπx) |

### 其他曲线

| 组件               | 说明       | 公式                                      |
| ------------------ | ---------- | ----------------------------------------- |
| `LemniscateBloom`  | 双纽线     | x = a·cos(t)/(1+sin²(t))                  |
| `OriginalThinking` | 花瓣线     | x = a·cos(t) - b·s·cos(k·t)               |
| `LissajousDrift`   | 利萨如曲线 | x = sin(at+φ)·A, y = sin(bt)·0.92A        |
| `HypotrochoidLoop` | 内摆线     | 双三角函数组合                            |
| `ButterflyPhase`   | 蝴蝶曲线   | B(u) = e^cos(u) - 2·cos(4u) - sin^5(u/12) |
| `FourierFlow`      | 傅里叶曲线 | 多频率三角函数叠加                        |

## 使用示例

### 基础使用

```vue
<script setup>
import { RoseCurve } from '@oiij/math-curve-loaders'
</script>

<template>
  <div class="loader-container">
    <RoseCurve />
  </div>
</template>

<style scoped>
.loader-container {
  width: 200px;
  height: 200px;
}
</style>
```

### 自定义配置

```vue
<script setup>
import { RoseCurve } from '@oiij/math-curve-loaders'

const loaderConfig = {
  particleCount: 50,
  trailSpan: 0.3,
  durationMs: 3000,
  rotate: true,
  strokeWidth: 2
}
</script>

<template>
  <RoseCurve
    :config="loaderConfig"
    :rose-k="7"
    :rose-a="10"
  />
</template>
```

### 使用组合式函数

```vue
<script setup>
import { useRenderer } from '@oiij/math-curve-loaders'
import { ref } from 'vue'

const svgGroupRef = ref()
const pathRef = ref()

function pointFn(progress, detailScale) {
  const t = progress * Math.PI * 2
  return {
    x: 50 + Math.cos(t) * 30 * detailScale,
    y: 50 + Math.sin(t) * 30 * detailScale
  }
}

useRenderer({
  svgRef: svgGroupRef,
  pathRef,
  point: pointFn,
  config: {
    particleCount: 30,
    rotate: true
  }
})
</script>

<template>
  <svg viewBox="0 0 100 100">
    <g ref="svgGroupRef">
      <path ref="pathRef" fill="none" stroke="currentColor" />
    </g>
  </svg>
</template>
```

## 配置选项

### LoaderConfig

| 参数                 | 类型      | 默认值  | 说明              |
| -------------------- | --------- | ------- | ----------------- |
| `particleCount`      | `number`  | `91`    | 粒子数量          |
| `trailSpan`          | `number`  | `0.34`  | 拖尾跨度 (0-1)    |
| `durationMs`         | `number`  | `2400`  | 动画周期时长 (ms) |
| `rotationDurationMs` | `number`  | `45500` | 旋转周期时长 (ms) |
| `pulseDurationMs`    | `number`  | `4900`  | 脉冲周期时长 (ms) |
| `strokeWidth`        | `number`  | `6.2`   | 描边宽度          |
| `rotate`             | `boolean` | `false` | 是否启用旋转      |

### 组件特有参数

每个组件都有自己的特有参数，详见各组件文档。

## API

### useRenderer

```ts
function useRenderer(options: RendererOptions): {
  init: () => void
  cleanup: () => void
}
```

### 类型定义

```ts
type Point = {
  x: number
  y: number
}

type PointFn = (progress: number, detailScale: number) => Point

type LoaderProps = {
  config?: LoaderConfig
  pointFn?: PointFn
}
```

## 开源许可

MIT License

## 致谢

本项目基于 [Paidax01/math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) 开源项目，感谢原作者的贡献。

原项目提供了精美的数学曲线动画实现，本项目使用 Vue 3 + Composition API 进行了重新封装，使其更易于在 Vue 项目中使用。
