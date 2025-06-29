<script setup lang='ts'>
import { NToggleEditor } from '@oiij/naive-ui/components'
import { NFlex } from 'naive-ui'
import { ref } from 'vue'

const value = ref('123456')
</script>

<template>
  <NFlex vertical>
    <NToggleEditor v-model:value="value" />
    <pre>值：{{ value }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
