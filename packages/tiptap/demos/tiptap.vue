<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useTipTap } from '@oiij/tiptap'
import { NFlex, NInput } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

const valueRef = ref('TT')
const { value, onUpdateValue } = useTipTap(useTemplateRef('dom-ref'), {
  value: valueRef,
})
onUpdateValue((v) => {
  console.log(v)
})
</script>

<template>
  <NFlex vertical>
    <NInput v-model:value="valueRef" />
    <div ref="dom-ref" style="border: 1px solid #333;" />
    <pre>{{ value }}</pre>
    <pre v-html="value" />
  </NFlex>
</template>

<style scoped>

</style>
