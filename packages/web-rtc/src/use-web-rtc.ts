import type { MaybeRefOrGetter } from 'vue'
import type { RtcPeerState, RtcPeerStatus, RtcSignaling, RtcSignalMessage, RtcStatus } from './types'
import { createEventHook, tryOnScopeDispose } from '@vueuse/core'
import { computed, markRaw, ref } from 'vue'
import { createPeerSession } from './_internal/rtc-peer'
import { createWebSocketSignaling } from './_internal/rtc-signaling'

/**
 * {@link useWebRTC} 的配置选项
 * 继承原生 `RTCConfiguration`，额外提供信令通道与协商角色配置
 * @example
 * const options: UseWebRTCOptions = {
 *   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
 *   polite: 'auto',
 * }
 */
export type UseWebRTCOptions = RTCConfiguration & {
  /** WebSocket 子协议列表，默认为 [] */
  protocols?: string[]
  /** 自定义信令通道，默认为 undefined（使用内置 WebSocket 信令） */
  transport?: RtcSignaling
  /** 是否自动建立信令连接，默认为 true */
  autoConnect?: boolean
  /** 冲突协商角色，默认为 'auto'（按 key 字典序自动决定，保证两端互补） */
  polite?: boolean | 'auto'
}

/**
 * WebRTC 实时通信
 *
 * 通过可注入的信令通道为每个对端维护独立的 `RTCPeerConnection`，支持数据通道、媒体流、
 * 完美协商（perfect negotiation）与 ICE 候选缓存，并暴露按对端维度的状态与事件。
 *
 * @param url 信令服务器地址，支持响应式引用
 * @param options WebRTC 配置选项
 * @returns 连接管理对象
 *
 * @example
 * ```ts
 * const { id, status, peers, connect, onChannel } = useWebRTC('ws://localhost:4100/ws')
 *
 * onChannel(({ key, channel }) => {
 *   channel.onmessage = (e) => console.log(key, e.data)
 * })
 *
 * const channel = connect('peer-1', { label: 'chat' })
 * channel?.send('hello')
 * ```
 *
 * @example
 * ```ts
 * const { connectStream, onTrack } = useWebRTC('ws://localhost:4100/ws')
 * const local = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
 *
 * onTrack(({ stream }) => {
 *   videoElement.srcObject = stream
 * })
 *
 * await connectStream('peer-2', local)
 * ```
 *
 * @example
 * ```ts
 * const { send, broadcast, close } = useWebRTC('ws://localhost:4100/ws', {
 *   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
 * })
 *
 * send('peer-1', 'hi')
 * broadcast('hello everyone')
 * close('peer-1')
 * ```
 */
export function useWebRTC(url: MaybeRefOrGetter<string | URL>, options?: UseWebRTCOptions) {
  const { protocols = [], transport, autoConnect = true, polite = 'auto', ...rtcConfig } = options ?? {}
  const supported = typeof RTCPeerConnection !== 'undefined'

  const id = ref<string>()
  const peerMap = ref<Map<string, RtcPeerState>>(new Map())
  const destroyed = ref(false)

  const onReadyEvent = createEventHook<void>()
  const onChannelEvent = createEventHook<{ key: string, channel: RTCDataChannel }>()
  const onTrackEvent = createEventHook<{ key: string, stream: MediaStream }>()
  const onStateChangeEvent = createEventHook<{ key: string, status: RtcPeerStatus }>()
  const onErrorEvent = createEventHook<{ error: unknown, key?: string }>()

  const sessions = new Map<string, ReturnType<typeof createPeerSession>>()
  const trackWaiters = new Map<string, { resolve: (stream: MediaStream) => void }>()

  const peers = computed(() => [...peerMap.value.values()])
  const connected = computed(() => peers.value.filter(item => item.status === 'connected').map(item => item.key))
  const status = computed<RtcStatus>(() => {
    if (destroyed.value) {
      return 'closed'
    }
    if (!id.value) {
      return 'pending'
    }
    return connected.value.length > 0 ? 'connected' : 'ready'
  })

  const signaling: RtcSignaling | null = supported
    ? transport ?? createWebSocketSignaling(url, { protocols, manual: !autoConnect })
    : null

  function isPolite(key: string): boolean {
    if (typeof polite === 'boolean') {
      return polite
    }
    return (id.value ?? '') < key
  }

  function updateStatus(key: string, next: RtcPeerStatus) {
    const target = peerMap.value.get(key)
    if (target) {
      target.status = next
    }
    onStateChangeEvent.trigger({ key, status: next })
  }

  function ensureSession(key: string) {
    const existing = sessions.get(key)
    if (existing) {
      return existing
    }
    const session = createPeerSession({
      key,
      polite: isPolite(key),
      config: rtcConfig,
      getSelfKey: () => id.value,
      sendSignal: message => signaling?.send(message),
      onStatus: next => updateStatus(key, next),
      onChannel: channel => onChannelEvent.trigger({ key, channel: markRaw(channel) }),
      onTrack: (stream) => {
        const raw = markRaw(stream)
        trackWaiters.get(key)?.resolve(raw)
        trackWaiters.delete(key)
        onTrackEvent.trigger({ key, stream: raw })
      },
      onError: error => onErrorEvent.trigger({ error, key }),
    })
    sessions.set(key, session)
    peerMap.value.set(key, { key, status: 'new', polite: isPolite(key) })
    return session
  }

  function handleSignal(message: RtcSignalMessage) {
    switch (message.type) {
      case 'register':
        id.value = message.payload.key
        onReadyEvent.trigger()
        break
      case 'offer': {
        const key = message.payload.from ?? message.payload.key
        void ensureSession(key).acceptOffer(message.payload.desc).catch(error => onErrorEvent.trigger({ error, key }))
        break
      }
      case 'answer': {
        const key = message.payload.from ?? message.payload.key
        void ensureSession(key).acceptAnswer(message.payload.desc).catch(error => onErrorEvent.trigger({ error, key }))
        break
      }
      case 'ice-candidate': {
        const key = message.payload.from ?? message.payload.key
        void ensureSession(key).addCandidate(message.payload.candidate).catch(error => onErrorEvent.trigger({ error, key }))
        break
      }
      case 'bye':
        close(message.payload.from ?? message.payload.key)
        break
      case 'answer-ok':
        break
      case 'error':
        onErrorEvent.trigger({ error: new Error(message.payload.message), key: message.payload.refKey })
        break
    }
  }

  signaling?.onMessage(handleSignal)

  /**
   * 与指定对端建立数据通道
   * 内部会自动创建 `RTCPeerConnection` 并触发完美协商
   * @param key 对端标识
   * @param options 连接选项，可指定通道名称或同时附加本地媒体流
   * @param options.label 数据通道名称，默认为 `channel-<key>`
   * @param options.stream 同时附加的本地媒体流，默认为 undefined
   * @returns 创建的数据通道，运行环境不支持 WebRTC 时返回 undefined
   * @example
   * const channel = connect('peer-1', { label: 'chat' })
   * channel?.onmessage = e => console.log(e.data)
   */
  function connect(key: string, options?: { label?: string, stream?: MediaStream }) {
    if (!supported || !key) {
      return undefined
    }
    const session = ensureSession(key)
    if (options?.stream) {
      session.addStream(options.stream)
    }
    return session.createChannel(options?.label ?? `channel-${key}`)
  }

  /**
   * 与指定对端建立媒体流连接
   * @param key 对端标识
   * @param stream 本地媒体流
   * @returns 收到对端首个媒体轨时 resolve 的远端流
   * @example
   * const local = await navigator.mediaDevices.getUserMedia({ video: true })
   * const remote = await connectStream('peer-1', local)
   */
  function connectStream(key: string, stream: MediaStream): Promise<MediaStream> {
    if (!supported) {
      return Promise.reject(new Error('RTCPeerConnection is not supported'))
    }
    const session = ensureSession(key)
    if (session.stream) {
      return Promise.resolve(session.stream)
    }
    session.addStream(stream)
    return new Promise<MediaStream>((resolve) => {
      trackWaiters.set(key, { resolve })
    })
  }

  /**
   * 向指定对端发送数据
   * @param key 对端标识
   * @param data 字符串或二进制数据
   * @returns 通道未就绪时返回 false
   * @example
   * send('peer-1', 'hello')
   */
  function send(key: string, data: string | Blob | ArrayBuffer | ArrayBufferView) {
    const channel = sessions.get(key)?.channel
    if (!channel || channel.readyState !== 'open') {
      return false
    }
    ;(channel.send as (data: unknown) => void)(data)
    return true
  }

  /**
   * 向所有已建立的对端广播数据
   * @param data 字符串或二进制数据
   * @example
   * broadcast('hello everyone')
   */
  function broadcast(data: string | Blob | ArrayBuffer | ArrayBufferView) {
    for (const key of sessions.keys()) {
      send(key, data)
    }
  }

  /**
   * 关闭与指定对端的连接
   * @param key 对端标识
   * @example
   * close('peer-1')
   */
  function close(key: string) {
    const session = sessions.get(key)
    if (!session) {
      return
    }
    session.close()
    sessions.delete(key)
    trackWaiters.delete(key)
    peerMap.value.delete(key)
  }

  /**
   * 销毁全部连接并关闭信令通道
   * 组件卸载或作用域销毁时会自动调用
   * @example
   * destroy()
   */
  function destroy() {
    if (destroyed.value) {
      return
    }
    for (const key of [...sessions.keys()]) {
      close(key)
    }
    signaling?.close()
    peerMap.value.clear()
    destroyed.value = true
  }

  tryOnScopeDispose(destroy)

  return {
    id,
    status,
    peers,
    connected,
    connect,
    connectStream,
    send,
    broadcast,
    close,
    destroy,
    onReady: onReadyEvent.on,
    onChannel: onChannelEvent.on,
    onTrack: onTrackEvent.on,
    onStateChange: onStateChangeEvent.on,
    onError: onErrorEvent.on,
  }
}

/**
 * useWebRTC 函数的返回类型
 * @example
 * const rtc: UseWebRTCReturns = useWebRTC('ws://localhost:4100/ws')
 */
export type UseWebRTCReturns = ReturnType<typeof useWebRTC>
