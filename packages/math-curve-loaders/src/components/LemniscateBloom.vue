<script setup lang="ts">
import type { LoaderProps } from './index'
import BaseSvg from './BaseSvg.vue'

const { config, pointFn, lemniscateA = 19, lemniscateBoost = 7 } = defineProps<LoaderProps & {
  /**
   * 双纽线参数 A
   * @default 19
   */
  lemniscateA?: number
  /**
   * 双纽线参数 Boost
   * @default 7
   */
  lemniscateBoost?: number
}>()

function point(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const scale = lemniscateA + detailScale * lemniscateBoost
  const denom = 1 + Math.sin(t) ** 2
  return {
    x: 50 + (scale * Math.cos(t)) / denom,
    y: 50 + (scale * Math.sin(t) * Math.cos(t)) / denom,
  }
}
</script>

<template>
  <BaseSvg :point="pointFn || point" :config="config" />
</template>

<style scoped>

</style>
