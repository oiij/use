<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  fourierX1 = 17,
  fourierX3 = 7.5,
  fourierX5 = 3.2,
  fourierY1 = 15,
  fourierY2 = 8.2,
  fourierY4 = 4.2,
  fourierMixBase = 1,
  fourierMixPulse = 0.16,
} = defineProps<LoaderProps & {
  /**
   * X 轴 cos(t) 振幅
   * @default 17
   */
  fourierX1?: number
  /**
   * X 轴 cos(3t) 振幅
   * @default 7.5
   */
  fourierX3?: number
  /**
   * X 轴 sin(5t) 振幅
   * @default 3.2
   */
  fourierX5?: number
  /**
   * Y 轴 sin(t) 振幅
   * @default 15
   */
  fourierY1?: number
  /**
   * Y 轴 sin(2t) 振幅
   * @default 8.2
   */
  fourierY2?: number
  /**
   * Y 轴 cos(4t) 振幅
   * @default 4.2
   */
  fourierY4?: number
  /**
   * 混合参数基础值
   * @default 1
   */
  fourierMixBase?: number
  /**
   * 混合参数脉冲系数（随 detailScale 变化）
   * @default 0.16
   */
  fourierMixPulse?: number
}>()

/**
 * Fourier Flow 点计算函数（傅里叶曲线）
 * 公式：
 * m = fourierMixBase + fourierMixPulse * detailScale
 * x(t) = fourierX1 * cos(t) + fourierX3 * cos(3t + 0.6m) + fourierX5 * sin(5t - 0.4)
 * y(t) = fourierY1 * sin(t) + fourierY2 * sin(2t + 0.25) - fourierY4 * cos(4t - 0.5m)
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const mix = fourierMixBase + detailScale * fourierMixPulse
  const x
    = fourierX1 * Math.cos(t)
      + fourierX3 * Math.cos(3 * t + 0.6 * mix)
      + fourierX5 * Math.sin(5 * t - 0.4)
  const y
    = fourierY1 * Math.sin(t)
      + fourierY2 * Math.sin(2 * t + 0.25)
      - fourierY4 * Math.cos(4 * t - 0.5 * mix)
  return {
    x: 50 + x,
    y: 50 + y,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
