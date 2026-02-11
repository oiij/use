import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

/**
 * WebSocket 连接状态类型
 * - CONNECTING: 连接中
 * - OPEN: 已连接
 * - CLOSING: 关闭中
 * - CLOSED: 已关闭
 * - PENDING: 待连接
 */
type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'

/**
 * 自动重试配置类型
 * - boolean: 是否启用自动重试
 * - object: 详细配置
 *   - retries?: 最大重试次数，默认为 3
 *   - delay?: 重试延迟（毫秒），默认为 1000
 *   - onFailed?: 重试失败回调
 */
type AutoRetry = boolean | {
  /** 最大重试次数，默认为 3 */
  retries?: number
  /** 重试延迟（毫秒），默认为 1000 */
  delay?: number
  /** 重试失败回调 */
  onFailed?: () => void
}

/**
 * WebSocket 就绪状态映射
 * 将 WebSocket readyState 数值映射为可读的状态字符串
 */
const ReadyState: {
  [key: number]: State
} = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
}

/**
 * 原始消息类型
 * - string: 文本消息
 * - ArrayBuffer: 二进制消息
 * - Blob: 二进制大对象
 */
type MessageRaw = string | ArrayBuffer | Blob

/**
 * WebSocket 选项类型
 * @template T 处理器类型
 * @example
 * const options: UseWebsocketOptions = {
 *   protocols: 'chat',
 *   manual: false,
 *   autoRetry: true,
 *   parseMessage: true,
 *   handlerKey: 'type',
 *   maxRecordSize: 100
 * }
 */
export type UseWebsocketOptions<T extends HandlerType = HandlerType> = {
  /** WebSocket 协议，默认为 undefined */
  protocols?: string | string[]
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

/**
 * 消息处理器类型
 * 定义消息类型的键值对结构
 */
type HandlerType = {
  [key: string]: unknown
}

/**
 * 返回处理器类型
 * @template U 处理器类型
 * @example
 * type MyHandler = ReturnHandlerType<{
 *   ping: { timestamp: number }
 *   pong: { timestamp: number }
 * }>
 */
export type ReturnHandlerType<U> = {
  [K in keyof U]: {
    [key: string]: unknown
    /** 消息类型 */
    type: K
    /** 消息负载 */
    payload: U[K]
  }
}[keyof U]

/**
 * WebSocket 工具函数
 * 提供 WebSocket 连接管理、消息发送与接收、自动重试等功能
 *
 * @template T 处理器类型
 * @template D 消息数据类型
 * @param url WebSocket 连接地址，支持响应式引用
 * @param options WebSocket 配置选项
 * @returns WebSocket 实例及相关方法
 *
 * @example
 * // 基本用法
 * const { status, data, send, onMessage } = useWebSocket('wss://echo.websocket.org')
 *
 * onMessage((event) => {
 *   console.log('收到消息:', event.data)
 * })
 *
 * send({ type: 'ping', timestamp: Date.now() })
 *
 * @example
 * // 带类型定义的用法
 * interface MessageTypes {
 *   ping: { timestamp: number }
 *   pong: { timestamp: number }
 * }
 *
 * const { registerHandler } = useWebSocket<MessageTypes>('wss://echo.websocket.org', {
 *   parseMessage: true
 * })
 *
 * registerHandler('pong', (data) => {
 *   console.log('收到 pong 消息:', data.timestamp)
 * })
 */
export function useWebSocket<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: MaybeRefOrGetter<string | URL>, options?: UseWebsocketOptions<T>) {
  const { manual = false, autoRetry, parseMessage = false, handlerKey = 'type', maxRecordSize = 100, ..._options } = options ?? {}
  const { retries = 3, delay = 1000, onFailed } = typeof autoRetry === 'boolean' ? {} : autoRetry ?? {}
  let retryCount = 0

  const urlRef: Ref<string | URL | undefined> = ref(toValue(url))
  watchEffect(() => urlRef.value = toValue(url))
  watch(urlRef, () => {
    if (!manual) {
      connect()
    }
  })
  const handlerMap = new Map<keyof T, ((data: any) => void)[]>()
  const socket: ShallowRef<WebSocket | null> = shallowRef(null)

  const status: Ref<State> = ref('PENDING')
  const error: Ref<Event | null> = ref(null)
  const data: Ref<D | null> = ref(null)
  const dataRecord: Ref<D[]> = ref([])
  const messageEvent: Ref<MessageEvent<D> | null> = ref(null)
  const messageEventRecord: Ref<MessageEvent<D>[]> = ref([])

  const controller: ShallowRef<AbortController> = shallowRef(new AbortController())

  const onOpenEvent = createEventHook<[WebSocketEventMap['open']]>()
  const onMessageEvent = createEventHook<[WebSocketEventMap['message']]>()
  const onCloseEvent = createEventHook<[WebSocketEventMap['close']]>()
  const onErrorEvent = createEventHook<[WebSocketEventMap['error']]>()
  const onFailedEvent = createEventHook<[WebSocketEventMap['error']]>()

  function setStatus() {
    if (socket.value) {
      status.value = ReadyState[socket.value.readyState]
    }
  }

  /**
   * 连接 WebSocket
   * 创建新的 WebSocket 连接并添加事件监听
   * @param url 连接地址（可选），默认为 urlRef 的值
   * @param protocols 协议（可选）
   * @example
   * // 使用默认 URL 连接
   * connect()
   *
   * @example
   * // 指定 URL 和协议连接
   * connect('wss://example.com/socket', 'chat')
   */
  function connect(url?: string | URL, protocols?: string | string[]) {
    if (socket.value) {
      destroy()
    }
    if (url) {
      urlRef.value = url
    }
    if (protocols) {
      _options.protocols = protocols
    }

    if (!urlRef.value) {
      throw new Error('WebSocket url is not defined')
    }
    socket.value = new WebSocket(urlRef.value, _options.protocols)
    controller.value = new AbortController()
    socket.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    socket.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    socket.value.addEventListener('close', onClose, { signal: controller.value.signal })
    socket.value.addEventListener('error', onError, { signal: controller.value.signal })
  }

  /**
   * 关闭 WebSocket 连接
   * 仅当连接处于 OPEN 状态时才执行关闭操作
   * @example
   * close() // 关闭当前 WebSocket 连接
   */
  function close() {
    if (socket.value?.readyState === 1) {
      socket.value?.close()
    }
  }

  if (!manual) {
    connect()
  }

  /**
   * 发送原始数据
   * 直接发送字符串数据到 WebSocket 服务器
   * @param data 原始字符串数据
   * @example
   * sendRaw('Hello Server')
   */
  function sendRaw<D extends string>(data: D) {
    socket.value?.send(data)
  }

  /**
   * 发送对象数据（自动转换为 JSON）
   * 将对象序列化为 JSON 字符串后发送
   * @param data 对象数据
   * @example
   * send({ type: 'ping', timestamp: Date.now() })
   */
  function send<D extends object>(data: D) {
    sendRaw(JSON.stringify(data))
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
    dataRecord.value.push(ev.data)
    if (dataRecord.value.length > maxRecordSize) {
      dataRecord.value.shift()
    }
    messageEvent.value = ev
    messageEventRecord.value.push(ev)
    if (messageEventRecord.value.length > maxRecordSize) {
      messageEventRecord.value.shift()
    }
    onMessageEvent.trigger(ev)
    if (parseMessage && typeof ev.data === 'string') {
      try {
        const dataJson = typeof parseMessage === 'function' ? await parseMessage(ev.data) : JSON.parse(ev.data) as Record<keyof T, any> | null
        if (dataJson?.[handlerKey]) {
          handlerMap.get(dataJson[handlerKey])?.forEach((f) => {
            f(dataJson)
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
  }

  function onError(ev: Event) {
    setStatus()
    error.value = ev
    onErrorEvent.trigger(ev)
    if (autoRetry) {
      if (retryCount < retries) {
        retryCount++
        setTimeout(() => {
          connect()
        }, delay)
      }
      else {
        onFailed?.()
        onFailedEvent.trigger(ev)
        retryCount = 0
      }
    }
  }

  /**
   * 注册消息处理器
   * 为特定消息类型注册处理函数
   * @param type 消息类型
   * @param handler 消息处理器函数
   * @returns 取消注册函数，调用后可移除该处理器
   * @example
   * const unregister = registerHandler('pong', (data) => {
   *   console.log('收到 pong:', data)
   * })
   * // 取消注册
   * unregister()
   */
  function registerHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    if (!handlerMap.has(type)) {
      handlerMap.set(type, [])
    }
    handlerMap.get(type)?.push(handler)
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
    if (handlerMap.has(type)) {
      handlerMap.set(type, handlerMap.get(type)?.filter(f => f !== handler) || [])
    }
  }

  /**
   * 注册自定义事件监听器
   * 为 WebSocket 实例添加自定义事件监听
   * @param type 事件类型
   * @param handler 事件处理器
   * @example
   * registerEvent('ping', (ev) => {
   *   console.log('收到 ping 事件')
   * })
   */
  function registerEvent(type: string, handler: (ev: Event) => void) {
    if (socket.value) {
      socket.value.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  /**
   * 销毁 WebSocket 连接
   * 关闭连接并清理所有资源
   * @example
   * destroy() // 销毁当前 WebSocket 连接
   */
  function destroy() {
    close()
    controller.value.abort()
    socket.value = null
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    socket,
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
    sendRaw,
    send,
    destroy,
    registerHandler,
    cancelHandler,
    registerEvent,
    onOpen: onOpenEvent.on,
    onMessage: onMessageEvent.on,
    onClose: onCloseEvent.on,
    onError: onErrorEvent.on,
    onFailed: onFailedEvent.on,
  }
}

/**
 * useWebSocket 函数返回类型
 * 包含 WebSocket 实例、状态、方法和事件钩子
 * @example
 * const ws: UseWebSocketReturns = useWebSocket('wss://example.com')
 */
export type UseWebSocketReturns = ReturnType<typeof useWebSocket>
