<script setup lang='ts'>
import { useChatChannel } from '@oiij/chat'
import { NAlert, NAvatar, NButton, NCard, NFlex, NInput, NTag } from 'naive-ui'
import { computed, ref } from 'vue'

const mine = `demo-user-${Math.random().toString(36).slice(2, 6)}`

const {
  messages,
  connected,
  error,
  typingUsers,
  members,
  send,
  sendTyping,
  markRead,
  recallMessage,
  disconnect,
} = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: mine,
  channelId: 'demo-room',
  offlineQueueKey: `__CHAT_DEMO_QUEUE__:${mine}`,
})

const input = ref('')
const mediaUrl = ref('')

const statusType = computed(() => (connected.value ? 'success' : 'warning'))

function handleSend() {
  const text = input.value.trim()
  if (!text) {
    return
  }
  send(text)
  input.value = ''
  markRead()
}

function guessMedia(url: string): { mimeType: string, type: string } {
  const path = (url.split('?')[0] ?? url).toLowerCase()
  if (path.endsWith('.mp4')) {
    return { mimeType: 'video/mp4', type: 'video' }
  }
  if (path.endsWith('.webm')) {
    return { mimeType: 'video/webm', type: 'video' }
  }
  if (path.endsWith('.mp3')) {
    return { mimeType: 'audio/mpeg', type: 'audio' }
  }
  if (path.endsWith('.wav')) {
    return { mimeType: 'audio/wav', type: 'audio' }
  }
  if (path.endsWith('.gif')) {
    return { mimeType: 'image/gif', type: 'image' }
  }
  if (path.endsWith('.webp')) {
    return { mimeType: 'image/webp', type: 'image' }
  }
  return { mimeType: 'image/jpeg', type: 'image' }
}

function handleSendMedia() {
  const url = mediaUrl.value.trim()
  if (!url) {
    return
  }
  const { mimeType, type } = guessMedia(url)
  send({
    content: '',
    type,
    attachments: [{ id: `url-${Date.now()}`, url, mimeType, size: 0 }],
  })
  mediaUrl.value = ''
}
</script>

<template>
  <NFlex vertical>
    <NAlert type="info" :bordered="false">
      需先启动后端：<code>pnpm --filter @oiij/chat dev:server</code>（默认
      <code>http://localhost:3000</code>），打开多个浏览器标签页即可实时联调。
      断网时发送的消息会暂存到 localStorage，重连后自动补发。
    </NAlert>
    <NFlex align="center" style="flex-wrap: wrap;">
      <NTag :type="statusType">
        {{ connected ? '已连接' : '未连接' }}
      </NTag>
      <NTag>通道：demo-room</NTag>
      <NTag>{{ `用户：${mine}` }}</NTag>
      <NTag>{{ `消息数：${messages.length}` }}</NTag>
      <NTag v-if="members.length" type="info">
        {{ `在线 ${members.length} 人：${members.map(user => user.name ?? user.id).join('、')}` }}
      </NTag>
      <NTag v-if="typingUsers.length" type="warning">
        {{ `${typingUsers.join('、')} 正在输入…` }}
      </NTag>
      <NButton size="small" @click="disconnect">
        断开
      </NButton>
    </NFlex>
    <NCard v-for="message in messages" :key="message.id" size="small">
      <template #header>
        <NFlex align="center" style="flex-wrap: wrap;">
          <NAvatar round size="small" :src="message.sender?.avatar">
            {{ (message.sender?.name ?? message.senderId).slice(0, 1) }}
          </NAvatar>
          <NTag :type="message.senderId === mine ? 'info' : 'success'">
            {{ message.sender?.name ?? message.senderId }}
          </NTag>
          <NTag v-if="message.recalled" type="default">
            已撤回
          </NTag>
          <NTag v-else-if="message.status === 'sending'" type="warning">
            发送中
          </NTag>
          <NTag v-else-if="message.status === 'failed'" type="error">
            失败
          </NTag>
          <NTag v-else-if="message.status === 'read'" type="success">
            已读
          </NTag>
          <NTag v-else type="success">
            已送达
          </NTag>
          <NTag v-if="message.readBy?.length" type="info">
            {{ `已读 ${message.readBy.length} 人` }}
          </NTag>
          <NButton
            v-if="message.senderId === mine && !message.recalled"
            size="tiny"
            quaternary
            @click="recallMessage(message.id)"
          >
            撤回
          </NButton>
        </NFlex>
      </template>
      <pre style="margin: 0; white-space: pre-wrap;">{{ message.recalled ? '该消息已撤回' : message.content }}</pre>
      <template v-if="!message.recalled">
        <div v-for="attachment in message.attachments ?? []" :key="attachment.id">
          <img
            v-if="attachment.mimeType.startsWith('image/')"
            :src="attachment.url"
            :alt="attachment.name ?? '图片'"
            style="max-width: 240px; display: block; border-radius: 6px;"
          >
          <video
            v-else-if="attachment.mimeType.startsWith('video/')"
            :src="attachment.url"
            controls
            style="max-width: 240px; display: block;"
          />
          <audio
            v-else-if="attachment.mimeType.startsWith('audio/')"
            :src="attachment.url"
            controls
            style="display: block;"
          />
          <a v-else :href="attachment.url" target="_blank" rel="noreferrer">
            {{ attachment.name ?? attachment.url }}
          </a>
        </div>
      </template>
    </NCard>
    <NInput
      v-model:value="input"
      placeholder="输入消息，回车发送"
      @input="sendTyping"
      @keyup.enter="handleSend"
    />
    <NFlex>
      <NInput
        v-model:value="mediaUrl"
        placeholder="粘贴图片/视频/音频直链，发送媒体消息（预签名直传示例见文档）"
        @keyup.enter="handleSendMedia"
      />
      <NButton :disabled="!connected" @click="handleSendMedia">
        发送媒体
      </NButton>
    </NFlex>
    <NFlex>
      <NButton type="primary" :disabled="!connected" @click="handleSend">
        发送
      </NButton>
    </NFlex>
    <p v-if="error" style="margin: 0; color: #d03050;">
      连接错误
    </p>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
