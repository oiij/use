<script setup lang='ts'>
import type { LoaderConfig, PointFn } from '../use-renderer'
import { useTemplateRef } from 'vue'
import { useRenderer } from '../use-renderer'

const { point, config } = defineProps<{
  point: PointFn
  config?: LoaderConfig
}>()

useRenderer({
  svgRef: useTemplateRef('svg-ref'),
  pathRef: useTemplateRef('path=ref'),
  config,
  point,
})
</script>

<template>
  <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <g ref="svg-ref">
      <path ref="path=ref" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" opacity="0.1" />
    </g>
  </svg>
</template>

<style scoped>

</style>
