<script setup lang='ts'>
import { NFlex } from 'naive-ui'
import { ref } from 'vue'
import { NPresetInput } from '~/naive-ui/src/components'

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
