<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  roseA = 9.2,
  roseABoost = 0.6,
  roseBreathBase = 0.72,
  roseBreathBoost = 0.28,
  roseK = 5,
  roseScale = 3.25,
} = defineProps<LoaderProps & {
  /**
   * 基础振幅
   * @default 9.2
   */
  roseA?: number
  /**
   * 振幅增强系数（随 detailScale 变化）
   * @default 0.6
   */
  roseABoost?: number
  /**
   * 呼吸基础值
   * @default 0.72
   */
  roseBreathBase?: number
  /**
   * 呼吸增强系数（随 detailScale 变化）
   * @default 0.28
   */
  roseBreathBoost?: number
  /**
   * 花瓣数量
   * @default 5
   */
  roseK?: number
  /**
   * 曲线缩放比例
   * @default 3.25
   */
  roseScale?: number
}>()

/**
 * Rose Curve 点计算函数
 * 公式：
 * r(t) = (roseA + roseABoost * detailScale) * (roseBreathBase + roseBreathBoost * detailScale) * cos(roseK * t)
 * x(t) = 50 + cos(t) * r(t) * roseScale
 * y(t) = 50 + sin(t) * r(t) * roseScale
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const a = roseA + roseABoost * detailScale
  const k = Math.round(roseK)
  const r = a * (roseBreathBase + roseBreathBoost * detailScale) * Math.cos(k * t)
  return {
    x: 50 + Math.cos(t) * r * roseScale,
    y: 50 + Math.sin(t) * r * roseScale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
