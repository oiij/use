<script setup lang='ts'>
import { useMarkdownIt } from '@oiij/markdown-it'
import { NFlex } from 'naive-ui'
import { useTemplateRef } from 'vue'

const { valueRef, htmlRef } = useMarkdownIt(useTemplateRef('dom-ref'), {
  value: '# Hello World!',
})
</script>

<template>
  <NFlex vertical>
    <div ref="dom-ref" />
    <div v-html="htmlRef" />
    <textarea v-model="valueRef" style="border: 1px solid #000;" />
  </NFlex>
</template>

<style scoped>

</style>
