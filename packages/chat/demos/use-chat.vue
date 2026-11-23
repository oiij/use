<script setup lang='ts'>
import type { ChatAvailability, ChatMessage, ChatUser } from '@oiij/chat'
import { useChat } from '@oiij/chat'
import { NAlert, NAvatar, NBadge, NButton, NCard, NFlex, NInput, NTag } from 'naive-ui'
import { computed, ref } from 'vue'

const mine = `chat-demo-user-${Math.random().toString(36).slice(2, 6)}`

const {
  rooms,
  activeId,
  activeRoom,
  activeMessages,
  unreadTotal,
  connected,
  error,
  availability,
  send,
  switchTo,
  markRead,
  sendTyping,
  setAvailability,
  recallMessage,
  disconnect,
  onMention,
} = useChat({
  baseUrl: 'http://localhost:3000',
  userId: mine,
  channels: [
    { id: 'lobby', name: '大厅' },
    { id: 'tech', name: '技术讨论' },
    { id: 'random', name: '随便聊聊' },
  ],
  offlineQueueKey: `__CHAT_DEMO_QUEUE__:${mine}`,
  profile: {
    id: mine,
    avatar: 'https://picsum.photos/200/200',
  },
})

const input = ref('')
const mentionOpen = ref(false)
const pendingMentions = ref<string[]>([])
const quoted = ref<ChatMessage | null>(null)
const mentionNotice = ref('')
const availabilityOptions: { label: string, value: ChatAvailability }[] = [
  { label: '在线', value: 'online' },
  { label: '忙碌', value: 'busy' },
  { label: '离开', value: 'away' },
]

function availabilityLabel(value?: ChatAvailability) {
  return availabilityOptions.find(option => option.value === value)?.label ?? '在线'
}

function availabilityTagType(value?: ChatAvailability) {
  if (value === 'busy') {
    return 'error'
  }
  if (value === 'away') {
    return 'warning'
  }
  return 'success'
}

const mentionCandidates = computed(() =>
  (activeRoom.value?.members ?? []).filter(user => user.id !== mine),
)

onMention(({ message }) => {
  mentionNotice.value = `${message.sender?.name ?? message.senderId} 在消息中 @ 了你`
})

function handleInput() {
  sendTyping()
  mentionOpen.value = /(?:^|\s)@$/.test(input.value)
}

function selectMention(user: ChatUser) {
  input.value = input.value.replace(/@$/, `@${user.name ?? user.id} `)
  if (!pendingMentions.value.includes(user.id)) {
    pendingMentions.value = [...pendingMentions.value, user.id]
  }
  mentionOpen.value = false
}

function handleSend() {
  const text = input.value.trim()
  if (!text) {
    return
  }
  send({
    content: text,
    mentions: pendingMentions.value,
    quoteId: quoted.value?.id,
  })
  input.value = ''
  mentionOpen.value = false
  pendingMentions.value = []
  quoted.value = null
  markRead()
}
</script>

<template>
  <NFlex vertical>
    <NAlert type="info" :bordered="false">
      单条 WebSocket 连接同时订阅多个通道，切换通道自动清零未读。需先启动后端：
      <code>pnpm --filter @oiij/chat dev:server</code>，打开多个浏览器标签页即可实时联调。
      断网时发送的消息会暂存到 localStorage，重连后自动补发。
    </NAlert>
    <NFlex align="center" style="flex-wrap: wrap;">
      <NTag :type="connected ? 'success' : 'warning'">
        {{ connected ? '已连接' : '未连接' }}
      </NTag>
      <NTag>{{ `用户：${mine}` }}</NTag>
      <NTag>{{ `总未读：${unreadTotal}` }}</NTag>
      <NButton
        v-for="option in availabilityOptions"
        :key="option.value"
        size="small"
        :type="availability === option.value ? 'primary' : 'default'"
        @click="setAvailability(option.value)"
      >
        {{ option.label }}
      </NButton>
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
        {{ `在线 ${activeRoom.members.length} 人` }}
      </NTag>
      <NTag
        v-for="user in activeRoom?.members ?? []"
        :key="user.id"
        :type="availabilityTagType(user.availability)"
      >
        {{ `${user.name ?? user.id} · ${availabilityLabel(user.availability)}${user.statusText ? `（${user.statusText}）` : ''}` }}
      </NTag>
      <NTag v-if="activeRoom?.typingUsers.length" type="warning">
        {{ `${activeRoom.typingUsers.join('、')} 正在输入…` }}
      </NTag>
      <NTag v-if="mentionNotice" type="error">
        {{ mentionNotice }}
      </NTag>
    </NFlex>
    <NCard v-for="message in activeMessages" :key="message.id" size="small">
      <template #header>
        <NFlex align="center" style="flex-wrap: wrap;">
          <NAvatar round size="small" :src="message.sender?.avatar">
            <template v-if="!message.sender?.avatar">
              {{ (message.sender?.name ?? message.senderId).slice(0, 1) }}
            </template>
          </NAvatar>
          <NTag :type="message.senderId === mine ? 'info' : 'success'">
            {{ message.sender?.name ?? message.senderId }}
          </NTag>
          <NTag
            v-if="message.sender?.availability && message.sender.availability !== 'online'"
            :type="availabilityTagType(message.sender.availability)"
          >
            {{ availabilityLabel(message.sender.availability) }}
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
          <NTag
            v-if="message.mentions?.length"
            type="info"
          >
            {{ `@ ${message.mentions.map(item => item.name ?? item.id).join('、')}` }}
          </NTag>
          <NTag
            v-if="message.senderId !== mine && message.mentions?.some(item => item.id === mine)"
            type="error"
          >
            @了我
          </NTag>
          <NButton
            v-if="!message.recalled"
            size="tiny"
            quaternary
            @click="quoted = message"
          >
            引用
          </NButton>
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
      <div
        v-if="message.quote"
        style="margin-bottom: 6px; padding: 4px 8px; border-left: 3px solid #909399; background: #f5f7fa; color: #606266; font-size: 12px;"
      >
        {{ `引用 ${message.quote.senderName ?? message.quote.senderId}：${message.quote.recalled ? '该消息已撤回' : message.quote.content}` }}
      </div>
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
    <NFlex v-if="quoted" align="center">
      <NTag type="default" closable @close="quoted = null">
        {{ `引用 ${quoted.sender?.name ?? quoted.senderId}：${quoted.recalled ? '该消息已撤回' : quoted.content}` }}
      </NTag>
    </NFlex>
    <NFlex v-if="mentionOpen" align="center" style="flex-wrap: wrap;">
      <NTag type="info">
        选择要 @ 的人
      </NTag>
      <NButton
        v-for="user in mentionCandidates"
        :key="user.id"
        size="tiny"
        @click="selectMention(user)"
      >
        {{ user.name ?? user.id }}
      </NButton>
      <NTag v-if="!mentionCandidates.length" type="warning">
        暂无其他在线用户
      </NTag>
    </NFlex>
    <NInput
      v-model:value="input"
      placeholder="输入消息，输入 @ 可提及在线用户"
      @input="handleInput"
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
