<script setup lang='ts'>
import { useTipTap } from '@oiij/tiptap'
import { NFlex } from 'naive-ui'

const { domRef, value } = useTipTap('')
</script>

<template>
  <NFlex vertical>
    <div ref="domRef" style="border: 1px solid #333;" />
    <pre>{{ value }}</pre>
    <pre v-html="value" />
  </NFlex>
</template>

<style scoped>

</style>
