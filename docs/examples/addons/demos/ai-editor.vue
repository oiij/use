<script setup lang='ts'>
import { useAiEditor } from '@oiij/ai-editor'
import { NFlex } from 'naive-ui'

const { domRef, value } = useAiEditor('')
</script>

<template>
  <NFlex vertical>
    <div ref="domRef" />
    <pre>{{ value }}</pre>
    <pre v-html="value" />
  </NFlex>
</template>

<style scoped>

</style>
