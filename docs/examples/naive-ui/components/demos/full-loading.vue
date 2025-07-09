<script setup lang='ts'>
import { NButton, NFlex, NSpin } from 'naive-ui'
import { ref } from 'vue'
import { NFullLoading } from '~/naive-ui/src/components'

const show = ref(false)
function showLoading(time = 1000 * 1) {
  show.value = true
  setTimeout(() => {
    show.value = false
  }, time)
}
</script>

<template>
  <NFlex>
    <NButton @click="() => showLoading()">
      加载
    </NButton>
    <NSpin />
    <NFullLoading :show="show" />
  </NFlex>
</template>

<style scoped lang='less'>

</style>
