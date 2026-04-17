<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const { config, pointFn, orbitRadius = 7, detailAmplitude = 2.7, petalCount = 7, curveScale = 3.9 } = defineProps<LoaderProps & {
  /**
   * 轨道基础半径
   * @default 7
   */
  orbitRadius?: number
  /**
   * 细节振幅（控制花瓣深度）
   * @default 2.7
   */
  detailAmplitude?: number
  /**
   * 花瓣数量
   * @default 7
   */
  petalCount?: number
  /**
   * 曲线缩放比例
   * @default 3.9
   */
  curveScale?: number
}>()

/**
 * Rose Orbit 点计算函数
 * 公式：
 * r(t) = orbitRadius - detailAmplitude * detailScale * cos(petalCount * t)
 * x(t) = 50 + cos(t) * r(t) * curveScale
 * y(t) = 50 + sin(t) * r(t) * curveScale
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const k = Math.round(petalCount)
  const r = orbitRadius - detailAmplitude * detailScale * Math.cos(k * t)
  return {
    x: 50 + Math.cos(t) * r * curveScale,
    y: 50 + Math.sin(t) * r * curveScale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
