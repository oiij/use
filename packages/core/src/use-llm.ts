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
  /** 自定义分片解析函数，返回字符串表示增量内容，返回空值表示跳过，默认为 OpenAI 兼容格式解析 */
  parseChunk?: (data: unknown, raw: string) => string | undefined | null
}

function extractDelta(data: unknown): string | undefined {
  if (typeof data === 'string') {
    return data
  }
  if (!data || typeof data !== 'object') {
    return undefined
  }
  const record = data as Record<string, any>
  const choice = Array.isArray(record.choices) ? record.choices[0] : undefined
  const candidates = [
    choice?.delta?.content,
    choice?.message?.content,
    choice?.text,
    record.content,
    record.response,
  ]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate) {
      return candidate
    }
  }
  return undefined
}

type ParseChunk = (data: unknown, raw: string) => string | undefined | null

function applyPayload(payload: string, parseChunk: ParseChunk | undefined, emit: (delta: string) => void) {
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
  const delta = parseChunk ? parseChunk(data, payload) : extractDelta(data)
  if (typeof delta === 'string' && delta) {
    emit(delta)
  }
  return false
}

function consumeLine(line: string, parseChunk: ParseChunk | undefined, emit: (delta: string) => void) {
  const value = line.trim()
  if (!value || value.startsWith(':')) {
    return false
  }
  const payload = value.startsWith('data:') ? value.slice(5).trim() : value
  if (!payload) {
    return false
  }
  return applyPayload(payload, parseChunk, emit)
}

function consumeText(text: string, parseChunk: ParseChunk | undefined, emit: (delta: string) => void) {
  const value = text.trim()
  if (!value) {
    return
  }
  if (value.startsWith('data:')) {
    for (const line of value.split('\n')) {
      if (consumeLine(line, parseChunk, emit)) {
        return
      }
    }
    return
  }
  applyPayload(value, parseChunk, emit)
}

async function readStream(stream: ReadableStream<Uint8Array>, parseChunk: ParseChunk | undefined, emit: (delta: string) => void) {
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
      if (consumeLine(line, parseChunk, emit)) {
        ended = true
        break
      }
    }
    if (chunk.done) {
      if (!ended && buffer.trim()) {
        consumeLine(buffer, parseChunk, emit)
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
  /** 增量内容回调，无默认值（必填） */
  emit: (delta: string) => void
  /** 自定义 fetch 实现，默认为 globalThis.fetch */
  fetch?: typeof fetch
  /** 自定义分片解析函数，默认为 OpenAI 兼容格式解析 */
  parseChunk?: ParseChunk
}

/**
 * 发起一次流式 LLM 请求
 * 兼容 OpenAI Chat Completions 协议，负责地址拼接、请求头/请求体组装与 SSE 分片解析，
 * 并通过 emit 回调实时返回增量内容；请求失败时抛出 Error
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
 *   emit: delta => console.log('增量:', delta),
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
  if (response.body && !contentType.includes('application/json')) {
    await readStream(response.body, parseChunk, emit)
  }
  else {
    consumeText(await response.text(), parseChunk, emit)
  }
}

/**
 * 流式 LLM 请求器
 * 基于原生 fetch 封装的流式对话组合式函数，兼容 OpenAI Chat Completions 协议，
 * 支持 SSE 流式增量输出、中断请求、重置对话以及自定义分片解析
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
  const loading: Ref<boolean> = ref(false)
  const completed: Ref<boolean> = ref(false)
  const error: Ref<Error | null> = ref(null)
  const controller: ShallowRef<AbortController | null> = shallowRef(null)

  const onChunkEvent = createEventHook<[delta: string, content: string]>()
  const onDoneEvent = createEventHook<[content: string]>()
  const onErrorEvent = createEventHook<[error: Error]>()

  let requestId = 0

  /**
   * 发送对话请求
   * 将输入追加到对话记录后发起流式请求，增量内容会实时写入 content
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
    const assistantIndex = messages.value.push({ role: 'assistant', content: '' }) - 1
    const assistant = messages.value[assistantIndex]
    const payloadMessages = messages.value.slice(0, -1)
    const emit = (delta: string) => {
      if (currentId !== requestId) {
        return
      }
      content.value += delta
      if (assistant) {
        assistant.content += delta
      }
      onChunkEvent.trigger(delta, content.value)
    }

    content.value = ''
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
      if (assistant && index !== -1 && !assistant.content) {
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
    error.value = null
    completed.value = false
  }

  tryOnScopeDispose(abort)

  return {
    messages,
    content,
    loading,
    completed,
    error,
    controller,
    send,
    abort,
    reset,
    onChunk: onChunkEvent.on,
    onDone: onDoneEvent.on,
    onError: onErrorEvent.on,
  }
}

/**
 * useLLM 函数的返回类型
 * 包含对话记录、流式输出内容、请求状态、控制方法与事件钩子
 * @example
 * const llm: UseLLMReturns = useLLM({ apiKey: 'sk-xxx' })
 */
export type UseLLMReturns = ReturnType<typeof useLLM>
