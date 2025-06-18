<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useTypeWriter } from '@oiij/use'
import { NButton, NFlex, NProgress } from 'naive-ui'
import { ref } from 'vue'

const value = ref('TypeWriter 打字组件TypeWriter 打字组件TypeWriter 打字组件TypeWriter 打字组件')
const { typedValue, progress, restart, pause, resume, stop, onStat, onStop } = useTypeWriter(value)
onStat(() => {
  console.log('start')
})
onStop((v) => {
  console.log(v)
})
</script>

<template>
  <NFlex vertical>
    <NProgress type="line" :percentage="progress" indicator-placement="inside" />
    <p>{{ typedValue }}</p>
    <NFlex>
      <NButton @click="restart">
        开始
      </NButton>
      <NButton @click="pause">
        暂停
      </NButton>
      <NButton @click="resume">
        继续
      </NButton>
      <NButton @click="stop">
        停止
      </NButton>
    </NFlex>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
