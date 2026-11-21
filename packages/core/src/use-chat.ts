import type { Ref } from 'vue'
import type { LLMRequestOptions, UseLLMOptions } from './use-llm'
import { createEventHook } from '@vueuse/core'
import { computed, getCurrentScope, onScopeDispose, reactive, ref, watch } from 'vue'
import { streamLLM } from './use-llm'

/**
 * 对话角色类型
 * - system: 系统提示词
 * - user: 用户消息
 * - assistant: 模型回复
 */
export type ChatRole = 'system' | 'user' | 'assistant'

/**
 * 消息状态类型
 * - pending: 等待发送
 * - streaming: 流式输出中
 * - done: 已完成
 * - error: 请求失败
 */
export type ChatMessageStatus = 'pending' | 'streaming' | 'done' | 'error'

/**
 * 会话消息
 * 描述单条消息的标识、角色、内容与状态
 * @example
 * const message: ChatMessage = {
 *   id: 'msg-1',
 *   role: 'user',
 *   content: '你好',
 *   createdAt: Date.now(),
 *   status: 'done'
 * }
 */
export type ChatMessage = {
  /** 消息唯一标识，无默认值（必填） */
  id: string
  /** 消息角色，无默认值（必填） */
  role: ChatRole
  /** 消息文本内容，无默认值（必填） */
  content: string
  /** 创建时间戳（毫秒），无默认值（必填） */
  createdAt: number
  /** 消息状态，默认为 'done' */
  status?: ChatMessageStatus
}

/**
 * 会话
 * 描述一个独立对话会话的标识、标题、消息列表与时间信息
 * @example
 * const session: ChatSession = {
 *   id: 'session-1',
 *   title: '新对话',
 *   messages: [],
 *   createdAt: Date.now(),
 *   updatedAt: Date.now()
 * }
 */
export type ChatSession = {
  /** 会话唯一标识，无默认值（必填） */
  id: string
  /** 会话标题，默认为 '新对话' */
  title: string
  /** 会话消息列表，默认为 [] */
  messages: ChatMessage[]
  /** 创建时间戳（毫秒），无默认值（必填） */
  createdAt: number
  /** 更新时间戳（毫秒），无默认值（必填） */
  updatedAt: number
}

/**
 * 输入消息
 * 用于发送与初始化会话，不要求消息标识与时间戳
 * @example
 * const input: ChatInputMessage = { role: 'user', content: '你好' }
 */
export type ChatInputMessage = {
  /** 消息角色，默认为 'user' */
  role?: ChatRole
  /** 消息文本内容，无默认值（必填） */
  content: string
}

/**
 * 发送输入类型
 * - string: 视为一条用户消息
 * - ChatInputMessage: 单条输入消息
 * - ChatInputMessage[]: 多条输入消息
 */
export type ChatInput = string | ChatInputMessage | ChatInputMessage[]

/**
 * 持久化适配器
 * 描述自定义存储介质需要实现的最小接口
 * @example
 * const adapter: ChatStorageAdapter = {
 *   getItem: key => localStorage.getItem(key),
 *   setItem: (key, value) => localStorage.setItem(key, value),
 *   removeItem: key => localStorage.removeItem(key)
 * }
 */
export type ChatStorageAdapter = {
  /** 读取存储内容，无默认值（必填） */
  getItem: (key: string) => string | null | Promise<string | null>
  /** 写入存储内容，无默认值（必填） */
  setItem: (key: string, value: string) => void | Promise<void>
  /** 移除存储内容，默认为 undefined */
  removeItem?: (key: string) => void | Promise<void>
}

/**
 * 持久化存储类型
 * - 'localStorage': 使用浏览器本地存储
 * - 'sessionStorage': 使用浏览器会话存储
 * - ChatStorageAdapter: 自定义存储适配器
 * - false: 关闭持久化
 */
export type ChatStorage = 'localStorage' | 'sessionStorage' | ChatStorageAdapter | false

/**
 * useChat 配置选项
 * 在请求配置基础上增加系统提示词、持久化、会话数量与标题长度等能力
 * @example
 * const options: UseChatOptions = {
 *   apiKey: 'sk-xxx',
 *   model: 'gpt-4o-mini',
 *   systemPrompt: '你是一个助手',
 *   storageKey: '__USE_CHAT__',
 *   maxSessions: 20
 * }
 */
export type UseChatOptions = Omit<UseLLMOptions, 'messages'> & {
  /** 初始会话消息，默认为 [] */
  messages?: ChatInputMessage[]
  /** 系统提示词，会作为每个新会话的首条消息，默认为 '' */
  systemPrompt?: string
  /** 持久化存储，默认为 'localStorage' */
  storage?: ChatStorage
  /** 持久化键名，默认为 'use-chat' */
  storageKey?: string
  /** 最大会话数量，超出后按更新时间淘汰，默认为 20 */
  maxSessions?: number
  /** 自动生成的会话标题最大字符数，默认为 20 */
  titleLength?: number
}

type ChatRuntime = {
  requestId: number
  loading: boolean
  completed: boolean
  error: Error | null
  controller: AbortController | null
  lastOverrides?: Partial<LLMRequestOptions>
}

type PersistedChat = {
  version: number
  currentSessionId: string
  sessions: ChatSession[]
}

const DEFAULT_TITLE = '新对话'

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function isPromise<T>(value: unknown): value is Promise<T> {
  return !!value && typeof (value as Promise<T>).then === 'function'
}

function resolveStorage(storage: ChatStorage | undefined): ChatStorageAdapter | null {
  if (storage === false) {
    return null
  }
  if (storage && typeof storage === 'object') {
    return storage
  }
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return storage === 'sessionStorage' ? window.sessionStorage : window.localStorage
  }
  catch {
    return null
  }
}

function normalizeSession(value: unknown): ChatSession | null {
  if (!value || typeof value !== 'object') {
    return null
  }
  const record = value as ChatSession
  if (typeof record.id !== 'string' || !Array.isArray(record.messages)) {
    return null
  }
  const messages = record.messages
    .filter(message => message && typeof message.content === 'string')
    .map(message => ({
      id: typeof message.id === 'string' ? message.id : createId(),
      role: message.role === 'system' || message.role === 'user' || message.role === 'assistant' ? message.role : 'user',
      content: message.content,
      createdAt: typeof message.createdAt === 'number' ? message.createdAt : Date.now(),
      status: message.status === 'streaming' ? 'done' : message.status ?? 'done',
    }))
  return {
    id: record.id,
    title: typeof record.title === 'string' && record.title ? record.title : DEFAULT_TITLE,
    messages,
    createdAt: typeof record.createdAt === 'number' ? record.createdAt : Date.now(),
    updatedAt: typeof record.updatedAt === 'number' ? record.updatedAt : Date.now(),
  }
}

/**
 * 多会话聊天组合式函数
 * 在流式请求基础上提供多会话管理、消息状态维护、重新生成、失败重试、
 * 消息增删改以及可配置的本地持久化能力
 *
 * @param options 聊天配置选项
 * @returns 会话列表、当前会话、消息状态、控制方法与事件钩子
 *
 * @example
 * ```ts
 * // 基本用法
 * const { messages, loading, send } = useChat({
 *   apiKey: 'sk-xxx',
 *   model: 'gpt-4o-mini',
 *   systemPrompt: '你是一个前端专家',
 * })
 *
 * await send('用一句话介绍 Vue3')
 * ```
 *
 * @example
 * ```ts
 * // 多会话与自定义存储
 * const { sessions, createSession, switchSession, deleteSession, send } = useChat({
 *   apiKey: 'sk-xxx',
 *   storage: 'sessionStorage',
 *   storageKey: '__USE_CHAT__',
 *   maxSessions: 10,
 * })
 *
 * const session = createSession('新话题')
 * await send('你好')
 * switchSession(sessions.value[0]!.id)
 * ```
 *
 * @example
 * ```ts
 * // 事件监听与重新生成
 * const { send, regenerate, retry, abort, onChunk, onDone, onError } = useChat()
 *
 * onChunk((delta, content) => console.log('增量:', delta, '累计:', content))
 * onDone(message => console.log('完成:', message.content))
 * onError(err => console.error('失败:', err))
 *
 * await send('写一首关于秋天的短诗')
 * await regenerate()
 * abort()
 * ```
 */
export function useChat(options?: UseChatOptions) {
  const config = {
    baseURL: options?.baseURL ?? 'https://api.openai.com/v1',
    endpoint: options?.endpoint ?? '/chat/completions',
    apiKey: options?.apiKey ?? '',
    model: options?.model ?? 'gpt-4o-mini',
    headers: options?.headers ?? {},
    body: options?.body ?? {},
    systemPrompt: options?.systemPrompt ?? '',
    storageKey: options?.storageKey ?? '__USE_CHAT__',
    maxSessions: Math.max(1, options?.maxSessions ?? 20),
    titleLength: options?.titleLength ?? 20,
    fetch: options?.fetch ?? globalThis.fetch,
    parseChunk: options?.parseChunk,
  }
  const storage = resolveStorage(options?.storage ?? 'localStorage')

  const sessions: Ref<ChatSession[]> = ref([])
  const currentSessionId: Ref<string> = ref('')
  const runtimes = reactive<Record<string, ChatRuntime>>({})

  const onChunkEvent = createEventHook<[delta: string, content: string, session: ChatSession]>()
  const onDoneEvent = createEventHook<[message: ChatMessage, session: ChatSession]>()
  const onErrorEvent = createEventHook<[error: Error, session: ChatSession]>()

  let hydrated = false
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  const currentSession = computed(() => sessions.value.find(session => session.id === currentSessionId.value))
  const messages = computed(() => currentSession.value?.messages ?? ([] as ChatMessage[]))
  const lastMessage = computed(() => messages.value.at(-1))
  const lastAssistantMessage = computed(() => {
    const list = messages.value
    for (let index = list.length - 1; index >= 0; index--) {
      const message = list[index]
      if (message?.role === 'assistant') {
        return message
      }
    }
    return undefined
  })
  const content = computed(() => lastAssistantMessage.value?.content ?? '')
  const loading = computed(() => runtimes[currentSessionId.value]?.loading ?? false)
  const completed = computed(() => runtimes[currentSessionId.value]?.completed ?? false)
  const error = computed(() => runtimes[currentSessionId.value]?.error ?? null)

  function ensureRuntime(id: string): ChatRuntime {
    let runtime = runtimes[id]
    if (!runtime) {
      runtime = {
        requestId: 0,
        loading: false,
        completed: false,
        error: null,
        controller: null,
      }
      runtimes[id] = runtime
    }
    return runtime
  }

  function createInitialMessages(inputs: ChatInputMessage[] = []): ChatMessage[] {
    const now = Date.now()
    const list: ChatMessage[] = []
    const hasSystem = inputs.some(input => input.role === 'system')
    if (config.systemPrompt && !hasSystem) {
      list.push({ id: createId(), role: 'system', content: config.systemPrompt, createdAt: now, status: 'done' })
    }
    for (const input of inputs) {
      list.push({ id: createId(), role: input.role ?? 'user', content: input.content, createdAt: now, status: 'done' })
    }
    return list
  }

  function buildSession(title?: string, inputs: ChatInputMessage[] = []): ChatSession {
    const now = Date.now()
    return {
      id: createId(),
      title: title ?? DEFAULT_TITLE,
      messages: createInitialMessages(inputs),
      createdAt: now,
      updatedAt: now,
    }
  }

  function ensureCurrentSession(): ChatSession {
    const session = currentSession.value
    if (session) {
      return session
    }
    return createSession()
  }

  function restore(raw: string | null | undefined) {
    if (!raw) {
      return false
    }
    try {
      const data = JSON.parse(raw) as Partial<PersistedChat>
      if (!Array.isArray(data.sessions)) {
        return false
      }
      const list = data.sessions
        .map(normalizeSession)
        .filter((session): session is ChatSession => !!session)
      if (!list.length) {
        return false
      }
      sessions.value = list
      for (const session of list) {
        ensureRuntime(session.id)
      }
      currentSessionId.value = list.some(session => session.id === data.currentSessionId)
        ? data.currentSessionId!
        : list[0]!.id
      return true
    }
    catch {
      return false
    }
  }

  function snapshot() {
    return JSON.stringify({
      version: 1,
      currentSessionId: currentSessionId.value,
      sessions: sessions.value,
    } satisfies PersistedChat)
  }

  function write() {
    if (!storage || !hydrated) {
      return
    }
    try {
      const result = storage.setItem(config.storageKey, snapshot())
      if (isPromise(result)) {
        result.catch(() => {})
      }
    }
    catch {}
  }

  function persist() {
    if (!storage || !hydrated) {
      return
    }
    if (saveTimer) {
      clearTimeout(saveTimer)
    }
    saveTimer = setTimeout(() => {
      saveTimer = null
      write()
    }, 300)
  }

  function hydrate() {
    if (!storage) {
      hydrated = true
      return
    }
    try {
      const raw = storage.getItem(config.storageKey)
      if (isPromise<string | null>(raw)) {
        raw
          .then((value) => {
            restore(value)
            hydrated = true
          })
          .catch(() => {
            hydrated = true
          })
        return
      }
      restore(raw)
      hydrated = true
    }
    catch {
      hydrated = true
    }
  }

  const initialSession = buildSession(undefined, options?.messages ?? [])
  sessions.value = [initialSession]
  currentSessionId.value = initialSession.id
  ensureRuntime(initialSession.id)
  hydrate()

  watch([sessions, currentSessionId], persist, { deep: true })

  function abortSession(id: string) {
    const runtime = runtimes[id]
    if (!runtime) {
      return
    }
    runtime.controller?.abort()
    runtime.controller = null
  }

  async function request(session: ChatSession, overrides?: Partial<LLMRequestOptions>) {
    const runtime = ensureRuntime(session.id)
    if (runtime.loading) {
      abortSession(session.id)
    }
    const requestId = ++runtime.requestId
    if (overrides) {
      runtime.lastOverrides = overrides
    }
    const current = overrides ?? runtime.lastOverrides ?? {}

    const assistant: ChatMessage = {
      id: createId(),
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      status: 'streaming',
    }
    session.messages.push(assistant)
    const payloadMessages = session.messages
      .slice(0, -1)
      .filter(message => message.content.trim())
      .map(message => ({ role: message.role, content: message.content }))
    const emit = (delta: string) => {
      if (requestId !== runtime.requestId) {
        return
      }
      assistant.content += delta
      session.updatedAt = Date.now()
      onChunkEvent.trigger(delta, assistant.content, session)
    }

    const controller = new AbortController()
    runtime.loading = true
    runtime.completed = false
    runtime.error = null
    runtime.controller = controller

    try {
      await streamLLM({
        baseURL: current.baseURL ?? config.baseURL,
        endpoint: current.endpoint ?? config.endpoint,
        apiKey: current.apiKey ?? config.apiKey,
        model: current.model ?? config.model,
        headers: { ...config.headers, ...current.headers },
        body: { ...config.body, ...current.body },
        messages: payloadMessages,
        fetch: config.fetch,
        parseChunk: config.parseChunk,
        signal: controller.signal,
        emit,
      })
      if (requestId === runtime.requestId) {
        runtime.completed = true
        assistant.status = 'done'
        session.updatedAt = Date.now()
        onDoneEvent.trigger(assistant, session)
      }
    }
    catch (err) {
      if (requestId === runtime.requestId) {
        if (controller.signal.aborted) {
          assistant.status = assistant.content ? 'done' : 'error'
        }
        else {
          const reason = err instanceof Error ? err : new Error(String(err))
          runtime.error = reason
          assistant.status = 'error'
          onErrorEvent.trigger(reason, session)
        }
      }
    }
    finally {
      if (assistant.status === 'streaming') {
        assistant.status = assistant.content ? 'done' : 'error'
      }
      if (!assistant.content) {
        const index = session.messages.indexOf(assistant)
        if (index !== -1) {
          session.messages.splice(index, 1)
        }
      }
      if (requestId === runtime.requestId) {
        runtime.loading = false
        runtime.controller = null
        session.updatedAt = Date.now()
      }
    }
  }

  /**
   * 发送消息
   * 将输入追加到当前会话后发起流式请求，增量内容会实时写入助手消息
   *
   * @param input 用户输入的文本、单条输入消息或多条输入消息
   * @param overrides 本次请求的配置覆盖项
   * @returns 请求完成的 Promise
   *
   * @example
   * ```ts
   * const { send } = useChat({ apiKey: 'sk-xxx' })
   *
   * await send('你好')
   * await send({ role: 'user', content: '继续' })
   * await send([{ role: 'user', content: '换个话题' }], { model: 'gpt-4o' })
   * ```
   */
  async function send(input: ChatInput, overrides?: Partial<LLMRequestOptions>) {
    const session = ensureCurrentSession()
    const runtime = ensureRuntime(session.id)
    if (runtime.loading) {
      abortSession(session.id)
    }
    const list = typeof input === 'string'
      ? [{ content: input }]
      : Array.isArray(input) ? input : [input]
    const now = Date.now()
    const hasUser = session.messages.some(message => message.role === 'user')
    const inputs = list.map(item => ({
      id: createId(),
      role: item.role ?? ('user' as ChatRole),
      content: item.content,
      createdAt: now,
      status: 'done' as ChatMessageStatus,
    }))
    session.messages.push(...inputs)
    const firstUser = inputs.find(message => message.role === 'user')
    if (!hasUser && firstUser && session.title === DEFAULT_TITLE) {
      const title = firstUser.content.replace(/\s+/g, ' ').trim().slice(0, config.titleLength)
      session.title = title || DEFAULT_TITLE
    }
    session.updatedAt = Date.now()
    await request(session, overrides)
  }

  /**
   * 中断当前会话的请求
   * 已输出的内容会保留，未输出内容的助手消息会被移除
   *
   * @example
   * ```ts
   * const { send, abort } = useChat({ apiKey: 'sk-xxx' })
   *
   * send('写一段很长的文本')
   * abort()
   * ```
   */
  function abort() {
    abortSession(currentSessionId.value)
  }

  /**
   * 重置当前会话
   * 中断当前请求并清空消息，仅保留系统提示词
   *
   * @example
   * ```ts
   * const { send, reset } = useChat({ systemPrompt: '你是助手' })
   *
   * await send('你好')
   * reset()
   * ```
   */
  function reset() {
    const session = ensureCurrentSession()
    abortSession(session.id)
    session.messages = createInitialMessages()
    session.updatedAt = Date.now()
    const runtime = ensureRuntime(session.id)
    runtime.loading = false
    runtime.completed = false
    runtime.error = null
  }

  /**
   * 重新生成最后一条回答
   * 移除末尾的助手消息后，基于当前历史重新发起请求
   *
   * @returns 请求完成的 Promise
   *
   * @example
   * ```ts
   * const { send, regenerate } = useChat({ apiKey: 'sk-xxx' })
   *
   * await send('给出三个书名')
   * await regenerate()
   * ```
   */
  async function regenerate() {
    const session = ensureCurrentSession()
    abortSession(session.id)
    if (session.messages.at(-1)?.role === 'assistant') {
      session.messages.pop()
    }
    if (!session.messages.some(message => message.role === 'user')) {
      return
    }
    session.updatedAt = Date.now()
    await request(session)
  }

  /**
   * 重试上一次失败的请求
   * 移除末尾状态异常的助手消息后，使用上一次的请求配置重新发起
   *
   * @returns 请求完成的 Promise
   *
   * @example
   * ```ts
   * const { send, retry, onError } = useChat({ apiKey: 'sk-xxx' })
   *
   * onError(() => retry())
   * await send('介绍一下组合式函数')
   * ```
   */
  async function retry() {
    const session = ensureCurrentSession()
    const runtime = ensureRuntime(session.id)
    if (!runtime.error) {
      return
    }
    abortSession(session.id)
    if (session.messages.at(-1)?.role === 'assistant') {
      session.messages.pop()
    }
    if (!session.messages.some(message => message.role === 'user')) {
      return
    }
    session.updatedAt = Date.now()
    await request(session)
  }

  /**
   * 删除单条消息
   * 从当前会话中移除指定标识的消息
   *
   * @param id 消息唯一标识
   *
   * @example
   * ```ts
   * const { messages, removeMessage } = useChat()
   *
   * removeMessage(messages.value[0]!.id)
   * ```
   */
  function removeMessage(id: string) {
    const session = ensureCurrentSession()
    const index = session.messages.findIndex(message => message.id === id)
    if (index === -1) {
      return
    }
    session.messages.splice(index, 1)
    session.updatedAt = Date.now()
  }

  /**
   * 清空当前会话消息
   * 中断当前请求并移除全部消息，包括系统提示词
   *
   * @example
   * ```ts
   * const { clearMessages } = useChat()
   *
   * clearMessages()
   * ```
   */
  function clearMessages() {
    const session = ensureCurrentSession()
    abortSession(session.id)
    session.messages = []
    session.updatedAt = Date.now()
    const runtime = ensureRuntime(session.id)
    runtime.loading = false
    runtime.completed = false
    runtime.error = null
  }

  /**
   * 更新单条消息
   * 修改指定消息的内容，可选择截断后续消息并重新发起请求
   *
   * @param id 消息唯一标识
   * @param content 新的消息内容
   * @param resend 是否在更新后重新发起请求，默认为 false
   * @returns 重新请求时的 Promise
   *
   * @example
   * ```ts
   * const { messages, updateMessage } = useChat({ apiKey: 'sk-xxx' })
   *
   * const first = messages.value[0]!
   * await updateMessage(first.id, '换一个问题', true)
   * ```
   */
  async function updateMessage(id: string, content: string, resend = false) {
    const session = ensureCurrentSession()
    const index = session.messages.findIndex(message => message.id === id)
    if (index === -1) {
      return
    }
    const message = session.messages[index]!
    message.content = content
    message.status = 'done'
    session.updatedAt = Date.now()
    if (!resend || message.role !== 'user') {
      return
    }
    abortSession(session.id)
    session.messages.splice(index + 1)
    await request(session)
  }

  function trimSessions() {
    if (sessions.value.length <= config.maxSessions) {
      return
    }
    const keep = new Set<string>([currentSessionId.value])
    const sorted = [...sessions.value].sort((a, b) => b.updatedAt - a.updatedAt)
    for (const session of sorted) {
      if (keep.size >= config.maxSessions) {
        break
      }
      keep.add(session.id)
    }
    sessions.value = sessions.value.filter(session => keep.has(session.id))
    for (const id of Object.keys(runtimes)) {
      if (!keep.has(id)) {
        abortSession(id)
        delete runtimes[id]
      }
    }
  }

  /**
   * 新建会话
   * 创建一个独立会话并立即切换为当前会话，超出最大数量时会淘汰最久未更新的会话
   *
   * @param title 会话标题，默认为 '新对话'
   * @param messages 会话初始消息，默认为 []
   * @returns 新建的会话
   *
   * @example
   * ```ts
   * const { createSession, sessions } = useChat()
   *
   * const session = createSession('新话题', [{ role: 'user', content: '你好' }])
   * console.log(sessions.value.length)
   * ```
   */
  function createSession(title?: string, messages?: ChatInputMessage[]): ChatSession {
    const session = buildSession(title, messages ?? [])
    sessions.value.unshift(session)
    ensureRuntime(session.id)
    currentSessionId.value = session.id
    trimSessions()
    persist()
    return session
  }

  /**
   * 切换会话
   * 切换到指定标识的会话，进行中的其他会话请求不受影响
   *
   * @param id 会话唯一标识
   *
   * @example
   * ```ts
   * const { sessions, switchSession } = useChat()
   *
   * switchSession(sessions.value[0]!.id)
   * ```
   */
  function switchSession(id: string) {
    if (!sessions.value.some(session => session.id === id)) {
      return
    }
    currentSessionId.value = id
  }

  /**
   * 删除会话
   * 中断该会话的请求并移除，删除当前会话时会自动切换到其余会话
   *
   * @param id 会话唯一标识
   *
   * @example
   * ```ts
   * const { sessions, deleteSession } = useChat()
   *
   * deleteSession(sessions.value[0]!.id)
   * ```
   */
  function deleteSession(id: string) {
    const index = sessions.value.findIndex(session => session.id === id)
    if (index === -1) {
      return
    }
    abortSession(id)
    sessions.value.splice(index, 1)
    delete runtimes[id]
    if (currentSessionId.value === id) {
      const next = sessions.value[0]
      if (next) {
        currentSessionId.value = next.id
      }
      else {
        createSession()
      }
    }
    persist()
  }

  /**
   * 重命名会话
   * 修改会话标题，空标题会回退为 '新对话'
   *
   * @param id 会话唯一标识
   * @param title 新的会话标题
   *
   * @example
   * ```ts
   * const { sessions, renameSession } = useChat()
   *
   * renameSession(sessions.value[0]!.id, '需求讨论')
   * ```
   */
  function renameSession(id: string, title: string) {
    const session = sessions.value.find(item => item.id === id)
    if (!session) {
      return
    }
    session.title = title.trim() || DEFAULT_TITLE
    session.updatedAt = Date.now()
  }

  /**
   * 清空全部会话
   * 中断所有请求并移除全部会话，随后自动创建一个新的空会话
   *
   * @example
   * ```ts
   * const { clearSessions } = useChat()
   *
   * clearSessions()
   * ```
   */
  function clearSessions() {
    for (const session of sessions.value) {
      abortSession(session.id)
      delete runtimes[session.id]
    }
    sessions.value = []
    currentSessionId.value = ''
    createSession()
  }

  /**
   * 更新配置
   * 运行时修改请求配置、系统提示词或持久化键名，已存在的会话不受影响
   *
   * @param next 需要更新的配置项
   *
   * @example
   * ```ts
   * const { setOptions, send } = useChat({ apiKey: 'sk-xxx' })
   *
   * setOptions({ model: 'gpt-4o', apiKey: 'sk-new' })
   * await send('你好')
   * ```
   */
  function setOptions(next: Partial<Omit<UseChatOptions, 'messages' | 'storage'>>) {
    Object.assign(config, next)
    config.maxSessions = Math.max(1, config.maxSessions || 20)
    trimSessions()
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      for (const id of Object.keys(runtimes)) {
        abortSession(id)
      }
      if (saveTimer) {
        clearTimeout(saveTimer)
        saveTimer = null
        write()
      }
    })
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    messages,
    lastMessage,
    lastAssistantMessage,
    content,
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
    updateMessage,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    clearSessions,
    setOptions,
    onChunk: onChunkEvent.on,
    onDone: onDoneEvent.on,
    onError: onErrorEvent.on,
  }
}

/**
 * useChat 函数的返回类型
 * 包含会话列表、当前会话、消息状态、控制方法与事件钩子
 * @example
 * const chat: UseChatReturns = useChat({ apiKey: 'sk-xxx' })
 */
export type UseChatReturns = ReturnType<typeof useChat>
