<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useEventSource } from '@oiij/use'
import { NButton, NCard, NFlex, NScrollbar } from 'naive-ui'
import { ref } from 'vue'

type HandlerEvent<T extends string = 'connect' | 'message'> = Record<T, {
  type: T
  data: string
}>
const url = ref('https://ws-test.liijs.xyz/sse')
const { connect, close, dataRecord, status, registerHandler } = useEventSource<HandlerEvent>(url, {
  manual: true,
  parseMessage: true,
})
registerHandler('connect', (data) => {
  console.log(data)
})
registerHandler('message', (data) => {
  console.log(data)
})
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <div>
        <NButton :type="status === 'OPEN' ? 'warning' : 'default'" @click="() => status === 'OPEN' ? close() : connect()">
          {{ status === 'OPEN' ? 'Close' : 'Connect' }}
        </NButton>
      </div>
    </NFlex>
    <NCard>
      <NScrollbar style="max-height: 200px;">
        <div style="display: flex;flex-direction: column-reverse;">
          <pre v-for="(data, index) in dataRecord" :key="index">{{ `#${index}:${data}` }}</pre>
        </div>
      </NScrollbar>
    </NCard>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
