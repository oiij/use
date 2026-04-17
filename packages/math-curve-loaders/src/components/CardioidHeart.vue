<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  cardioidA = 8.8,
  cardioidPulse = 0.8,
  cardioidScale = 2.15,
} = defineProps<LoaderProps & {
  /**
   * 基础振幅
   * @default 8.8
   */
  cardioidA?: number
  /**
   * 振幅脉冲系数（随 detailScale 变化）
   * @default 0.8
   */
  cardioidPulse?: number
  /**
   * 整体缩放比例
   * @default 2.15
   */
  cardioidScale?: number
}>()

/**
 * Cardioid Heart 点计算函数（旋转心形线）
 * 公式：
 * a = cardioidA + cardioidPulse * detailScale
 * r(t) = a * (1 + cos t)
 * x(t) = 50 - sin(t) * r(t) * cardioidScale
 * y(t) = 50 - cos(t) * r(t) * cardioidScale
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const a = cardioidA + detailScale * cardioidPulse
  const r = a * (1 + Math.cos(t))
  const baseX = Math.cos(t) * r
  const baseY = Math.sin(t) * r
  return {
    x: 50 - baseY * cardioidScale,
    y: 50 - baseX * cardioidScale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
