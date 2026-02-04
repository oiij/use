<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useWebSocket } from '@oiij/use'
import { NButton, NCard, NFlex, NInput, NInputGroup, NScrollbar } from 'naive-ui'
import { ref } from 'vue'

type HandlerEvent<T extends string = 'connect' | 'message'> = Record<T, {
  type: T
  data: string
}>
const url = ref('https://ws-test.liijs.xyz/ws')
const inputValue = ref('')
const { connect, close, sendRaw, dataRecord, status, registerHandler } = useWebSocket<HandlerEvent>(url, {
  manual: false,
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
        <NButton @click="() => url = 'wss://ws-test.liijs.xyz/wss'">
          ChangeUrl
        </NButton>
      </div>
      <div>
        <NInputGroup>
          <NInput v-model:value="inputValue" />
          <NButton @click="() => sendRaw(inputValue)">
            Send
          </NButton>
        </NInputGroup>
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
