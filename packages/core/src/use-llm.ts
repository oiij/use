import type { Ref, ShallowRef } from 'vue'
import { createEventHook, tryOnScopeDispose } from '@vueuse/core'
import { ref, shallowRef } from 'vue'

/**
 * 对话角色类型
 * - system: 系统提示词
 * - user: 用户消息
 * - assistant: 模型回复
 */
export type LLMRole = 'system' | 'user' | 'assistant'

/**
 * 对话消息
 * 描述单条对话消息的角色与文本内容
 * @example
 * const message: LLMMessage = { role: 'user', content: '你好' }
 */
export type LLMMessage = {
  /** 消息角色，无默认值（必填） */
  role: LLMRole
  /** 消息文本内容，无默认值（必填） */
  content: string
  /** 思考/推理内容，仅用于展示不会随请求发送，默认为 undefined */
  reasoning?: string
}

/**
 * 流式分片内容
 * 描述单个流式分片中解析出的正文增量与思考/推理增量，两者可同时存在
 * @example
 * const chunk: LLMChunk = { reasoning: '先分析问题……', content: '答案是 42' }
 */
export type LLMChunk = {
  /** 正文增量，默认为 '' */
  content?: string
  /** 思考/推理增量，默认为 '' */
  reasoning?: string
}

/**
 * LLM 请求配置
 * 描述接口地址、鉴权信息以及附加的请求头与请求体
 * @example
 * const options: LLMRequestOptions = {
 *   baseURL: 'https://api.deepseek.com/v1',
 *   apiKey: 'sk-xxx',
 *   model: 'deepseek-chat'
 * }
 */
export type LLMRequestOptions = {
  /** 接口基础地址，默认为 'https://api.openai.com/v1' */
  baseURL?: string
  /** 接口路径，会与 baseURL 拼接，默认为 '/chat/completions' */
  endpoint?: string
  /** 接口密钥，为空时不携带 Authorization 请求头，默认为 '' */
  apiKey?: string
  /** 模型名称，默认为 'gpt-4o-mini' */
  model?: string
  /** 附加请求头，默认为 {} */
  headers?: Record<string, string>
  /** 附加请求体字段，默认为 {} */
  body?: Record<string, unknown>
}

/**
 * useLLM 配置选项
 * 在请求配置基础上增加初始消息、自定义 fetch 与分片解析能力
 * @example
 * const options: UseLLMOptions = {
 *   apiKey: 'sk-xxx',
 *   model: 'gpt-4o-mini',
 *   messages: [{ role: 'system', content: '你是一个助手' }],
 *   parseChunk: data => (data as any)?.choices?.[0]?.delta?.content
 * }
 */
export type UseLLMOptions = LLMRequestOptions & {
  /** 初始对话消息，默认为 [] */
  messages?: LLMMessage[]
  /** 自定义 fetch 实现，默认为 globalThis.fetch */
  fetch?: typeof fetch
  /** 自定义分片解析函数，返回字符串视为正文增量，返回 LLMChunk 可同时给出正文与推理增量，返回空值表示跳过，默认为兼容 OpenAI、DeepSeek、Ollama 与 Anthropic 的格式解析 */
  parseChunk?: ParseChunk
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined
}

function extractChunk(data: unknown): LLMChunk {
  if (typeof data === 'string') {
    return { content: data }
  }
  if (!data || typeof data !== 'object') {
    return {}
  }
  const record = data as Record<string, any>
  if (record.type === 'content_block_delta' && record.delta && typeof record.delta === 'object') {
    const delta = record.delta as Record<string, any>
    if (delta.type === 'thinking_delta') {
      return { reasoning: readString(delta.thinking) }
    }
    if (delta.type === 'text_delta') {
      return { content: readString(delta.text) }
    }
  }
  if (typeof record.type === 'string' && record.type.startsWith('response.')) {
    const delta = readString(record.delta)
    if (record.type.startsWith('response.reasoning')) {
      return { reasoning: delta }
    }
    if (record.type === 'response.output_text.delta') {
      return { content: delta }
    }
  }
  const choice = Array.isArray(record.choices) ? record.choices[0] : undefined
  const message = record.message && typeof record.message === 'object' ? record.message : undefined
  const content = [
    choice?.delta?.content,
    choice?.message?.content,
    choice?.text,
    record.content,
    record.response,
    message?.content,
  ].map(readString).find(Boolean)
  const reasoning = [
    choice?.delta?.reasoning_content,
    choice?.delta?.reasoning,
    choice?.delta?.thinking,
    choice?.message?.reasoning_content,
    choice?.message?.reasoning,
    choice?.message?.thinking,
    message?.reasoning_content,
    message?.reasoning,
    message?.thinking,
    record.reasoning_content,
    record.reasoning,
    record.thinking,
  ].map(readString).find(Boolean)
  return { content, reasoning }
}

type ParseChunk = (data: unknown, raw: string) => string | LLMChunk | undefined | null

function normalizeChunk(result: string | LLMChunk | undefined | null): LLMChunk {
  if (typeof result === 'string') {
    return { content: readString(result) }
  }
  if (!result || typeof result !== 'object') {
    return {}
  }
  return {
    content: readString(result.content),
    reasoning: readString(result.reasoning),
  }
}

function applyPayload(payload: string, parseChunk: ParseChunk | undefined, write: (chunk: LLMChunk) => void) {
  if (payload === '[DONE]') {
    return true
  }
  let data: unknown
  try {
    data = JSON.parse(payload)
  }
  catch {
    data = payload
  }
  write(normalizeChunk(parseChunk ? parseChunk(data, payload) : extractChunk(data)))
  return false
}

function consumeLine(line: string, parseChunk: ParseChunk | undefined, write: (chunk: LLMChunk) => void) {
  const value = line.trim()
  if (!value || value.startsWith(':')) {
    return false
  }
  const payload = value.startsWith('data:') ? value.slice(5).trim() : value
  if (!payload) {
    return false
  }
  return applyPayload(payload, parseChunk, write)
}

function consumeText(text: string, parseChunk: ParseChunk | undefined, write: (chunk: LLMChunk) => void) {
  const value = text.trim()
  if (!value) {
    return
  }
  if (value.startsWith('data:')) {
    for (const line of value.split('\n')) {
      if (consumeLine(line, parseChunk, write)) {
        return
      }
    }
    return
  }
  applyPayload(value, parseChunk, write)
}

async function readStream(stream: ReadableStream<Uint8Array>, parseChunk: ParseChunk | undefined, write: (chunk: LLMChunk) => void) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let ended = false
  while (!ended) {
    const chunk = await reader.read()
    buffer += decoder.decode(chunk.value, { stream: !chunk.done })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (consumeLine(line, parseChunk, write)) {
        ended = true
        break
      }
    }
    if (chunk.done) {
      if (!ended && buffer.trim()) {
        consumeLine(buffer, parseChunk, write)
      }
      ended = true
    }
  }
  await reader.cancel()
  reader.releaseLock()
}

/**
 * 流式 LLM 请求配置
 * 在基础请求配置上指定消息列表、中断信号与增量回调
 * @example
 * const options: StreamLLMOptions = {
 *   apiKey: 'sk-xxx',
 *   model: 'gpt-4o-mini',
 *   messages: [{ role: 'user', content: '你好' }],
 *   emit: delta => console.log(delta)
 * }
 */
export type StreamLLMOptions = LLMRequestOptions & {
  /** 请求消息列表，无默认值（必填） */
  messages: LLMMessage[]
  /** 请求中断信号，默认为 undefined */
  signal?: AbortSignal
  /** 正文增量回调，无默认值（必填） */
  emit: (delta: string) => void
  /** 思考/推理增量回调，未提供时推理内容会被忽略，默认为 undefined */
  emitReasoning?: (delta: string) => void
  /** 自定义 fetch 实现，默认为 globalThis.fetch */
  fetch?: typeof fetch
  /** 自定义分片解析函数，默认为兼容 OpenAI、DeepSeek、Ollama 与 Anthropic 的格式解析 */
  parseChunk?: ParseChunk
}

/**
 * 发起一次流式 LLM 请求
 * 兼容 OpenAI Chat Completions 协议，负责地址拼接、请求头/请求体组装与 SSE 分片解析，
 * 并通过 emit 回调实时返回正文增量、通过可选的 emitReasoning 回调返回思考/推理增量；请求失败时抛出 Error
 *
 * @param options 流式请求配置
 *
 * @example
 * ```ts
 * const controller = new AbortController()
 *
 * await streamLLM({
 *   apiKey: 'sk-xxx',
 *   model: 'gpt-4o-mini',
 *   messages: [{ role: 'user', content: '你好' }],
 *   signal: controller.signal,
 *   emit: delta => console.log('正文:', delta),
 * })
 * ```
 *
 * @example
 * ```ts
 * // 同时接收推理过程与正文
 * await streamLLM({
 *   baseURL: 'https://api.deepseek.com/v1',
 *   apiKey: 'sk-xxx',
 *   model: 'deepseek-reasoner',
 *   messages: [{ role: 'user', content: '9.11 和 9.8 哪个大？' }],
 *   emit: delta => console.log('正文:', delta),
 *   emitReasoning: delta => console.log('思考:', delta),
 * })
 * ```
 */
export async function streamLLM(options: StreamLLMOptions) {
  const {
    baseURL = 'https://api.openai.com/v1',
    endpoint = '/chat/completions',
    apiKey = '',
    model = 'gpt-4o-mini',
    headers = {},
    body = {},
    messages,
    signal,
    emit,
    emitReasoning,
    fetch: fetcher = globalThis.fetch,
    parseChunk,
  } = options
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    ...headers,
  }
  const url = `${baseURL.replace(/\/+$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  if (!fetcher) {
    throw new Error('fetch is not available in current environment')
  }
  const response = await fetcher(url, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      ...body,
      model,
      messages,
      stream: true,
    }),
    signal,
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`LLM request failed with status ${response.status}${detail ? `: ${detail}` : ''}`)
  }
  const contentType = response.headers.get('content-type') ?? ''
  const write = (chunk: LLMChunk) => {
    if (chunk.content) {
      emit(chunk.content)
    }
    if (chunk.reasoning) {
      emitReasoning?.(chunk.reasoning)
    }
  }
  if (response.body && !contentType.includes('application/json')) {
    await readStream(response.body, parseChunk, write)
  }
  else {
    consumeText(await response.text(), parseChunk, write)
  }
}

/**
 * 流式 LLM 请求器
 * 基于原生 fetch 封装的流式对话组合式函数，兼容 OpenAI Chat Completions 协议，
 * 支持 SSE 流式增量输出、思考/推理过程输出、中断请求、重置对话以及自定义分片解析
 *
 * @param options 请求配置选项
 * @returns 对话状态、请求方法以及事件钩子
 *
 * @example
 * ```ts
 * // 基本用法
 * const { content, loading, send } = useLLM({
 *   apiKey: 'sk-xxx',
 *   model: 'gpt-4o-mini',
 * })
 *
 * await send('用一句话介绍 Vue3')
 * ```
 *
 * @example
 * ```ts
 * // 指定服务商并自定义请求体
 * const { content, send } = useLLM({
 *   baseURL: 'https://api.deepseek.com/v1',
 *   apiKey: 'sk-xxx',
 *   model: 'deepseek-chat',
 *   body: { temperature: 0.7 },
 * })
 *
 * send([
 *   { role: 'system', content: '你是一个前端专家' },
 *   { role: 'user', content: '解释一下响应式原理' },
 * ])
 * ```
 *
 * @example
 * ```ts
 * // 中断请求与监听分片
 * const { loading, content, send, abort, onChunk, onDone, onError } = useLLM()
 *
 * onChunk((delta, full) => console.log('增量:', delta, '累计:', full))
 * onDone(full => console.log('完成:', full))
 * onError(err => console.error('失败:', err))
 *
 * send('写一首关于秋天的短诗')
 * abort()
 * ```
 *
 * @example
 * ```ts
 * // 接收思考过程（如 deepseek-reasoner、GLM-Z1 等推理模型）
 * const { content, reasoning, send, onReasoning } = useLLM({
 *   baseURL: 'https://api.deepseek.com/v1',
 *   apiKey: 'sk-xxx',
 *   model: 'deepseek-reasoner',
 * })
 *
 * onReasoning((delta, full) => console.log('思考:', delta, '累计:', full))
 *
 * await send('9.11 和 9.8 哪个大？')
 * console.log(reasoning.value, content.value)
 * ```
 *
 * @example
 * ```ts
 * // 非流式响应或自定义协议：从分片中同时返回正文与推理
 * const { content, reasoning, send } = useLLM({
 *   parseChunk: (data) => {
 *     const delta = (data as any)?.choices?.[0]?.delta ?? {}
 *     return { content: delta.content, reasoning: delta.reasoning_content }
 *   },
 * })
 * ```
 */
export function useLLM(options?: UseLLMOptions) {
  const {
    baseURL = 'https://api.openai.com/v1',
    endpoint = '/chat/completions',
    apiKey = '',
    model = 'gpt-4o-mini',
    headers = {},
    body = {},
    messages: initialMessages = [],
    parseChunk,
  } = options ?? {}
  const fetcher = options?.fetch ?? globalThis.fetch

  const messages: Ref<LLMMessage[]> = ref(initialMessages.map(message => ({ ...message })))
  const content: Ref<string> = ref('')
  const reasoning: Ref<string> = ref('')
  const loading: Ref<boolean> = ref(false)
  const completed: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)
  const controller: ShallowRef<AbortController | null> = shallowRef(null)

  const onChunkEvent = createEventHook<[delta: string, content: string, reasoning: string]>()
  const onReasoningEvent = createEventHook<[delta: string, reasoning: string]>()
  const onDoneEvent = createEventHook<[content: string]>()
  const onErrorEvent = createEventHook<[error: Error]>()

  let requestId = 0

  /**
   * 发送对话请求
   * 将输入追加到对话记录后发起流式请求，正文增量实时写入 content，思考/推理增量实时写入 reasoning
   *
   * @param input 用户输入的文本、单条消息或多条消息
   * @param overrides 本次请求的配置覆盖项
   * @returns 请求完成的 Promise
   *
   * @example
   * ```ts
   * const { send } = useLLM({ apiKey: 'sk-xxx' })
   *
   * await send('你好')
   * await send({ role: 'user', content: '继续' })
   * await send([{ role: 'user', content: '换个话题' }], { model: 'gpt-4o' })
   * ```
   */
  async function send(input: string | LLMMessage | LLMMessage[], overrides?: Partial<LLMRequestOptions>) {
    const currentId = ++requestId
    if (loading.value) {
      abort()
    }

    const request = overrides ?? {}
    const inputs: LLMMessage[] = typeof input === 'string'
      ? [{ role: 'user', content: input }]
      : Array.isArray(input) ? input : [input]

    messages.value.push(...inputs.map(message => ({ ...message })))
    const assistantIndex = messages.value.push({ role: 'assistant', content: '', reasoning: '' }) - 1
    const assistant = messages.value[assistantIndex]
    const payloadMessages = messages.value
      .slice(0, -1)
      .map(message => ({ role: message.role, content: message.content }))
    const emit = (delta: string) => {
      if (currentId !== requestId) {
        return
      }
      content.value += delta
      if (assistant) {
        assistant.content += delta
      }
      onChunkEvent.trigger(delta, content.value, reasoning.value)
    }
    const emitReasoning = (delta: string) => {
      if (currentId !== requestId) {
        return
      }
      reasoning.value += delta
      if (assistant) {
        assistant.reasoning = (assistant.reasoning ?? '') + delta
      }
      onReasoningEvent.trigger(delta, reasoning.value)
    }

    content.value = ''
    reasoning.value = ''
    error.value = null
    completed.value = false
    loading.value = true

    const abortController = new AbortController()
    controller.value = abortController

    try {
      await streamLLM({
        baseURL: request.baseURL ?? baseURL,
        endpoint: request.endpoint ?? endpoint,
        apiKey: request.apiKey ?? apiKey,
        model: request.model ?? model,
        headers: { ...headers, ...request.headers },
        body: { ...body, ...request.body },
        messages: payloadMessages,
        fetch: fetcher,
        parseChunk,
        signal: abortController.signal,
        emit,
        emitReasoning,
      })
      if (currentId === requestId) {
        completed.value = true
        onDoneEvent.trigger(content.value)
      }
    }
    catch (err) {
      if (!abortController.signal.aborted && currentId === requestId) {
        const reason = err instanceof Error ? err : new Error(String(err))
        error.value = reason
        onErrorEvent.trigger(reason)
      }
    }
    finally {
      const index = assistant ? messages.value.indexOf(assistant) : -1
      if (assistant && index !== -1 && !assistant.content && !assistant.reasoning) {
        messages.value.splice(index, 1)
      }
      if (currentId === requestId) {
        loading.value = false
        controller.value = null
      }
    }
  }

  /**
   * 中断当前请求
   * 调用后流式读取会被终止，已输出的内容会保留
   *
   * @example
   * ```ts
   * const { send, abort } = useLLM({ apiKey: 'sk-xxx' })
   *
   * send('写一段很长的文本')
   * abort()
   * ```
   */
  function abort() {
    controller.value?.abort()
    controller.value = null
  }

  /**
   * 重置对话
   * 中断当前请求并清空对话记录、输出内容、错误与完成状态
   *
   * @example
   * ```ts
   * const { send, reset } = useLLM({ apiKey: 'sk-xxx', messages: [{ role: 'system', content: '你是助手' }] })
   *
   * await send('你好')
   * reset()
   * ```
   */
  function reset() {
    abort()
    messages.value = initialMessages.map(message => ({ ...message }))
    content.value = ''
    reasoning.value = ''
    error.value = null
    completed.value = false
  }

  tryOnScopeDispose(abort)

  return {
    messages,
    content,
    reasoning,
    loading,
    completed,
    error,
    controller,
    send,
    abort,
    reset,
    onChunk: onChunkEvent.on,
    onReasoning: onReasoningEvent.on,
    onDone: onDoneEvent.on,
    onError: onErrorEvent.on,
  }
}

/**
 * useLLM 函数的返回类型
 * 包含对话记录、流式输出内容、思考/推理内容、请求状态、控制方法与事件钩子
 * @example
 * const llm: UseLLMReturns = useLLM({ apiKey: 'sk-xxx' })
 */
export type UseLLMReturns = ReturnType<typeof useLLM>
