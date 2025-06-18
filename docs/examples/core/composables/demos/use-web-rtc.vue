<script setup lang='ts'>
import { NButton, NCard, NFlex, NInput, NInputGroup, NInputGroupLabel } from 'naive-ui'
import { ref, shallowRef } from 'vue'
import { useWebRTC } from '~/core/src'

const value = ref('')
const messageValue = ref('')
const messageList = ref<string[]>([])
const { id, status, connected, connect, onConnection } = useWebRTC(' https://web-rtc-server.liijs.xyz/ws')
const connectHandler = shallowRef<RTCDataChannel>()
async function handleConnect() {
  if (value.value) {
    const handle = await connect(value.value)
    connectHandler.value = handle
    handle.addEventListener('message', (v) => {
      messageList.value.push(`对方:${v.data}`)
    })
  }
}
onConnection((ev) => {
  const handle = ev.channel
  connectHandler.value = handle
  handle.addEventListener('message', (v) => {
    messageList.value.push(`对方:${v.data}`)
  })
})

function handleSendMessage() {
  if (messageValue.value) {
    messageList.value.push(`我:${messageValue.value}`)
    if (connectHandler.value) {
      connectHandler.value.send(messageValue.value)
    }
  }
}
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NInputGroup>
        <NInputGroupLabel>{{ status }}</NInputGroupLabel>
        <NInput v-model:value="value" />
        <NButton @click="handleConnect">
          链接
        </NButton>
      </NInputGroup>
    </NFlex>
    <NFlex>
      <NCard title="本机id" style="flex:1;">
        <pre>{{ id }}</pre>
      </NCard>
      <NCard title="connected" style="flex:1;">
        <pre>{{ connected }}</pre>
      </NCard>
    </NFlex>
    <NCard>
      <pre>{{ messageList }}</pre>
    </NCard>
    <NInputGroup>
      <NInput v-model:value="messageValue" />
      <NButton @click="handleSendMessage">
        发送
      </NButton>
    </NInputGroup>
  </NFlex>
</template>

<style scoped>

</style>
