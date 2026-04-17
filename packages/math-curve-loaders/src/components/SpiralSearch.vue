<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  searchTurns = 4,
  searchBaseRadius = 8,
  searchRadiusAmp = 8.5,
  searchPulse = 2.4,
  searchScale = 1,
} = defineProps<LoaderProps & {
  /**
   * 旋转圈数
   * @default 4
   */
  searchTurns?: number
  /**
   * 基础半径
   * @default 8
   */
  searchBaseRadius?: number
  /**
   * 半径振幅
   * @default 8.5
   */
  searchRadiusAmp?: number
  /**
   * 半径脉冲系数（随 detailScale 变化）
   * @default 2.4
   */
  searchPulse?: number
  /**
   * 整体缩放比例
   * @default 1
   */
  searchScale?: number
}>()

/**
 * Spiral Search 点计算函数（阿基米德螺旋线）
 * 公式：
 * θ = t * searchTurns
 * r(t) = searchBaseRadius + (1 - cos(t)) * (searchRadiusAmp + searchPulse * detailScale)
 * x(t) = 50 + cos(θ) * r(t) * searchScale
 * y(t) = 50 + sin(θ) * r(t) * searchScale
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const angle = t * searchTurns
  const radius
    = searchBaseRadius
      + (1 - Math.cos(t)) * (searchRadiusAmp + detailScale * searchPulse)
  return {
    x: 50 + Math.cos(angle) * radius * searchScale,
    y: 50 + Math.sin(angle) * radius * searchScale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
