<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useAutoRatio } from '@oiij/use'
import { NFlex, NInput } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

useAutoRatio(useTemplateRef('dom-ref'), 1, useTemplateRef('target-ref'))
const size = ref({
  width: '100%',
  height: '200px',
})
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <div style="display: flex; align-items: center; gap: 10px;">
        宽:<NInput v-model:value="size.width" />
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        高:<NInput v-model:value="size.height" />
      </div>
    </NFlex>
    <div ref="target-ref" style="background-color: antiquewhite;" :style="{ width: `${size.width}`, height: `${size.height}` }">
      <div ref="dom-ref" style="background-color: darkcyan;" />
    </div>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
