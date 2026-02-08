import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

/**
 * WebSocket 连接状态类型
 * - CONNECTING: 连接中
 * - OPEN: 连接已打开
 * - CLOSING: 连接正在关闭
 * - CLOSED: 连接已关闭
 * - PENDING: 初始状态
 */
type State = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'

/**
 * 自动重试配置类型
 * - boolean: 是否启用自动重试
 * - object: 详细配置
 *   - retries: 最大重试次数
 *   - delay: 重试间隔（毫秒）
 *   - onFailed: 重试失败回调
 */
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}

/**
 * WebSocket 连接状态映射对象
 * 将数字状态码映射为可读的状态字符串
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
 * WebSocket 消息原始类型
 * - string: 字符串消息
 * - ArrayBuffer: 二进制消息
 * - Blob: 二进制大对象
 */
type MessageRaw = string | ArrayBuffer | Blob

/**
 * WebSocket 选项类型
 * @template T 处理器类型
 */
export type UseWebsocketOptions<T extends HandlerType = HandlerType> = {
  /** WebSocket 协议 */
  protocols?: string | string[]
  /** 是否手动连接，默认为 false（自动连接） */
  manual?: boolean
  /** 自动重试配置 */
  autoRetry?: AutoRetry
  /**
   * 消息解析配置
   * - boolean: 是否解析为 JSON
   * - function: 自定义解析函数
   */
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  /** 消息处理器键名，默认为 'type' */
  handlerKey?: string
  /** 最大记录大小，默认为 100 */
  maxRecordSize?: number
}

/**
 * 消息处理器类型
 * 键为消息类型，值为消息数据类型
 */
type HandlerType = {
  [key: string]: unknown
}

/**
 * 返回处理器类型
 * @template U 处理器类型
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
 * @example
 * // 基本用法
 * const { status, data, send, onMessage } = useWebSocket('wss://echo.websocket.org')
 *
 * // 监听消息
 * onMessage((event) => {
 *   console.log('收到消息:', event.data)
 * })
 *
 * // 发送消息
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
 * // 注册消息处理器
 * registerHandler('pong', (data) => {
 *   console.log('收到 pong 消息:', data.timestamp)
 * })
 *
 * @template T 处理器类型
 * @template D 消息数据类型
 * @param url WebSocket 连接地址
 * @param options WebSocket 配置选项
 * @returns WebSocket 实例及相关方法
 */
export function useWebSocket<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: MaybeRefOrGetter<string | URL>, options?: UseWebsocketOptions<T>) {
  // 解析配置选项
  const { manual = false, autoRetry, parseMessage = false, handlerKey = 'type', maxRecordSize = 100, ..._options } = options ?? {}
  // 解析自动重试配置
  const { retries = 3, delay = 1000, onFailed } = typeof autoRetry === 'boolean' ? {} : autoRetry ?? {}
  // 重试计数
  let retryCount = 0

  // URL 响应式引用
  const urlRef: Ref<string | URL | undefined> = ref(toValue(url))
  // 监听 URL 变化
  watchEffect(() => urlRef.value = toValue(url))
  // URL 变化时自动重连
  watch(urlRef, () => {
    if (!manual) {
      connect()
    }
  })
  // 消息处理器映射
  const handlerMap = new Map<keyof T, ((data: any) => void)[]>()
  // WebSocket 实例引用
  const socket: ShallowRef<WebSocket | null> = shallowRef(null)

  // 状态管理
  const status: Ref<State> = ref('PENDING') // 连接状态
  const error: Ref<Event | null> = ref(null) // 错误信息
  const data: Ref<D | null> = ref(null) // 最新消息数据
  const dataRecord: Ref<D[]> = ref([]) // 消息数据记录
  const messageEvent: Ref<MessageEvent<D> | null> = ref(null) // 最新消息事件
  const messageEventRecord: Ref<MessageEvent<D>[]> = ref([]) // 消息事件记录

  // 控制器，用于取消事件监听
  const controller: ShallowRef<AbortController> = shallowRef(new AbortController())

  // 事件钩子
  const onOpenEvent = createEventHook<[WebSocketEventMap['open']]>() // 连接打开事件
  const onMessageEvent = createEventHook<[WebSocketEventMap['message']]>() // 消息接收事件
  const onCloseEvent = createEventHook<[WebSocketEventMap['close']]>() // 连接关闭事件
  const onErrorEvent = createEventHook<[WebSocketEventMap['error']]>() // 错误事件
  const onFailedEvent = createEventHook<[WebSocketEventMap['error']]>() // 重试失败事件

  /**
   * 更新连接状态
   */
  function setStatus() {
    if (socket.value) {
      status.value = ReadyState[socket.value.readyState]
    }
  }

  /**
   * 连接 WebSocket
   * @param url 连接地址（可选）
   * @param protocols 协议（可选）
   */
  function connect(url?: string | URL, protocols?: string | string[]) {
    // 如果已有连接，先销毁
    if (socket.value) {
      destroy()
    }
    // 更新 URL
    if (url) {
      urlRef.value = url
    }
    // 更新协议
    if (protocols) {
      _options.protocols = protocols
    }

    // 检查 URL 是否存在
    if (!urlRef.value) {
      throw new Error('WebSocket url is not defined')
    }
    // 创建新的 WebSocket 连接
    socket.value = new WebSocket(urlRef.value, _options.protocols)
    // 创建新的控制器
    controller.value = new AbortController()
    // 添加事件监听
    socket.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    socket.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    socket.value.addEventListener('close', onClose, { signal: controller.value.signal })
    socket.value.addEventListener('error', onError, { signal: controller.value.signal })
  }

  /**
   * 关闭 WebSocket 连接
   */
  function close() {
    if (socket.value?.readyState === 1) {
      socket.value?.close()
    }
  }

  // 自动连接
  if (!manual) {
    connect()
  }

  /**
   * 发送原始数据
   * @param data 原始数据
   */
  function sendRaw<D extends string>(data: D) {
    socket.value?.send(data)
  }

  /**
   * 发送对象数据（自动转换为 JSON）
   * @param data 对象数据
   */
  function send<D extends object>(data: D) {
    sendRaw(JSON.stringify(data))
  }

  /**
   * 连接打开回调
   * @param ev 事件对象
   */
  function onOpen(ev: Event) {
    setStatus()
    error.value = null
    data.value = null
    messageEvent.value = null
    retryCount = 0
    onOpenEvent.trigger(ev)
  }

  /**
   * 消息接收回调
   * @param ev 消息事件对象
   */
  async function onMessage(ev: MessageEvent<D>) {
    setStatus()
    // 更新最新数据
    data.value = ev.data
    // 添加到数据记录
    dataRecord.value.push(ev.data)
    // 限制记录大小
    if (dataRecord.value.length > maxRecordSize) {
      dataRecord.value.shift()
    }
    // 更新最新消息事件
    messageEvent.value = ev
    // 添加到消息事件记录
    messageEventRecord.value.push(ev)
    // 限制记录大小
    if (messageEventRecord.value.length > maxRecordSize) {
      messageEventRecord.value.shift()
    }
    // 触发消息事件钩子
    onMessageEvent.trigger(ev)
    // 解析消息
    if (parseMessage && typeof ev.data === 'string') {
      try {
        // 解析消息数据
        const dataJson = typeof parseMessage === 'function' ? await parseMessage(ev.data) : JSON.parse(ev.data) as Record<keyof T, any> | null
        // 查找对应的处理器并执行
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

  /**
   * 连接关闭回调
   * @param ev 关闭事件对象
   */
  function onClose(ev: CloseEvent) {
    setStatus()
    error.value = null
    data.value = null
    messageEvent.value = null
    onCloseEvent.trigger(ev)
  }

  /**
   * 错误回调
   * @param ev 错误事件对象
   */
  function onError(ev: Event) {
    setStatus()
    error.value = ev
    onErrorEvent.trigger(ev)
    // 自动重试逻辑
    if (autoRetry) {
      if (retryCount < retries) {
        retryCount++
        setTimeout(() => {
          connect()
        }, delay)
      }
      else {
        // 重试失败
        onFailed?.()
        onFailedEvent.trigger(ev)
        retryCount = 0
      }
    }
  }

  /**
   * 注册消息处理器
   * @param type 消息类型
   * @param handler 消息处理器
   * @returns 取消注册函数
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
   * @param type 消息类型
   * @param handler 消息处理器
   */
  function cancelHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    if (handlerMap.has(type)) {
      handlerMap.set(type, handlerMap.get(type)?.filter(f => f !== handler) || [])
    }
  }

  /**
   * 注册自定义事件监听器
   * @param type 事件类型
   * @param handler 事件处理器
   */
  function registerEvent(type: string, handler: (ev: Event) => void) {
    if (socket.value) {
      socket.value.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  /**
   * 销毁 WebSocket 连接
   */
  function destroy() {
    close()
    controller.value.abort()
    socket.value = null
  }

  // 组件卸载时销毁连接
  onUnmounted(() => {
    destroy()
  })

  return {
    socket, // WebSocket 实例
    url: urlRef, // 连接地址
    status, // 连接状态
    data, // 最新消息数据
    dataRecord, // 消息数据记录
    messageEvent, // 最新消息事件
    messageEventRecord, // 消息事件记录
    error, // 错误信息
    controller, // 控制器
    connect, // 连接方法
    close, // 关闭方法
    sendRaw, // 发送原始数据方法
    send, // 发送对象数据方法
    destroy, // 销毁方法
    registerHandler, // 注册消息处理器方法
    cancelHandler, // 取消消息处理器注册方法
    registerEvent, // 注册自定义事件监听器方法
    onOpen: onOpenEvent.on, // 连接打开事件
    onMessage: onMessageEvent.on, // 消息接收事件
    onClose: onCloseEvent.on, // 连接关闭事件
    onError: onErrorEvent.on, // 错误事件
    onFailed: onFailedEvent.on, // 重试失败事件
  }
}

export type UseWebSocketReturns = ReturnType<typeof useWebSocket>
