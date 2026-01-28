<script setup lang='ts'>
import { useTipTap } from '@oiij/tiptap'
import { NFlex } from 'naive-ui'
import { useTemplateRef } from 'vue'

const { valueRef } = useTipTap(useTemplateRef('dom-ref'))
</script>

<template>
  <NFlex vertical>
    <div ref="dom-ref" style="border: 1px solid #333;" />
    <pre>{{ valueRef }}</pre>
    <pre v-html="valueRef" />
  </NFlex>
</template>

<style scoped>

</style>
