import type { Ref, ShallowRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref, shallowRef, toValue, watch, watchEffect } from 'vue'

/**
 * EventSource 连接状态
 */
type State = 'CONNECTING' | 'OPEN' | 'CLOSED'

/**
 * 自动重连配置
 */
type AutoRetry = boolean | {
  /** 最大重试次数，默认3次 */
  retries?: number
  /** 重试延迟时间，默认1000ms */
  delay?: number
  /** 重试失败回调 */
  onFailed?: () => void
}

/**
 * EventSource 就绪状态映射
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
type MessageRaw = any

/**
 * 事件处理器类型
 */
type HandlerType = {
  [key: string]: any
}

/**
 * useEventSource 选项配置
 */
export type UseEventSourceOptions<T extends HandlerType = HandlerType> = EventSourceInit & {
  /** 是否手动连接，默认false */
  manual?: boolean
  /** 自动重连配置，默认false */
  autoRetry?: AutoRetry
  /** 消息解析配置，默认false */
  parseMessage?: boolean | ((raw: MessageRaw) => Record<keyof T, unknown> | Promise<Record<keyof T, unknown>>)
  /** 处理器键名，默认'type' */
  handlerKey?: string
  /** 最大记录大小，默认为 100 */
  maxRecordSize?: number
}

/**
 * EventSource 组合式函数
 *
 * @description 用于创建和管理 EventSource 连接的 Vue 组合式函数
 * @example
 * ```ts
 * // 基本用法
 * const { status, data, onMessage } = useEventSource('https://api.example.com/events')
 *
 * // 监听消息
 * onMessage((event) => {
 *   console.log('Received message:', event.data)
 * })
 *
 * // 带自动重连的用法
 * const { status, connect } = useEventSource('https://api.example.com/events', {
 *   autoRetry: {
 *     retries: 5,
 *     delay: 2000,
 *     onFailed: () => console.error('Failed to connect after retries')
 *   }
 * })
 *
 * // 带消息解析的用法
 * const { registerHandler } = useEventSource<{
 *   update: { id: number; value: string }
 *   error: { code: number; message: string }
 * }>('https://api.example.com/events', {
 *   parseMessage: true
 * })
 *
 * // 注册特定类型的消息处理器
 * registerHandler('update', (data) => {
 *   console.log('Update received:', data)
 * })
 *
 * // 注册错误消息处理器
 * registerHandler('error', (data) => {
 *   console.error('Error received:', data)
 * })
 * ```
 * @param url - EventSource 连接地址
 * @param options - 配置选项
 * @returns EventSource 实例和相关状态、方法
 */
export function useEventSource<T extends HandlerType = HandlerType, D extends MessageRaw = MessageRaw>(url?: string | URL | Ref<string | URL>, options?: UseEventSourceOptions<T>) {
  // 解析配置选项
  const { manual = false, autoRetry, parseMessage = false, handlerKey = 'type', maxRecordSize = 100, ..._options } = options ?? {}
  // 解析自动重连配置
  const { retries = 3, delay = 1000, onFailed } = typeof autoRetry === 'boolean' ? {} : autoRetry ?? {}
  // 重试计数器
  let retryCount = 0

  // 响应式URL引用
  const urlRef: Ref<string | URL | undefined> = ref(toValue(url))
  // 监听URL变化
  watchEffect(() => urlRef.value = toValue(url))
  // URL变化时自动重连
  watch(urlRef, () => {
    if (!manual) {
      connect()
    }
  })

  // 消息处理器映射
  const handlerMap = new Map<keyof T, ((data: any) => void)[]>()
  // EventSource 实例
  const source: ShallowRef<EventSource | null> = shallowRef(null)

  // 连接状态
  const status: Ref<State> = ref('CLOSED')
  // 错误信息
  const error: Ref<Event | null> = ref(null)
  // 最新消息数据
  const data: Ref<D | null> = ref(null)
  // 消息数据记录
  const dataRecord: Ref<D[]> = ref([])
  // 最新消息事件
  const messageEvent: Ref<MessageEvent<D> | null> = ref(null)
  // 消息事件记录
  const messageEventRecord: Ref<MessageEvent<D>[]> = ref([])

  // 中止控制器
  const controller: ShallowRef<AbortController> = shallowRef(new AbortController())

  // 事件钩子
  const onOpenEvent = createEventHook<[EventSourceEventMap['open']]>()
  const onMessageEvent = createEventHook<[EventSourceEventMap['message']]>()
  const onErrorEvent = createEventHook<[EventSourceEventMap['error']]>()
  const onFailedEvent = createEventHook<[WebSocketEventMap['error']]>() // 重试失败事件
  /**
   * 更新连接状态
   */
  function setStatus() {
    if (source.value) {
      status.value = ReadyState[source.value.readyState]
    }
  }

  /**
   * 连接到 EventSource
   * @param url - 可选的连接地址，会覆盖初始地址
   * @param options - 可选的连接选项，会合并到初始选项
   */
  function connect(url?: string | URL, options?: EventSourceInit) {
    // 如果已有连接，先销毁
    if (source.value) {
      destroy()
    }
    // 更新URL
    if (url) {
      urlRef.value = url
    }
    // 合并选项
    if (options) {
      Object.assign(_options, options)
    }
    // 验证URL
    if (!urlRef.value) {
      throw new Error('EventSource url is not defined')
    }
    // 创建新的 EventSource 实例
    source.value = new EventSource(urlRef.value, _options)
    // 创建新的中止控制器
    controller.value = new AbortController()
    // 添加事件监听器
    source.value.addEventListener('open', onOpen, { signal: controller.value.signal })
    source.value.addEventListener('message', onMessage, { signal: controller.value.signal })
    source.value.addEventListener('error', onError, { signal: controller.value.signal })
  }

  /**
   * 关闭 EventSource 连接
   */
  function close() {
    // 只有在连接打开状态才关闭
    if (source.value?.readyState === 1) {
      source.value.close()
    }
    // 更新状态
    setStatus()
  }

  // 如果不是手动模式，自动连接
  if (!manual) {
    connect()
  }

  /**
   * 处理连接打开事件
   * @param ev - 打开事件
   */
  function onOpen(ev: Event) {
    // 更新状态
    setStatus()
    // 重置错误状态
    error.value = null
    // 重置数据状态
    data.value = null
    messageEvent.value = null
    // 重置重试计数
    retryCount = 0
    // 触发打开事件钩子
    onOpenEvent.trigger(ev)
  }

  /**
   * 处理消息事件
   * @param ev - 消息事件
   */
  async function onMessage(ev: MessageEvent<D>) {
    // 更新状态
    setStatus()
    // 保存最新消息数据
    data.value = ev.data
    // 添加到数据记录
    dataRecord.value.push(ev.data)
    // 限制记录大小
    if (dataRecord.value.length > maxRecordSize) {
      dataRecord.value.shift()
    }
    // 保存最新消息事件
    messageEvent.value = ev
    // 添加到事件记录
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
        // 根据配置解析消息
        const dataJson = typeof parseMessage === 'function'
          ? await Promise.resolve(parseMessage(ev.data))
          : JSON.parse(ev.data) as Record<keyof T, any> | null

        // 如果解析成功且包含处理器键
        if (dataJson?.[handlerKey]) {
          // 执行对应类型的处理器
          handlerMap.get(dataJson[handlerKey])?.forEach((f) => {
            f(dataJson)
          })
        }
      }
      catch (err) {
        // 解析错误处理
        console.error('Failed to parse message:', err)
      }
    }
  }

  /**
   * 处理错误事件
   * @param ev - 错误事件
   */
  function onError(ev: Event) {
    // 更新状态
    setStatus()
    // 保存错误信息
    error.value = ev
    // 触发错误事件钩子
    onErrorEvent.trigger(ev)

    // 自动重连处理
    if (autoRetry) {
      if (retryCount < retries) {
        // 增加重试计数
        retryCount++
        // 延迟重连
        setTimeout(() => {
          connect()
        }, delay)
      }
      else {
        // 重试失败，执行失败回调
        onFailed?.()
        onFailedEvent.trigger(ev)
        // 重置重试计数
        retryCount = 0
      }
    }
  }

  /**
   * 注册消息处理器
   * @param type - 消息类型
   * @param handler - 消息处理器函数
   * @returns 取消注册函数
   */
  function registerHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    // 如果该类型处理器不存在，创建新数组
    if (!handlerMap.has(type)) {
      handlerMap.set(type, [])
    }
    // 添加处理器
    handlerMap.get(type)?.push(handler)
    // 返回取消注册函数
    return () => cancelHandler(type, handler)
  }

  /**
   * 取消消息处理器注册
   * @param type - 消息类型
   * @param handler - 要取消的处理器函数
   */
  function cancelHandler<K extends keyof T>(type: K, handler: (data: T[K]) => void) {
    // 如果该类型处理器存在，过滤掉指定处理器
    if (handlerMap.has(type)) {
      handlerMap.set(type, handlerMap.get(type)?.filter(f => f !== handler) || [])
    }
  }

  /**
   * 注册自定义事件监听器
   * @param type - 事件类型
   * @param handler - 事件处理器函数
   */
  function registerEvent(type: string, handler: (ev: MessageEvent<D>) => void) {
    // 如果 EventSource 实例存在，添加事件监听器
    if (source.value) {
      source.value.addEventListener(type, handler, { signal: controller.value.signal })
    }
  }

  /**
   * 销毁 EventSource 实例
   */
  function destroy() {
    // 关闭连接
    close()
    // 中止所有事件监听器
    controller.value.abort()
    // 清空实例引用
    source.value = null
  }

  // 组件卸载时销毁
  onUnmounted(() => {
    destroy()
  })

  // 返回实例和相关状态、方法
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
 */
export type UseEventSourceReturns = ReturnType<typeof useEventSource>
