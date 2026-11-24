<script setup lang="ts">
import { useWebRTC } from '@oiij/web-rtc'
import { NButton, NCard, NFlex, NInput, NInputGroup, NInputGroupLabel, NTag } from 'naive-ui'
import { onUnmounted, ref } from 'vue'

const target = ref('')
const messageValue = ref('')
const messageList = ref<string[]>([])

const { id, status, peers, connect, onChannel, onStateChange, onError } = useWebRTC('ws://localhost:4100/ws')

const channels = new Map<string, RTCDataChannel>()

function bindChannel(key: string, channel: RTCDataChannel) {
  channels.set(key, channel)
  channel.onmessage = ev => messageList.value.push(`${key}:${ev.data}`)
}

onChannel(({ key, channel }) => bindChannel(key, channel))
onStateChange(({ key, status }) => messageList.value.push(`${key} -> ${status}`))
onError(({ error }) => messageList.value.push(`错误: ${error instanceof Error ? error.message : String(error)}`))

function handleConnect() {
  if (!target.value) {
    return
  }
  const channel = connect(target.value, { label: 'chat' })
  if (channel) {
    bindChannel(target.value, channel)
  }
}

function handleSendMessage() {
  if (!messageValue.value) {
    return
  }
  messageList.value.push(`我:${messageValue.value}`)
  for (const channel of channels.values()) {
    if (channel.readyState === 'open') {
      channel.send(messageValue.value)
    }
  }
}

onUnmounted(() => channels.clear())
</script>

<template>
  <NFlex vertical>
    <NFlex align="center">
      <NTag type="info">
        {{ status }}
      </NTag>
      <NInputGroup>
        <NInputGroupLabel>目标 ID</NInputGroupLabel>
        <NInput v-model:value="target" />
        <NButton @click="handleConnect">
          连接
        </NButton>
      </NInputGroup>
    </NFlex>
    <NFlex>
      <NCard title="本机 ID" style="flex:1;">
        <pre>{{ id }}</pre>
      </NCard>
      <NCard title="对端状态" style="flex:1;">
        <pre>{{ peers }}</pre>
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
