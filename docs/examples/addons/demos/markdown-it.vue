<script setup lang='ts'>
import { useMarkdownIt } from '@oiij/markdown-it'
import { NFlex } from 'naive-ui'

const { value, domRef } = useMarkdownIt('# Hello World!')
</script>

<template>
  <NFlex vertical>
    <div ref="domRef" />
    <textarea v-model="value" style="border: 1px solid #000;" />
  </NFlex>
</template>

<style scoped>

</style>
