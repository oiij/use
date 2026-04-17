<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  spiralR = 3.0,
  spiralr = 1.0,
  spirald = 3.0,
  spiralScale = 2.2,
  spiralBreath = 0.45,
} = defineProps<LoaderProps & {
  /**
   * 外圆半径
   * @default 3.0
   */
  spiralR?: number
  /**
   * 内圆半径
   * @default 1.0
   */
  spiralr?: number
  /**
   * 偏移距离
   * @default 3.0
   */
  spirald?: number
  /**
   * 基础缩放比例
   * @default 2.2
   */
  spiralScale?: number
  /**
   * 缩放增强系数（随 detailScale 变化）
   * @default 0.45
   */
  spiralBreath?: number
}>()

/**
 * Three-Petal Spiral 点计算函数
 * 公式：
 * u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))
 * m(t) = spiralScale + spiralBreath * detailScale
 * (x, y) = 50 + u(t) · m(t)
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const d = spirald + detailScale * 0.25
  const baseX = (spiralR - spiralr) * Math.cos(t) + d * Math.cos(((spiralR - spiralr) / spiralr) * t)
  const baseY = (spiralR - spiralr) * Math.sin(t) - d * Math.sin(((spiralR - spiralr) / spiralr) * t)
  const scale = spiralScale + detailScale * spiralBreath
  return {
    x: 50 + baseX * scale,
    y: 50 + baseY * scale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
