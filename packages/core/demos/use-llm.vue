<script setup lang='ts'>
import { useLLM } from '@oiij/use'
import { NAlert, NButton, NCard, NFlex, NInput, NSwitch, NTag } from 'naive-ui'
import { ref } from 'vue'

const encoder = new TextEncoder()

const mock = ref(true)
const baseURL = ref('https://api.openai.com/v1')
const apiKey = ref('')
const model = ref('gpt-4o-mini')
const prompt = ref('用一句话介绍一下 Vue3 的响应式原理')

async function mockFetch(_input: RequestInfo | URL, init?: RequestInit) {
  const body = JSON.parse(String(init?.body ?? '{}')) as { messages?: { content: string }[] }
  const last = body.messages?.at(-1)?.content ?? ''
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
          await new Promise(resolve => setTimeout(resolve, 40))
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

const { content, loading, completed, error, messages, send, abort, reset } = useLLM({ fetch: fetcher })

function handleSend() {
  if (!prompt.value.trim()) {
    return
  }
  send(prompt.value, {
    baseURL: baseURL.value,
    apiKey: apiKey.value,
    model: model.value,
  })
}

function handleReset() {
  reset()
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
      <NTag :type="loading ? 'warning' : completed ? 'success' : 'default'">
        {{ loading ? '生成中' : completed ? '已完成' : '待发送' }}
      </NTag>
      <NTag>{{ `消息数：${messages.length}` }}</NTag>
    </NFlex>
    <NFlex>
      <NInput v-model:value="baseURL" :disabled="mock" placeholder="接口地址" />
      <NInput v-model:value="apiKey" :disabled="mock" placeholder="API Key" />
      <NInput v-model:value="model" :disabled="mock" placeholder="模型" />
    </NFlex>
    <NInput v-model:value="prompt" type="textarea" :rows="3" placeholder="输入对话内容" />
    <NFlex>
      <NButton type="primary" :loading="loading" @click="handleSend">
        发送
      </NButton>
      <NButton :disabled="!loading" @click="abort">
        中断
      </NButton>
      <NButton @click="handleReset">
        重置
      </NButton>
    </NFlex>
    <NCard>
      <pre style="margin: 0; white-space: pre-wrap;">{{ content }}</pre>
      <p v-if="error" style="margin: 8px 0 0; color: #d03050;">
        {{ error.message }}
      </p>
    </NCard>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
