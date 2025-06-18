<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useNumberAnimation } from '@oiij/use'
import { NButton, NFlex, NInputNumber, NProgress } from 'naive-ui'
import { ref } from 'vue'

const num = ref(100)
const { value, start } = useNumberAnimation(num, {
  manual: true,
  from: 0,
  duration: 1000 * 3,
  easing: 'easeIn',
})
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NButton @click="() => start()">
        开始
      </NButton>
      <NInputNumber v-model:value="num" />
    </NFlex>
    <NProgress :percentage="Number(value)" />
    <div>{{ value }}</div>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
