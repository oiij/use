<script setup lang='ts'>
import { NConfigProviders } from '@oiij/naive-ui/components'
import { NButton, NFlex } from 'naive-ui'

function showLoading() {
  window.$loading?.show({
    text: '加载中...',
    duration: 2000,
  })
}
</script>

<template>
  <NConfigProviders>
    <NFlex>
      <NButton @click="() => showLoading()">
        加载
      </NButton>
    </NFlex>
  </NConfigProviders>
</template>

<style scoped lang='less'>

</style>
