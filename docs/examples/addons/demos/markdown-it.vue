<script setup lang='ts'>
import { useMarkdownIt } from '@oiij/markdown-it'
import { NFlex } from 'naive-ui'
import { useTemplateRef } from 'vue'

const { value } = useMarkdownIt(useTemplateRef('dom-ref'), '# Hello World!')
</script>

<template>
  <NFlex vertical>
    <div ref="dom-ref" />
    <textarea v-model="value" style="border: 1px solid #000;" />
  </NFlex>
</template>

<style scoped>

</style>
