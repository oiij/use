<script setup lang='ts'>
import { useAiEditor } from '@oiij/ai-editor'
import { NFlex } from 'naive-ui'
import { useTemplateRef } from 'vue'

const { value } = useAiEditor(useTemplateRef('dom-ref'), '')
</script>

<template>
  <NFlex vertical>
    <div ref="dom-ref" />
    <pre>{{ value }}</pre>
    <pre v-html="value" />
  </NFlex>
</template>

<style scoped>

</style>
