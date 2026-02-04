<script setup lang='ts'>
import { NToggleInput } from '@oiij/naive-ui/components'
import { NFlex, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const trigger = ref<'click' | 'dblclick'>('click')
const value = ref('123456')
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <span>单击</span>
      <NSwitch v-model:value="trigger" checked-value="dblclick" unchecked-value="click" />
      <span>双击</span>
    </NFlex>

    <NToggleInput v-model:value="value" :trigger="trigger" />
    <pre>值：{{ value }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
