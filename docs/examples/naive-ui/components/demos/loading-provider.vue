<script setup lang='ts'>
import { NButton, NFlex } from 'naive-ui'

function showLoading() {
  window.$loading?.show({
    text: '加载中...',
    duration: 2000,
  })
}
</script>

<template>
  <NFlex>
    <NButton @click="() => showLoading()">
      加载
    </NButton>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
