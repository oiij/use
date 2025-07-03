<script setup lang='ts'>
import { NPresetInput } from '@oiij/naive-ui/components'
import { NFlex } from 'naive-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <NFlex vertical>
    <NPresetInput v-model:value="value" :options="{ type: 'input', label: '输入框' }" />
    <pre>值：{{ value }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
