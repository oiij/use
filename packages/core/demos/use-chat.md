# UseChat

## 功能描述

**UseChat** 是一个多会话聊天组合式函数，基于流式请求提供完整的多轮对话能力。它在消息列表、流式输出与请求中断的基础上，增加了会话管理、消息状态维护、思考/推理过程记录、重新生成、失败重试、消息增删改，以及可配置的本地持久化。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./use-chat.vue" title="UseChat" />

## API

### `useChat(options?)`

创建多会话聊天实例。

#### 参数

| 参数      | 类型             | 说明     |
| --------- | ---------------- | -------- |
| `options` | `UseChatOptions` | 配置选项 |

#### UseChatOptions

| 选项           | 类型                                                                      | 默认值                                                | 说明                                                                                                   |
| -------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `baseURL`      | `string`                                                                  | `'https://api.openai.com/v1'`                         | 接口基础地址                                                                                           |
| `endpoint`     | `string`                                                                  | `'/chat/completions'`                                 | 接口路径，会与 `baseURL` 拼接                                                                          |
| `apiKey`       | `string`                                                                  | `''`                                                  | 接口密钥，为空时不携带鉴权头                                                                           |
| `model`        | `string`                                                                  | `'gpt-4o-mini'`                                       | 模型名称                                                                                               |
| `headers`      | `Record<string, string>`                                                  | `{}`                                                  | 附加请求头                                                                                             |
| `body`         | `Record<string, unknown>`                                                 | `{}`                                                  | 附加请求体字段                                                                                         |
| `messages`     | `ChatInputMessage[]`                                                      | `[]`                                                  | 初始会话消息                                                                                           |
| `systemPrompt` | `string`                                                                  | `''`                                                  | 系统提示词，作为每个新会话的首条消息                                                                   |
| `fetch`        | `typeof fetch`                                                            | `globalThis.fetch`                                    | 自定义 fetch 实现                                                                                      |
| `parseChunk`   | `(data: unknown, raw: string) => string \| LLMChunk \| undefined \| null` | 兼容 OpenAI、DeepSeek、Ollama 与 Anthropic 的格式解析 | 自定义分片解析函数，返回字符串视为正文增量，返回 `LLMChunk` 可同时给出正文与推理增量，返回空值表示跳过 |
| `storage`      | `ChatStorage`                                                             | `'localStorage'`                                      | 持久化存储，传 `false` 关闭                                                                            |
| `storageKey`   | `string`                                                                  | `'__USE_CHAT__'`                                      | 持久化键名                                                                                             |
| `maxSessions`  | `number`                                                                  | `20`                                                  | 最大会话数量，超出按更新时间淘汰                                                                       |
| `titleLength`  | `number`                                                                  | `20`                                                  | 自动生成会话标题的最大字符数                                                                           |

#### 返回值

| 属性                                  | 类型                                    | 说明                                          |
| ------------------------------------- | --------------------------------------- | --------------------------------------------- |
| `sessions`                            | `Ref<ChatSession[]>`                    | 全部会话列表                                  |
| `currentSessionId`                    | `Ref<string>`                           | 当前会话标识                                  |
| `currentSession`                      | `ComputedRef<ChatSession \| undefined>` | 当前会话                                      |
| `messages`                            | `ComputedRef<ChatMessage[]>`            | 当前会话的消息列表                            |
| `lastMessage`                         | `ComputedRef<ChatMessage \| undefined>` | 当前会话最后一条消息                          |
| `lastAssistantMessage`                | `ComputedRef<ChatMessage \| undefined>` | 当前会话最后一条助手消息                      |
| `content`                             | `ComputedRef<string>`                   | 当前会话最后一条助手消息的内容                |
| `reasoning`                           | `ComputedRef<string>`                   | 当前会话最后一条助手消息的思考/推理内容       |
| `loading`                             | `ComputedRef<boolean>`                  | 当前会话是否正在请求                          |
| `completed`                           | `ComputedRef<boolean>`                  | 当前会话本次请求是否正常完成                  |
| `error`                               | `ComputedRef<Error \| null>`            | 当前会话的错误信息                            |
| `send(input, overrides?)`             | `Function`                              | 发送消息，`input` 支持字符串、单条或多条输入  |
| `abort()`                             | `Function`                              | 中断当前会话的请求                            |
| `reset()`                             | `Function`                              | 中断请求并重置当前会话，仅保留系统提示词      |
| `regenerate()`                        | `Function`                              | 移除末尾回答并重新生成                        |
| `retry()`                             | `Function`                              | 失败后使用上一次配置重新发起请求              |
| `removeMessage(id)`                   | `Function`                              | 删除单条消息                                  |
| `clearMessages()`                     | `Function`                              | 清空当前会话全部消息                          |
| `updateMessage(id, content, resend?)` | `Function`                              | 更新消息内容，可选择重新发起请求              |
| `createSession(title?, messages?)`    | `Function`                              | 新建并切换到新会话                            |
| `switchSession(id)`                   | `Function`                              | 切换会话                                      |
| `deleteSession(id)`                   | `Function`                              | 删除会话，删除当前会话时自动切换              |
| `renameSession(id, title)`            | `Function`                              | 重命名会话                                    |
| `clearSessions()`                     | `Function`                              | 清空全部会话并创建一个新会话                  |
| `setOptions(options)`                 | `Function`                              | 运行时更新请求配置与系统提示词                |
| `onChunk(callback)`                   | `Function`                              | 分片事件，参数为 `(增量, 累计内容, 会话)`     |
| `onReasoning(callback)`               | `Function`                              | 推理分片事件，参数为 `(增量, 累计推理, 会话)` |
| `onDone(callback)`                    | `Function`                              | 完成事件，参数为 `(助手消息, 会话)`           |
| `onError(callback)`                   | `Function`                              | 错误事件，参数为 `(Error, 会话)`              |

## 类型定义

```ts
export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessageStatus = 'pending' | 'streaming' | 'done' | 'error'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  reasoning?: string
  createdAt: number
  status?: ChatMessageStatus
}

export type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export type ChatInputMessage = {
  role?: ChatRole
  content: string
}

export type ChatInput = string | ChatInputMessage | ChatInputMessage[]

export type ChatStorageAdapter = {
  getItem: (key: string) => string | null | Promise<string | null>
  setItem: (key: string, value: string) => void | Promise<void>
  removeItem?: (key: string) => void | Promise<void>
}

export type ChatStorage = 'localStorage' | 'sessionStorage' | ChatStorageAdapter | false

export type UseChatOptions = Omit<UseLLMOptions, 'messages'> & {
  messages?: ChatInputMessage[]
  systemPrompt?: string
  storage?: ChatStorage
  storageKey?: string
  maxSessions?: number
  titleLength?: number
}

export declare function useChat(options?: UseChatOptions): UseChatReturns
```

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { useChat } from '@oiij/use'

const { messages, loading, send } = useChat({
  apiKey: 'sk-xxx',
  systemPrompt: '你是一个前端专家',
})

function handleSend() {
  send('用一句话介绍 Vue3')
}
</script>

<template>
  <button :disabled="loading" @click="handleSend">
    发送
  </button>
  <div v-for="message in messages" :key="message.id">
    <b>{{ message.role }}</b>：{{ message.content }}
  </div>
</template>
```

### 多会话管理

```ts
import { useChat } from '@oiij/use'

const {
  sessions,
  createSession,
  switchSession,
  deleteSession,
  renameSession,
  send,
} = useChat({ apiKey: 'sk-xxx', maxSessions: 10 })

const session = createSession('需求讨论')
renameSession(session.id, '组件设计')
await send('帮我设计一个聊天组件')

switchSession(sessions.value[0]!.id)
deleteSession(session.id)
```

### 持久化配置

```ts
import { useChat } from '@oiij/use'

// 使用会话级存储
useChat({ storage: 'sessionStorage' })

// 关闭持久化
useChat({ storage: false })

// 自定义存储介质
useChat({
  storage: {
    getItem: key => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: key => localStorage.removeItem(key),
  },
  storageKey: '__USE_CHAT__',
})
```

### 重新生成与失败重试

```ts
import { useChat } from '@oiij/use'

const { send, regenerate, retry, abort, error } = useChat({
  apiKey: 'sk-xxx',
})

await send('给出三个书名')
await regenerate()

if (error.value) {
  await retry()
}

abort()
```

### 事件监听

```ts
import { useChat } from '@oiij/use'

const { send, onChunk, onDone, onError } = useChat({ apiKey: 'sk-xxx' })

onChunk((delta, content, session) => {
  console.log(session.id, '增量:', delta, '累计:', content)
})
onDone((message, session) => {
  console.log(session.id, '完成:', message.content)
})
onError((err, session) => {
  console.error(session.id, '失败:', err)
})

await send('写一首关于秋天的短诗')
```

### 记录思考/推理过程

推理模型返回的思考内容会写入对应助手消息的 `reasoning` 字段，并持久化到本地：

```ts
import { useChat } from '@oiij/use'

const { messages, reasoning, send, onReasoning } = useChat({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-xxx',
  model: 'deepseek-reasoner',
})

onReasoning((delta, full, session) => {
  console.log(session.id, '思考增量:', delta)
})

await send('9.11 和 9.8 哪个大？')
console.log(reasoning.value)

// 渲染时按消息展示
for (const message of messages.value) {
  console.log(message.reasoning, message.content)
}
```

自定义协议下，可让 `parseChunk` 同时返回正文与推理：

```ts
const { send } = useChat({
  parseChunk: (data) => {
    const delta = (data as any)?.choices?.[0]?.delta ?? {}
    return { content: delta.content, reasoning: delta.reasoning_content }
  },
})
```
