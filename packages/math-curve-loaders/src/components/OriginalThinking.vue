<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const { config, pointFn, petalCount = 7, baseRadius = 7, detailAmplitude = 3, curveScale = 3.9 } = defineProps<LoaderProps & {
  /**
   * 基础半径（OriginalThinking 组件使用）
   * @default 7
   */
  baseRadius?: number
  /**
   * 细节振幅（OriginalThinking 组件使用）
   * @default 3
   */
  detailAmplitude?: number
  /**
   * 花瓣数量（OriginalThinking 组件使用）
   * @default 7
   */
  petalCount?: number
  /**
   * 曲线缩放（OriginalThinking 组件使用）
   * @default 3.9
   */
  curveScale?: number
}>()

function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const petals = Math.round(petalCount)
  const x = baseRadius * Math.cos(t) - detailAmplitude * detailScale * Math.cos(petals * t)
  const y = baseRadius * Math.sin(t) - detailAmplitude * detailScale * Math.sin(petals * t)
  return {
    x: 50 + x * curveScale,
    y: 50 + y * curveScale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
