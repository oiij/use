<script setup lang='ts'>
import { useChatRoom } from '@oiij/chat'
import { NAlert, NAvatar, NBadge, NButton, NCard, NFlex, NInput, NTag } from 'naive-ui'
import { computed, ref } from 'vue'

const mine = `room-demo-user-${Math.random().toString(36).slice(2, 6)}`

const {
  rooms,
  activeId,
  activeMessages,
  unreadTotal,
  connected,
  error,
  send,
  switchTo,
  markRead,
  sendTyping,
  recallMessage,
  disconnect,
} = useChatRoom({
  baseUrl: 'http://localhost:3000',
  userId: mine,
  channels: [
    { id: 'lobby', name: '大厅' },
    { id: 'tech', name: '技术讨论' },
    { id: 'random', name: '随便聊聊' },
  ],
  offlineQueueKey: `__CHAT_ROOM_QUEUE__:${mine}`,
})

const input = ref('')

const activeRoom = computed(() => rooms.value.find(room => room.id === activeId.value))

function handleSend() {
  const text = input.value.trim()
  if (!text) {
    return
  }
  send(text)
  input.value = ''
  markRead()
}
</script>

<template>
  <NFlex vertical>
    <NAlert type="info" :bordered="false">
      单条 WebSocket 连接同时订阅多个通道，切换通道自动清零未读。需先启动后端：
      <code>pnpm --filter @oiij/chat dev:server</code>
    </NAlert>
    <NFlex align="center" style="flex-wrap: wrap;">
      <NTag :type="connected ? 'success' : 'warning'">
        {{ connected ? '已连接' : '未连接' }}
      </NTag>
      <NTag>{{ `用户：${mine}` }}</NTag>
      <NTag>{{ `总未读：${unreadTotal}` }}</NTag>
      <NButton size="small" @click="disconnect">
        断开
      </NButton>
    </NFlex>
    <NFlex align="center" style="flex-wrap: wrap;">
      <NBadge
        v-for="room in rooms"
        :key="room.id"
        :value="room.unread"
        :show="room.unread > 0"
      >
        <NButton
          size="small"
          :type="room.id === activeId ? 'primary' : 'default'"
          @click="switchTo(room.id)"
        >
          {{ room.name }}
        </NButton>
      </NBadge>
    </NFlex>
    <NFlex align="center">
      <NTag type="info">
        {{ `当前：${activeRoom?.name ?? '-'}` }}
      </NTag>
      <NTag v-if="activeRoom?.members.length" type="info">
        {{ `在线 ${activeRoom.members.length} 人：${activeRoom.members.map(user => user.name ?? user.id).join('、')}` }}
      </NTag>
      <NTag v-if="activeRoom?.typingUsers.length" type="warning">
        {{ `${activeRoom.typingUsers.join('、')} 正在输入…` }}
      </NTag>
    </NFlex>
    <NCard v-for="message in activeMessages" :key="message.id" size="small">
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
          <NTag v-else-if="message.status === 'read'" type="success">
            已读
          </NTag>
          <NTag v-else type="warning">
            {{ message.status }}
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
