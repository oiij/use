<script setup lang='ts'>
import { NSearchInput } from '@oiij/naive-ui/components'
import { NFlex } from 'naive-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <NFlex>
    <NSearchInput v-model:value="value" type="info" />
    <pre>搜索结果：{{ value }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
