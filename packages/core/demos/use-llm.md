# UseLLM

## 功能描述

**UseLLM** 是一个基于原生 `fetch` 封装的流式 LLM 请求组合式函数，兼容 OpenAI Chat Completions 协议。它提供了对话记录管理、SSE 流式增量输出、请求中断、对话重置以及自定义分片解析能力，可用于快速接入 OpenAI、DeepSeek、Ollama 等兼容接口的模型服务。

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

| 选项         | 类型                                                          | 默认值                        | 说明                                 |
| ------------ | ------------------------------------------------------------- | ----------------------------- | ------------------------------------ |
| `baseURL`    | `string`                                                      | `'https://api.openai.com/v1'` | 接口基础地址                         |
| `endpoint`   | `string`                                                      | `'/chat/completions'`         | 接口路径，会与 `baseURL` 拼接        |
| `apiKey`     | `string`                                                      | `''`                          | 接口密钥，为空时不携带鉴权头         |
| `model`      | `string`                                                      | `'gpt-4o-mini'`               | 模型名称                             |
| `headers`    | `Record<string, string>`                                      | `{}`                          | 附加请求头                           |
| `body`       | `Record<string, unknown>`                                     | `{}`                          | 附加请求体字段                       |
| `messages`   | `LLMMessage[]`                                                | `[]`                          | 初始对话消息                         |
| `fetch`      | `typeof fetch`                                                | `globalThis.fetch`            | 自定义 fetch 实现                    |
| `parseChunk` | `(data: unknown, raw: string) => string \| undefined \| null` | OpenAI 兼容格式解析           | 自定义分片解析函数，返回空值表示跳过 |

#### 返回值

| 属性                      | 类型                                  | 说明                                             |
| ------------------------- | ------------------------------------- | ------------------------------------------------ |
| `messages`                | `Ref<LLMMessage[]>`                   | 对话记录（包含流式写入的回复）                   |
| `content`                 | `Ref<string>`                         | 当前回复的累计文本                               |
| `loading`                 | `Ref<boolean>`                        | 是否正在请求                                     |
| `completed`               | `Ref<boolean>`                        | 本次请求是否正常完成                             |
| `error`                   | `Ref<Error \| null>`                  | 错误信息                                         |
| `controller`              | `ShallowRef<AbortController \| null>` | 当前请求的中断控制器                             |
| `send(input, overrides?)` | `Function`                            | 发送对话请求，`input` 支持字符串、单条或多条消息 |
| `abort()`                 | `Function`                            | 中断当前请求，已输出内容会保留                   |
| `reset()`                 | `Function`                            | 中断并重置对话与状态                             |
| `onChunk(callback)`       | `Function`                            | 分片事件，参数为 `(增量, 累计内容)`              |
| `onDone(callback)`        | `Function`                            | 完成事件，参数为累计内容                         |
| `onError(callback)`       | `Function`                            | 错误事件，参数为 `Error`                         |

## 类型定义

```ts
export type LLMRole = 'system' | 'user' | 'assistant'

export type LLMMessage = {
  role: LLMRole
  content: string
}

export type LLMRequestOptions = {
  baseURL?: string
  endpoint?: string
  apiKey?: string
  model?: string
  headers?: Record<string, string>
  body?: Record<string, unknown>
}

export type UseLLMOptions = LLMRequestOptions & {
  messages?: LLMMessage[]
  fetch?: typeof fetch
  parseChunk?: (data: unknown, raw: string) => string | undefined | null
}

export type UseLLMReturns = {
  messages: Ref<LLMMessage[]>
  content: Ref<string>
  loading: Ref<boolean>
  completed: Ref<boolean>
  error: Ref<Error | null>
  controller: ShallowRef<AbortController | null>
  send: (input: string | LLMMessage | LLMMessage[], overrides?: Partial<LLMRequestOptions>) => Promise<void>
  abort: () => void
  reset: () => void
  onChunk: (callback: (delta: string, content: string) => void) => () => void
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
