import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { createEventHook, tryOnScopeDispose } from '@vueuse/core'
import { ref, shallowRef } from 'vue'
import { pushLimited, watchRefOrGetter } from './_utils'

/**
 * 消息处理器类型映射
 * 键为消息类型，值为该类型消息的负载结构
 */
export type HandlerType = Record<string, unknown>

/**
 * 原始消息类型
 * - string: 文本消息
 * - ArrayBuffer: 二进制消息
 * - Blob: 二进制大对象
 */
export type MessageRaw = string | ArrayBuffer | Blob

/**
 * 自动重试配置类型
 * - boolean: 是否启用自动重试
 * - object: 详细配置
 */
export type AutoRetry = boolean | {
  /** 最大重试次数，默认为 3 */
  retries?: number
  /** 重试延迟（毫秒），默认为 1000 */
  delay?: number
  /** 重试失败回调 */
  onFailed?: () => void
}

/**
 * 实时连接通用选项
 * @template T 处理器类型
 */
export type RealtimeOptions<T extends HandlerType = HandlerType> = {
  /** 是否手动连接，默认为 false（自动连接） */
  manual?: boolean
  /** 自动重试配置，默认为 undefined */
  autoRetry?: AutoRetry
  /**
   * 消息解析配置
   * - boolean: 是否解析为 JSON
   * - function: 自定义解析函数
   * 默认为 false
   */
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  /** 消息处理器键名，默认为 'type' */
  handlerKey?: string
  /** 最大记录大小，默认为 100 */
  maxRecordSize?: number
}

/** 底层连接最小能力契约（WebSocket / EventSource 均满足） */
type NativeConn = {
  readyState: number
  close: () => void
  addEventListener: (type: string, listener: (ev: any) => void, options?: { signal: AbortSignal }) => void
}

/**
 * 共享内核配置
 * @template T 处理器类型
 * @template Conn 底层连接类型
 * @template State 连接状态联合类型
 * @template WithClose 是否存在 close 事件（WebSocket 为 true，EventSource 为 false）
 * @template NativeOptions 透传给底层连接构造函数的选项类型
 */
type KernelConfig<
  T extends HandlerType,
  Conn extends NativeConn,
  State extends string,
  WithClose extends boolean,
  NativeOptions,
> = {
  /** 连接地址，支持响应式引用 */
  url?: MaybeRefOrGetter<string | URL>
  /** 配置选项（通用选项 + 底层原生选项） */
  options: RealtimeOptions<T> & NativeOptions
  /** readyState 数值到状态字符串的映射 */
  readyStateMap: Record<number, State>
  /** 初始状态 */
  initialStatus: State
  /** 外部传入的连接实例引用（由调用方命名为 socket / source） */
  connRef: ShallowRef<Conn | null>
  /** 创建底层连接的工厂函数 */
  create: (url: string | URL, options: NativeOptions) => Conn
  /** 重试触发时机：close（WebSocket）或 error（EventSource） */
  retryOn: 'error' | 'close'
  /** 是否存在 close 事件 */
  hasCloseEvent: WithClose
}

/**
 * 共享内核返回类型（公共子集）
 * @template T 处理器类型
 * @template D 消息数据类型
 * @template State 连接状态联合类型
 * @template WithClose 是否存在 close 事件
 * @template NativeOptions connect 透传的选项类型
 */
type KernelReturns<
  T extends HandlerType,
  D extends MessageRaw,
  State extends string,
  WithClose extends boolean,
  NativeOptions,
> = {
  /** 连接地址 */
  url: Ref<string | URL | undefined>
  /** 连接状态 */
  status: Ref<State>
  /** 最新消息数据 */
  data: Ref<D | null>
  /** 消息数据记录 */
  dataRecord: Ref<D[]>
  /** 最新消息事件 */
  messageEvent: Ref<MessageEvent<D> | null>
  /** 消息事件记录 */
  messageEventRecord: Ref<MessageEvent<D>[]>
  /** 错误事件 */
  error: Ref<Event | null>
  /** 中断控制器 */
  controller: ShallowRef<AbortController>
  /** 建立连接 */
  connect: (url?: string | URL, options?: NativeOptions) => void
  /** 关闭连接 */
  close: () => void
  /** 销毁连接并清理资源 */
  destroy: () => void
  /** 注册消息处理器 */
  registerHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => () => void
  /** 取消消息处理器注册 */
  cancelHandler: <K extends keyof T>(type: K, handler: (data: T[K]) => void) => void
  /** 注册自定义事件监听器 */
  registerEvent: (type: string, handler: (ev: Event) => void) => void
  /** 连接打开事件 */
  onOpen: (callback: (event: Event) => void) => void
  /** 消息接收事件 */
  onMessage: (callback: (event: MessageEvent<D>) => void) => void
  /** 错误事件 */
  onError: (callback: (event: Event) => void) => void
  /** 重试失败事件 */
  onFailed: (callback: (event: Event) => void) => void
} & (WithClose extends true ? {
  /** 连接关闭事件 */
  onClose: (callback: (event: CloseEvent) => void) => void
} : unknown)

/**
 * 创建实时连接共享内核
 * 封装 WebSocket / EventSource 通用的连接管理、消息收发、自动重试与资源清理逻辑
 *
 * @template T 处理器类型
 * @template D 消息数据类型
 * @template Conn 底层连接类型
 * @template State 连接状态联合类型
 * @template WithClose 是否存在 close 事件
 * @template NativeOptions 底层原生选项类型
 * @param config 内核配置
 * @returns 公共状态与方法
 */
export function createRealtimeConnection<
  T extends HandlerType,
  D extends MessageRaw,
  Conn extends NativeConn,
  State extends string,
  WithClose extends boolean,
  NativeOptions,
>(config: KernelConfig<T, Conn, State, WithClose, NativeOptions>): KernelReturns<T, D, State, WithClose, NativeOptions> {
  const {
    url,
    options,
    readyStateMap,
    initialStatus,
    connRef,
    create,
    retryOn,
    hasCloseEvent,
  } = config

  const {
    manual = false,
    autoRetry,
    parseMessage = false,
    handlerKey = 'type',
    maxRecordSize = 100,
    ...nativeOptions
  } = options

  const { retries = 3, delay = 1000, onFailed } = typeof autoRetry === 'boolean' ? {} : autoRetry ?? {}

  let retryCount = 0
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let manuallyClosed = false

  const urlRef = watchRefOrGetter<string | URL | undefined>(url, () => {
    if (!manual) {
      connect()
    }
  })

  const handlerMap = new Map<keyof T, ((data: T[keyof T]) => void)[]>()
  const eventRegistry = new Map<string, Set<(ev: Event) => void>>()

  const status = shallowRef<State>(initialStatus)
  const error: Ref<Event | null> = ref(null)
  const data: Ref<D | null> = ref(null)
  const dataRecord: Ref<D[]> = ref([])
  const messageEvent: Ref<MessageEvent<D> | null> = ref(null)
  const messageEventRecord: Ref<MessageEvent<D>[]> = ref([])
  const controller: ShallowRef<AbortController> = shallowRef(new AbortController())

  const onOpenEvent = createEventHook<[Event]>()
  const onMessageEvent = createEventHook<[MessageEvent<D>]>()
  const onCloseEvent = createEventHook<[CloseEvent]>()
  const onErrorEvent = createEventHook<[Event]>()
  const onFailedEvent = createEventHook<[Event]>()

  function clearRetryTimer() {
    if (retryTimer) {
      clearTimeout(retryTimer)
      retryTimer = null
    }
  }

  function setStatus() {
    if (connRef.value) {
      const state = readyStateMap[connRef.value.readyState]
      if (state) {
        status.value = state
      }
    }
  }

  function attemptRetry(ev: Event) {
    clearRetryTimer()
    if (retryCount < retries) {
      retryCount++
      retryTimer = setTimeout(() => {
        connect()
      }, delay)
    }
    else {
      onFailed?.()
      onFailedEvent.trigger(ev)
      retryCount = 0
    }
  }

  /**
   * 建立连接
   * 销毁旧连接后创建新的底层连接并绑定事件监听，自定义事件会在重连后自动重新绑定
   * @param newUrl 连接地址（可选），默认为当前 url
   * @param newOptions 底层连接选项（可选），会合并到初始选项
   * @example
   * connect()
   * @example
   * connect('wss://example.com/socket', { protocols: 'chat' })
   */
  function connect(newUrl?: string | URL, newOptions?: NativeOptions) {
    if (connRef.value) {
      destroy()
    }
    if (newUrl) {
      urlRef.value = newUrl
    }
    if (newOptions) {
      Object.assign(nativeOptions, newOptions)
    }
    if (!urlRef.value) {
      throw new Error('Connection url is not defined')
    }

    manuallyClosed = false
    clearRetryTimer()

    connRef.value = create(urlRef.value, nativeOptions as NativeOptions)
    controller.value = new AbortController()
    const signal = controller.value.signal
    const conn = connRef.value

    conn.addEventListener('open', onOpen, { signal })
    conn.addEventListener('message', onMessage, { signal })
    if (hasCloseEvent) {
      conn.addEventListener('close', onClose, { signal })
    }
    conn.addEventListener('error', onError, { signal })

    eventRegistry.forEach((handlers, type) => {
      handlers.forEach((handler) => {
        conn.addEventListener(type, handler, { signal })
      })
    })

    setStatus()
  }

  /**
   * 关闭连接
   * 可中断 CONNECTING 与 OPEN 状态的连接；主动关闭后不会触发自动重试
   * @example
   * close()
   */
  function close() {
    manuallyClosed = true
    const conn = connRef.value
    if (conn && (conn.readyState === 0 || conn.readyState === 1)) {
      conn.close()
    }
    setStatus()
  }

  /**
   * 销毁连接
   * 关闭连接、中止事件监听并清除挂起的重试定时器
   * @example
   * destroy()
   */
  function destroy() {
    manuallyClosed = true
    clearRetryTimer()
    close()
    controller.value.abort()
    connRef.value = null
  }

  function onOpen(ev: Event) {
    setStatus()
    error.value = null
    data.value = null
    messageEvent.value = null
    retryCount = 0
    onOpenEvent.trigger(ev)
  }

  async function onMessage(ev: MessageEvent<D>) {
    setStatus()
    data.value = ev.data
    pushLimited(dataRecord.value, ev.data, maxRecordSize)
    messageEvent.value = ev
    pushLimited(messageEventRecord.value, ev, maxRecordSize)
    onMessageEvent.trigger(ev)

    if (parseMessage && typeof ev.data === 'string') {
      try {
        const dataJson = typeof parseMessage === 'function'
          ? await Promise.resolve(parseMessage(ev.data))
          : JSON.parse(ev.data) as Record<keyof T, unknown> | null
        const type = dataJson?.[handlerKey as keyof T]
        if (type != null) {
          handlerMap.get(type as keyof T)?.forEach((handler) => {
            handler(dataJson as T[keyof T])
          })
        }
      }
      catch (err) {
        console.warn('Failed to parse message:', err)
      }
    }
  }

  function onClose(ev: CloseEvent) {
    setStatus()
    error.value = null
    data.value = null
    messageEvent.value = null
    onCloseEvent.trigger(ev)
    if (!manuallyClosed && retryOn === 'close' && autoRetry && ev.code !== 1000) {
      attemptRetry(ev)
    }
  }

  function onError(ev: Event) {
    setStatus()
    error.value = ev
    onErrorEvent.trigger(ev)
    if (!manuallyClosed && retryOn === 'error' && autoRetry) {
      attemptRetry(ev)
    }
  }

  /**
   * 注册消息处理器
   * 为特定消息类型注册处理函数，收到匹配消息时调用
   * @param type 消息类型
   * @param handler 消息处理器函数，接收整条解析后的消息
   * @returns 取消注册函数，调用后可移除该处理器
   * @example
   * const unregister = registerHandler('pong', (data) => {
   *   console.log('收到 pong:', data.timestamp)
   * })
   * unregister()
   */
  function registerHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    const list = handlerMap.get(type) ?? []
    list.push(handler as (data: T[keyof T]) => void)
    handlerMap.set(type, list)
    return () => cancelHandler(type, handler)
  }

  /**
   * 取消消息处理器注册
   * 移除指定消息类型的特定处理器
   * @param type 消息类型
   * @param handler 要移除的消息处理器函数
   * @example
   * cancelHandler('pong', myHandler)
   */
  function cancelHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    const list = handlerMap.get(type)
    if (list) {
      handlerMap.set(type, list.filter(f => f !== handler))
    }
  }

  /**
   * 注册自定义事件监听器
   * 为底层连接添加自定义事件监听，重连后会自动重新绑定到新连接
   * @param type 事件类型
   * @param handler 事件处理器
   * @example
   * registerEvent('ping', (ev) => {
   *   console.log('收到 ping 事件')
   * })
   */
  function registerEvent(type: string, handler: (ev: Event) => void) {
    let handlers = eventRegistry.get(type)
    if (!handlers) {
      handlers = new Set()
      eventRegistry.set(type, handlers)
    }
    handlers.add(handler)
    const conn = connRef.value
    if (conn) {
      conn.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  if (!manual) {
    connect()
  }

  tryOnScopeDispose(() => {
    destroy()
  })

  const common = {
    url: urlRef,
    status,
    data,
    dataRecord,
    messageEvent,
    messageEventRecord,
    error,
    controller,
    connect,
    close,
    destroy,
    registerHandler,
    cancelHandler,
    registerEvent,
    onOpen: onOpenEvent.on,
    onMessage: onMessageEvent.on,
    onError: onErrorEvent.on,
    onFailed: onFailedEvent.on,
  }

  const result = hasCloseEvent
    ? { ...common, onClose: onCloseEvent.on }
    : common

  return result as KernelReturns<T, D, State, WithClose, NativeOptions>
}
