<script setup lang='ts'>
import { useChat } from '@oiij/use'
import { NAlert, NButton, NCard, NFlex, NInput, NSwitch, NTag } from 'naive-ui'
import { computed, ref } from 'vue'

const encoder = new TextEncoder()

const mock = ref(true)
const model = ref('gpt-4o-mini')
const prompt = ref('用一句话介绍一下 Vue3 的响应式原理')

async function mockFetch(_input: RequestInfo | URL, init?: RequestInit) {
  const body = JSON.parse(String(init?.body ?? '{}')) as { messages?: { role: string, content: string }[] }
  const last = [...(body.messages ?? [])].reverse().find(item => item.role === 'user')?.content ?? ''
  const text = `（模拟流式输出）你刚才说：${last}`
  const signal = init?.signal
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const char of [...text]) {
          if (signal?.aborted) {
            throw new DOMException('Aborted', 'AbortError')
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: char } }] })}\n\n`))
          await new Promise(resolve => setTimeout(resolve, 30))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
      catch (err) {
        controller.error(err)
      }
    },
  })
  return new Response(stream, { headers: { 'content-type': 'text/event-stream' } })
}

const fetcher: typeof fetch = (input, init) => mock.value ? mockFetch(input, init) : fetch(input, init)

const {
  sessions,
  currentSession,
  currentSessionId,
  messages,
  loading,
  completed,
  error,
  send,
  abort,
  reset,
  regenerate,
  retry,
  removeMessage,
  clearMessages,
  createSession,
  switchSession,
  deleteSession,
  renameSession,
  clearSessions,
} = useChat({
  fetch: fetcher,
  systemPrompt: '你是一个简洁的前端助手',
  storageKey: '__USE_CHAT__',
})

const title = computed({
  get: () => currentSession.value?.title ?? '',
  set: (value: string) => {
    if (currentSession.value) {
      renameSession(currentSession.value.id, value)
    }
  },
})

const statusType = computed(() => {
  if (loading.value) {
    return 'warning'
  }
  if (error.value) {
    return 'error'
  }
  return completed.value ? 'success' : 'default'
})

const statusText = computed(() => {
  if (loading.value) {
    return '生成中'
  }
  if (error.value) {
    return '请求失败'
  }
  return completed.value ? '已完成' : '待发送'
})

function handleSend() {
  if (!prompt.value.trim()) {
    return
  }
  send(prompt.value, { model: model.value })
  prompt.value = ''
}
</script>

<template>
  <NFlex vertical>
    <NAlert v-if="!mock" type="info" :bordered="false">
      请填写可用的接口地址与 API Key，请求由浏览器直接发起。
    </NAlert>
    <NFlex align="center">
      <span>本地模拟流</span>
      <NSwitch v-model:value="mock" />
      <NTag :type="statusType">
        {{ statusText }}
      </NTag>
      <NTag>{{ `会话数：${sessions.length}` }}</NTag>
      <NTag>{{ `消息数：${messages.length}` }}</NTag>
      <NTag>持久化：localStorage</NTag>
    </NFlex>
    <NFlex align="center">
      <NInput v-model:value="model" :disabled="mock" placeholder="模型" />
      <NInput v-model:value="title" placeholder="会话标题" />
    </NFlex>
    <NFlex align="center" style="flex-wrap: wrap;">
      <NButton size="small" type="primary" @click="createSession()">
        新建会话
      </NButton>
      <NTag
        v-for="session in sessions"
        :key="session.id"
        :type="session.id === currentSessionId ? 'primary' : 'default'"
        closable
        style="cursor: pointer;"
        @click="switchSession(session.id)"
        @close="deleteSession(session.id)"
      >
        {{ session.title }}
      </NTag>
      <NButton size="small" quaternary @click="clearSessions">
        清空全部会话
      </NButton>
    </NFlex>
    <NCard v-for="message in messages" :key="message.id" size="small">
      <template #header>
        <NFlex align="center">
          <NTag :type="message.role === 'user' ? 'info' : message.role === 'system' ? 'default' : 'success'">
            {{ message.role }}
          </NTag>
          <NTag v-if="message.status && message.status !== 'done'" type="warning">
            {{ message.status }}
          </NTag>
          <NButton size="tiny" quaternary @click="removeMessage(message.id)">
            删除
          </NButton>
        </NFlex>
      </template>
      <pre style="margin: 0; white-space: pre-wrap;">{{ message.content || '…' }}</pre>
    </NCard>
    <NInput v-model:value="prompt" type="textarea" :rows="3" placeholder="输入对话内容" />
    <NFlex>
      <NButton type="primary" :loading="loading" @click="handleSend">
        发送
      </NButton>
      <NButton :disabled="!loading" @click="abort">
        中断
      </NButton>
      <NButton :disabled="loading || !messages.length" @click="regenerate">
        重新生成
      </NButton>
      <NButton :disabled="loading || !error" @click="retry">
        重试
      </NButton>
      <NButton @click="clearMessages">
        清空消息
      </NButton>
      <NButton @click="reset">
        重置
      </NButton>
    </NFlex>
    <p v-if="error" style="margin: 0; color: #d03050;">
      {{ error.message }}
    </p>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
