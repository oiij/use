<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  spiroR = 8.2,
  spiror = 2.7,
  spirorBoost = 0.45,
  spirod = 4.8,
  spirodBoost = 1.2,
  spiroScale = 3.05,
} = defineProps<LoaderProps & {
  /**
   * 固定外圆半径
   * @default 8.2
   */
  spiroR?: number
  /**
   * 内圆基础半径
   * @default 2.7
   */
  spiror?: number
  /**
   * 内圆半径增强系数（随 detailScale 变化）
   * @default 0.45
   */
  spirorBoost?: number
  /**
   * 偏移距离基础值
   * @default 4.8
   */
  spirod?: number
  /**
   * 偏移距离增强系数（随 detailScale 变化）
   * @default 1.2
   */
  spirodBoost?: number
  /**
   * 整体缩放比例
   * @default 3.05
   */
  spiroScale?: number
}>()

/**
 * Hypotrochoid Loop 点计算函数（内摆线）
 * 公式：
 * r = spiror + spirorBoost * detailScale
 * d = spirod + spirodBoost * detailScale
 * x(t) = 50 + ((spiroR - r) * cos(t) + d * cos((spiroR - r)/r * t)) * spiroScale
 * y(t) = 50 + ((spiroR - r) * sin(t) - d * sin((spiroR - r)/r * t)) * spiroScale
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const r = spiror + detailScale * spirorBoost
  const d = spirod + detailScale * spirodBoost
  const x = (spiroR - r) * Math.cos(t) + d * Math.cos(((spiroR - r) / r) * t)
  const y = (spiroR - r) * Math.sin(t) - d * Math.sin(((spiroR - r) / r) * t)
  return {
    x: 50 + x * spiroScale,
    y: 50 + y * spiroScale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
