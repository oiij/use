# UseLLM

## 功能描述

**UseLLM** 是一个基于原生 `fetch` 封装的流式 LLM 请求组合式函数，兼容 OpenAI Chat Completions 协议。它提供了对话记录管理、SSE 流式增量输出、思考/推理过程输出、请求中断、对话重置、本地持久化以及自定义分片解析能力，可用于快速接入 OpenAI、DeepSeek、Ollama 等兼容接口的模型服务。

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

<demo vue="./use-llm.vue" title="UseLLM" />

## API

### `useLLM(options?)`

创建流式 LLM 请求器。

#### 参数

| 参数      | 类型            | 说明     |
| --------- | --------------- | -------- |
| `options` | `UseLLMOptions` | 配置选项 |

#### UseLLMOptions

| 选项         | 类型                                                                      | 默认值                                                | 说明                                                                                                   |
| ------------ | ------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `baseURL`    | `string`                                                                  | `'https://api.openai.com/v1'`                         | 接口基础地址                                                                                           |
| `endpoint`   | `string`                                                                  | `'/chat/completions'`                                 | 接口路径，会与 `baseURL` 拼接                                                                          |
| `apiKey`     | `string`                                                                  | `''`                                                  | 接口密钥，为空时不携带鉴权头                                                                           |
| `model`      | `string`                                                                  | `'gpt-4o-mini'`                                       | 模型名称                                                                                               |
| `headers`    | `Record<string, string>`                                                  | `{}`                                                  | 附加请求头                                                                                             |
| `body`       | `Record<string, unknown>`                                                 | `{}`                                                  | 附加请求体字段                                                                                         |
| `messages`   | `LLMMessage[]`                                                            | `[]`                                                  | 初始对话消息                                                                                           |
| `storage`    | `'localStorage' \| 'sessionStorage' \| LLMStorageAdapter \| false`        | `'localStorage'`                                      | 持久化存储，设为 `false` 关闭持久化                                                                    |
| `storageKey` | `string`                                                                  | `'__USE_LLM__'`                                       | 持久化键名                                                                                             |
| `fetch`      | `typeof fetch`                                                            | `globalThis.fetch`                                    | 自定义 fetch 实现                                                                                      |
| `parseChunk` | `(data: unknown, raw: string) => string \| LLMChunk \| undefined \| null` | 兼容 OpenAI、DeepSeek、Ollama 与 Anthropic 的格式解析 | 自定义分片解析函数，返回字符串视为正文增量，返回 `LLMChunk` 可同时给出正文与推理增量，返回空值表示跳过 |

#### 返回值

| 属性                      | 类型                                  | 说明                                             |
| ------------------------- | ------------------------------------- | ------------------------------------------------ |
| `messages`                | `Ref<LLMMessage[]>`                   | 对话记录（包含流式写入的回复与推理）             |
| `content`                 | `Ref<string>`                         | 当前回复的累计正文                               |
| `reasoning`               | `Ref<string>`                         | 当前回复的累计思考/推理内容                      |
| `loading`                 | `Ref<boolean>`                        | 是否正在请求                                     |
| `completed`               | `Ref<boolean>`                        | 本次请求是否正常完成                             |
| `error`                   | `Ref<Error \| null>`                  | 错误信息                                         |
| `controller`              | `ShallowRef<AbortController \| null>` | 当前请求的中断控制器                             |
| `send(input, overrides?)` | `Function`                            | 发送对话请求，`input` 支持字符串、单条或多条消息 |
| `abort()`                 | `Function`                            | 中断当前请求，已输出内容会保留                   |
| `reset()`                 | `Function`                            | 中断并重置对话与状态                             |
| `onChunk(callback)`       | `Function`                            | 分片事件，参数为 `(增量, 累计正文, 累计推理)`    |
| `onReasoning(callback)`   | `Function`                            | 推理分片事件，参数为 `(增量, 累计推理)`          |
| `onDone(callback)`        | `Function`                            | 完成事件，参数为累计正文                         |
| `onError(callback)`       | `Function`                            | 错误事件，参数为 `Error`                         |

## 类型定义

```ts
export type LLMRole = 'system' | 'user' | 'assistant'

export type LLMMessage = {
  role: LLMRole
  content: string
  reasoning?: string
}

export type LLMChunk = {
  content?: string
  reasoning?: string
}

export type LLMRequestOptions = {
  baseURL?: string
  endpoint?: string
  apiKey?: string
  model?: string
  headers?: Record<string, string>
  body?: Record<string, unknown>
}

export type LLMStorageAdapter = {
  getItem: (key: string) => string | null | Promise<string | null>
  setItem: (key: string, value: string) => void | Promise<void>
  removeItem?: (key: string) => void | Promise<void>
}

export type LLMStorage = 'localStorage' | 'sessionStorage' | LLMStorageAdapter | false

export type UseLLMOptions = LLMRequestOptions & {
  messages?: LLMMessage[]
  storage?: LLMStorage
  storageKey?: string
  fetch?: typeof fetch
  parseChunk?: (data: unknown, raw: string) => string | LLMChunk | undefined | null
}

export type UseLLMReturns = {
  messages: Ref<LLMMessage[]>
  content: Ref<string>
  reasoning: Ref<string>
  loading: Ref<boolean>
  completed: Ref<boolean>
  error: Ref<Error | null>
  controller: ShallowRef<AbortController | null>
  send: (input: string | LLMMessage | LLMMessage[], overrides?: Partial<LLMRequestOptions>) => Promise<void>
  abort: () => void
  reset: () => void
  onChunk: (callback: (delta: string, content: string, reasoning: string) => void) => () => void
  onReasoning: (callback: (delta: string, reasoning: string) => void) => () => void
  onDone: (callback: (content: string) => void) => () => void
  onError: (callback: (error: Error) => void) => () => void
}

export declare function useLLM(options?: UseLLMOptions): UseLLMReturns
```

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { useLLM } from '@oiij/use'

const { content, loading, send } = useLLM({
  apiKey: 'sk-xxx',
  model: 'gpt-4o-mini',
})

function handleSend() {
  send('用一句话介绍 Vue3')
}
</script>

<template>
  <button :disabled="loading" @click="handleSend">
    发送
  </button>
  <pre>{{ content }}</pre>
</template>
```

### 多轮对话

```ts
import { useLLM } from '@oiij/use'

const { messages, content, send } = useLLM({
  apiKey: 'sk-xxx',
  messages: [{ role: 'system', content: '你是一个前端专家' }],
})

await send('解释一下响应式原理')
await send('再举一个例子')
```

### 持久化对话

对话记录默认保存到 `localStorage`，刷新页面后会自动恢复；也可以通过 `storage` 切换到 `sessionStorage`、传入自定义适配器或设为 `false` 关闭持久化：

```ts
import { useLLM } from '@oiij/use'

const { messages, send } = useLLM({
  apiKey: 'sk-xxx',
  storage: 'sessionStorage',
  storageKey: '__MY_LLM__',
})

await send('你好')
```

调用 `reset()` 后，持久化内容会同步覆盖为初始消息。

### 接入其他服务商

```ts
import { useLLM } from '@oiij/use'

const { content, send } = useLLM({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-xxx',
  model: 'deepseek-chat',
  body: { temperature: 0.7 },
})

await send('写一首关于秋天的短诗')
```

### 自定义分片解析

```ts
import { useLLM } from '@oiij/use'

const { content, send } = useLLM({
  baseURL: 'http://localhost:11434/v1',
  model: 'qwen2.5',
  parseChunk: data => (data as any)?.choices?.[0]?.delta?.content,
})

await send('你好')
```

### 接收思考/推理过程

DeepSeek-R1、GLM-Z1 等推理模型会在 `delta.reasoning_content` 中返回思考过程，默认解析器已兼容这类字段，可直接通过 `reasoning` 读取：

```ts
import { useLLM } from '@oiij/use'

const { content, reasoning, send, onReasoning } = useLLM({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-xxx',
  model: 'deepseek-reasoner',
})

onReasoning((delta, full) => console.log('思考:', delta, '累计:', full))

await send('9.11 和 9.8 哪个大？')
console.log(reasoning.value)
console.log(content.value)
```

自定义协议下，可让 `parseChunk` 同时返回正文与推理：

```ts
const { content, reasoning, send } = useLLM({
  parseChunk: (data) => {
    const delta = (data as any)?.choices?.[0]?.delta ?? {}
    return { content: delta.content, reasoning: delta.reasoning_content }
  },
})
```

已支持的内置解析字段：

- OpenAI 兼容：`choices[0].delta.content` / `choices[0].delta.reasoning_content`、`choices[0].delta.reasoning`、`choices[0].delta.thinking`
- Ollama 原生：`message.content` / `message.thinking`
- Anthropic 流式：`content_block_delta` 中的 `text_delta` 与 `thinking_delta`
- OpenAI Responses：`response.output_text.delta` 与 `response.reasoning*.delta`

### 中断与事件监听

```ts
import { useLLM } from '@oiij/use'

const { send, abort, onChunk, onDone, onError } = useLLM({ apiKey: 'sk-xxx' })

onChunk((delta, full) => console.log('增量:', delta, '累计:', full))
onDone(full => console.log('完成:', full))
onError(err => console.error('失败:', err))

send('写一段很长的文本')
abort()
```
