<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  heartWaveB = 6.4,
  heartWaveRoot = 3.3,
  heartWaveAmp = 0.9,
  heartWaveScaleX = 23.2,
  heartWaveScaleY = 24.5,
} = defineProps<LoaderProps & {
  /**
   * 波形频率系数
   * @default 6.4
   */
  heartWaveB?: number
  /**
   * 根号范围（控制 x 的取值范围）
   * @default 3.3
   */
  heartWaveRoot?: number
  /**
   * 波形振幅
   * @default 0.9
   */
  heartWaveAmp?: number
  /**
   * X 轴缩放比例
   * @default 23.2
   */
  heartWaveScaleX?: number
  /**
   * Y 轴基础缩放比例
   * @default 24.5
   */
  heartWaveScaleY?: number
}>()

/**
 * Heart Wave 点计算函数（心形波浪）
 * 公式：
 * f(x) = |x|^(2/3) + heartWaveAmp * √(heartWaveRoot - x²) * sin(heartWaveB * π * x)
 * screenX = 50 + x * heartWaveScaleX
 * screenY = 18 + (1.75 - f(x)) * (heartWaveScaleY + 1.5 * detailScale)
 */
function point(progress: number, detailScale: number) {
  const xLimit = Math.sqrt(heartWaveRoot)
  const x = -xLimit + progress * xLimit * 2
  const safeRoot = Math.max(0, heartWaveRoot - x * x)
  const wave = heartWaveAmp * Math.sqrt(safeRoot) * Math.sin(heartWaveB * Math.PI * x)
  const curve = Math.abs(x) ** (2 / 3)
  const y = curve + wave
  const scaleY = heartWaveScaleY + detailScale * 1.5

  return {
    x: 50 + x * heartWaveScaleX,
    y: 18 + (1.75 - y) * scaleY,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
