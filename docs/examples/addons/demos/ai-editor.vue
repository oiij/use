<script setup lang='ts'>
import { useAiEditor } from '@oiij/ai-editor'
import { NFlex } from 'naive-ui'
import { useTemplateRef } from 'vue'

const { valueRef } = useAiEditor(useTemplateRef('dom-ref'))
</script>

<template>
  <NFlex vertical>
    <div ref="dom-ref" />
    <pre>{{ valueRef }}</pre>
    <pre v-html="valueRef" />
  </NFlex>
</template>

<style scoped>

</style>
