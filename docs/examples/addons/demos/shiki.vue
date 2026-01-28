<script setup lang='ts'>
import { useShiki } from '@oiij/shiki'
import { NFlex } from 'naive-ui'
import { useTemplateRef } from 'vue'

const { valueRef } = useShiki(useTemplateRef('dom-ref'), {
  value: `export const foo = 'foo'`,
})
</script>

<template>
  <NFlex vertical>
    <div ref="dom-ref" />
    <textarea v-model="valueRef" style="border: 1px solid #000;" />
  </NFlex>
</template>

<style scoped>

</style>
