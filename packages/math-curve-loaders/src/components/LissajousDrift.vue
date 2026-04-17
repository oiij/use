<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  lissajousAmp = 24,
  lissajousAmpBoost = 6,
  lissajousAX = 3,
  lissajousBY = 4,
  lissajousPhase = 1.57,
  lissajousYScale = 0.92,
} = defineProps<LoaderProps & {
  /**
   * 基础振幅
   * @default 24
   */
  lissajousAmp?: number
  /**
   * 振幅增强系数（随 detailScale 变化）
   * @default 6
   */
  lissajousAmpBoost?: number
  /**
   * X 轴频率
   * @default 3
   */
  lissajousAX?: number
  /**
   * Y 轴频率
   * @default 4
   */
  lissajousBY?: number
  /**
   * 相位偏移（弧度）
   * @default 1.57
   */
  lissajousPhase?: number
  /**
   * Y 轴缩放比例
   * @default 0.92
   */
  lissajousYScale?: number
}>()

/**
 * Lissajous Drift 点计算函数
 * 公式：
 * A = lissajousAmp + lissajousAmpBoost * detailScale
 * x(t) = 50 + sin(lissajousAX * t + lissajousPhase) * A
 * y(t) = 50 + sin(lissajousBY * t) * A * lissajousYScale
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const amp = lissajousAmp + detailScale * lissajousAmpBoost
  return {
    x: 50 + Math.sin(Math.round(lissajousAX) * t + lissajousPhase) * amp,
    y: 50 + Math.sin(Math.round(lissajousBY) * t) * (amp * lissajousYScale),
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
