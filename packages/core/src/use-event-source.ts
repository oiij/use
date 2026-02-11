import type { Ref, ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

/**
 * EventSource 连接状态
 * - CONNECTING: 连接中
 * - OPEN: 已连接
 * - CLOSED: 已关闭
 */
type State = 'CONNECTING' | 'OPEN' | 'CLOSED'

/**
 * 自动重连配置
 * @property retries - 重试次数，默认为 3
 * @property delay - 重试延迟（毫秒），默认为 1000
 * @property onFailed - 重试失败回调
 */
type AutoRetry = boolean | {
  retries?: number
  delay?: number
  onFailed?: () => void
}

/**
 * EventSource 就绪状态映射
 * @property 0 - CONNECTING
 * @property 1 - OPEN
 * @property 2 - CLOSED
 */
const ReadyState: {
  [key: number]: State
} = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSED',
}

/**
 * 原始消息类型
 */
type MessageRaw = string | ArrayBuffer | Blob

/**
 * 处理器类型映射
 */
type HandlerType = {
  [key: string]: unknown
}

/**
 * useEventSource 选项配置
 * @template T 处理器类型
 * @example
 * const options: UseEventSourceOptions = {
 *   manual: false,
 *   autoRetry: true,
 *   parseMessage: true,
 *   handlerKey: 'type',
 *   maxRecordSize: 100
 * }
 */
export type UseEventSourceOptions<T extends HandlerType = HandlerType> = EventSourceInit & {
  /** 是否手动连接，默认为 false */
  manual?: boolean
  /** 自动重连配置，默认为 false */
  autoRetry?: AutoRetry
  /**
   * 消息解析配置
   * - boolean: 是否解析为 JSON
   * - function: 自定义解析函数
   * 默认为 false
   */
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  /** 处理器键名，默认为 'type' */
  handlerKey?: string
  /** 最大记录大小，默认为 100 */
  maxRecordSize?: number
}

/**
 * EventSource 组合式函数
 * 用于创建和管理 EventSource 连接的 Vue 组合式函数
 *
 * @template T 处理器类型
 * @template D 消息数据类型
 * @param url EventSource 连接地址，支持响应式引用
 * @param options 配置选项
 * @returns EventSource 实例和相关状态、方法
 *
 * @example
 * // 基本用法
 * const { status, data, onMessage } = useEventSource('https://api.example.com/events')
 *
 * onMessage((event) => {
 *   console.log('Received message:', event.data)
 * })
 *
 * @example
 * // 带自动重连的用法
 * const { status, connect } = useEventSource('https://api.example.com/events', {
 *   autoRetry: {
 *     retries: 5,
 *     delay: 2000,
 *     onFailed: () => console.error('Failed to connect after retries')
 *   }
 * })
 *
 * @example
 * // 带消息解析的用法
 * const { registerHandler } = useEventSource<{
 *   update: { id: number; value: string }
 *   error: { code: number; message: string }
 * }>('https://api.example.com/events', {
 *   parseMessage: true
 * })
 *
 * registerHandler('update', (data) => {
 *   console.log('Update received:', data)
 * })
 */
export function useEventSource<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseEventSourceOptions<T>) {
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
  const source: ShallowRef<EventSource | null> = shallowRef(null)

  const status: Ref<State> = ref('CLOSED')
  const error: Ref<Event | null> = ref(null)
  const data: Ref<D | null> = ref(null)
  const dataRecord: Ref<D[]> = ref([])
  const messageEvent: Ref<MessageEvent<D> | null> = ref(null)
  const messageEventRecord: Ref<MessageEvent<D>[]> = ref([])

  const controller: ShallowRef<AbortController> = shallowRef(new AbortController())

  const onOpenEvent = createEventHook<[EventSourceEventMap['open']]>()
  const onMessageEvent = createEventHook<[EventSourceEventMap['message']]>()
  const onErrorEvent = createEventHook<[EventSourceEventMap['error']]>()
  const onFailedEvent = createEventHook<[WebSocketEventMap['error']]>()

  function setStatus() {
    if (source.value) {
      status.value = ReadyState[source.value.readyState]
    }
  }

  /**
   * 连接到 EventSource
   * 创建新的 EventSource 连接并添加事件监听
   * @param url 连接地址（可选），默认为 urlRef 的值
   * @param options 连接选项（可选），会合并到初始选项
   * @example
   * // 使用默认 URL 连接
   * connect()
   *
   * @example
   * // 指定 URL 连接
   * connect('https://api.example.com/events')
   */
  function connect(url?: string | URL, options?: EventSourceInit) {
    if (source.value) {
      destroy()
    }
    if (url) {
      urlRef.value = url
    }
    if (options) {
      Object.assign(_options, options)
    }
    if (!urlRef.value) {
      throw new Error('EventSource url is not defined')
    }
    source.value = new EventSource(urlRef.value, _options)
    controller.value = new AbortController()
    source.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    source.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    source.value.addEventListener('error', onError, { signal: controller.value.signal })
  }

  /**
   * 关闭 EventSource 连接
   * 仅当连接处于 OPEN 状态时才执行关闭操作
   * @example
   * close() // 关闭当前 EventSource 连接
   */
  function close() {
    if (source.value?.readyState === 1) {
      source.value.close()
    }
    setStatus()
  }

  if (!manual) {
    connect()
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
        const dataJson = typeof parseMessage === 'function'
          ? await Promise.resolve(parseMessage(ev.data))
          : JSON.parse(ev.data) as Record<keyof T, any> | null

        if (dataJson?.[handlerKey]) {
          handlerMap.get(dataJson[handlerKey])?.forEach((f) => {
            f(dataJson)
          })
        }
      }
      catch (err) {
        console.error('Failed to parse message:', err)
      }
    }
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
   * const unregister = registerHandler('update', (data) => {
   *   console.log('Update received:', data)
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
   * cancelHandler('update', myHandler)
   */
  function cancelHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    if (handlerMap.has(type)) {
      handlerMap.set(type, handlerMap.get(type)?.filter(f => f !== handler) || [])
    }
  }

  /**
   * 注册自定义事件监听器
   * 为 EventSource 实例添加自定义事件监听
   * @param type 事件类型
   * @param handler 事件处理器
   * @example
   * registerEvent('custom', (ev) => {
   *   console.log('收到自定义事件')
   * })
   */
  function registerEvent(type: string, handler: (ev: MessageEvent<D>) => void) {
    if (source.value) {
      source.value.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  /**
   * 销毁 EventSource 实例
   * 关闭连接并清理所有资源
   * @example
   * destroy() // 销毁当前 EventSource 连接
   */
  function destroy() {
    close()
    controller.value.abort()
    source.value = null
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    source,
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
}

/**
 * useEventSource 返回类型
 * 包含 EventSource 实例、状态、方法和事件钩子
 * @example
 * const es: UseEventSourceReturns = useEventSource('https://api.example.com/events')
 */
export type UseEventSourceReturns = ReturnType<typeof useEventSource>
