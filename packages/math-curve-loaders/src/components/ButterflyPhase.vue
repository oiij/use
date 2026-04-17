<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const {
  config,
  pointFn,
  butterflyTurns = 12,
  butterflyScale = 4.6,
  butterflyPulse = 0.45,
  butterflyCosWeight = 2,
  butterflyPower = 5,
} = defineProps<LoaderProps & {
  /**
   * 旋转圈数（控制曲线复杂度）
   * @default 12
   */
  butterflyTurns?: number
  /**
   * 基础缩放比例
   * @default 4.6
   */
  butterflyScale?: number
  /**
   * 缩放脉冲系数（随 detailScale 变化）
   * @default 0.45
   */
  butterflyPulse?: number
  /**
   * cos 项权重
   * @default 2
   */
  butterflyCosWeight?: number
  /**
   * sin 幂次
   * @default 5
   */
  butterflyPower?: number
}>()

/**
 * Butterfly Phase 点计算函数（蝴蝶曲线）
 * 公式：
 * u = butterflyTurns * t
 * B(u) = e^{cos u} - butterflyCosWeight * cos 4u - sin^butterflyPower(u/12)
 * scale = butterflyScale + butterflyPulse * detailScale
 * x(t) = 50 + sin(u) * B(u) * scale
 * y(t) = 50 + cos(u) * B(u) * scale
 */
function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * butterflyTurns
  const s
    = Math.exp(Math.cos(t))
      - butterflyCosWeight * Math.cos(4 * t)
      - Math.sin(t / 12) ** Math.round(butterflyPower)
  const scale = butterflyScale + detailScale * butterflyPulse
  return {
    x: 50 + Math.sin(t) * s * scale,
    y: 50 + Math.cos(t) * s * scale,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
