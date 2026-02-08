import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref } from 'vue'
import { useWebSocket } from './use-web-socket'

/**
 * WebRTC 配置选项
 * 继承自 RTCConfiguration，支持自定义 WebSocket 协议
 */
export type WebRTCOptions = RTCConfiguration & {
  /** WebSocket 子协议列表，用于指定连接时使用的协议 */
  protocols?: string[]
}

/**
 * WebRTC 连接状态
 * - pending: 初始状态，等待注册
 * - ready: 已注册，可以发起连接
 * - connected: 已建立连接
 * - closed: 连接已关闭
 */
export type Status = 'pending' | 'ready' | 'connected' | 'closed'

/**
 * WebSocket 信令消息类型定义
 * 用于 WebRTC 连接建立过程中的信令交换
 */
export type HandleEvent = {
  /** 注册消息：服务器分配唯一标识符 */
  'register': {
    payload: {
      /** 分配给客户端的唯一标识符 */
      key: string
    }
  }
  /** Offer 消息：发起连接请求 */
  'offer': {
    payload: {
      /** 目标客户端标识符 */
      key: string
      /** SDP offer 描述 */
      desc: RTCSessionDescriptionInit
    }
  }
  /** Answer 消息：响应连接请求 */
  'answer': {
    payload: {
      /** 发起方客户端标识符 */
      key: string
      /** SDP answer 描述 */
      desc: RTCSessionDescriptionInit
    }
  }
  /** Answer-ok 消息：确认 answer 已接收 */
  'answer-ok': {
    payload: {
      /** 目标客户端标识符 */
      key: string
    }
  }
  /** ICE candidate 消息：交换网络候选地址 */
  'ice-candidate': {
    payload: {
      /** ICE 候选者信息 */
      candidate: RTCIceCandidate
    }
  }
}

/**
 * WebRTC 连接管理 Composable
 *
 * 提供完整的 WebRTC 连接管理功能，包括：
 * - 通过 WebSocket 进行信令交换
 * - 支持数据通道和媒体流连接
 * - 实时状态监控和事件通知
 * - 自动清理和资源释放
 *
 * @example
 * ```ts
 * // 基本使用 - 数据通道连接
 * const { connect, onConnection, status } = useWebRTC('ws://localhost:8080')
 *
 * // 监听连接事件
 * onConnection((event) => {
 *   const channel = event.channel
 *   channel.onmessage = (e) => console.log('收到消息:', e.data)
 * })
 *
 * // 发起连接
 * const dataChannel = await connect('remote-peer-id', 'chat-channel')
 * dataChannel.send('Hello!')
 * ```
 *
 * @example
 * ```ts
 * // 媒体流连接 - 视频通话
 * const { connectStream, onConnectionStream, status } = useWebRTC('ws://localhost:8080')
 *
 * // 获取本地媒体流
 * const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
 *
 * // 发起媒体流连接
 * await connectStream('remote-peer-id', stream)
 *
 * // 接收远程媒体流
 * onConnectionStream((event) => {
 *   const remoteStream = event.streams[0]
 *   // 将流绑定到 video 元素
 *   videoElement.srcObject = remoteStream
 * })
 * ```
 *
 * @example
 * ```ts
 * // 自定义 STUN/TURN 服务器配置
 * const { connect, status } = useWebRTC('ws://localhost:8080', {
 *   iceServers: [
 *     { urls: 'stun:stun.l.google.com:19302' },
 *     {
 *       urls: 'turn:your-turn-server.com:3478',
 *       username: 'username',
 *       credential: 'password'
 *     }
 *   ],
 *   iceTransportPolicy: 'relay'
 * })
 * ```
 *
 * @param url - WebSocket 信令服务器地址
 * @param options - WebRTC 配置选项，继承 RTCConfiguration
 * @returns WebRTC 连接管理对象
 */
export function useWebRTC(url: string | URL, options?: WebRTCOptions) {
  const { protocols = [], ...rtcConfig } = options ?? {}

  // 创建事件钩子用于通知外部
  const onReadyEvent = createEventHook<void>()
  const onConnectionEvent = createEventHook<RTCDataChannelEvent>()
  const onConnectionStreamEvent = createEventHook<RTCTrackEvent>()

  // 用于控制事件监听器的清理
  const controller = new AbortController()

  // 响应式状态管理
  const id = ref<string>()
  const connected = ref<string[]>([])
  const status = ref<Status>('pending')

  // 创建 RTCPeerConnection 实例
  const peer = new RTCPeerConnection(rtcConfig)

  // 监控 WebRTC 连接状态
  const iceConnectionState = ref<RTCIceConnectionState>(peer.iceConnectionState)
  const signalingState = ref<RTCSignalingState>(peer.signalingState)
  const connectionState = ref<RTCPeerConnectionState>(peer.connectionState)

  // 初始化 WebSocket 连接用于信令交换
  const { registerHandler, send } = useWebSocket<HandleEvent>(url, { protocols, parseMessage: true })

  /**
   * 处理就绪事件
   * 当客户端成功注册到信令服务器时触发
   */
  function onReady() {
    onReadyEvent.trigger()
  }

  /**
   * 处理数据通道连接事件
   * 当远程端创建数据通道时触发
   */
  function onConnection(ev: RTCDataChannelEvent) {
    onConnectionEvent.trigger(ev)
  }

  /**
   * 处理媒体流连接事件
   * 当远程端添加媒体轨道时触发
   */
  function onConnectionStream(ev: RTCTrackEvent) {
    onConnectionStreamEvent.trigger(ev)
  }

  /**
   * 处理 ICE 候选者事件
   * 收集本地 ICE 候选者并通过信令服务器发送给远程端
   */
  function onIcecandidate(ev: RTCPeerConnectionIceEvent) {
    if (ev.candidate) {
      send({
        type: 'ice-candidate',
        payload: {
          candidate: ev.candidate,
        },
      })
    }
  }

  /**
   * 注册处理信令消息的处理器
   * 处理来自信令服务器的各种消息类型
   */

  // 处理注册消息：保存服务器分配的唯一标识符
  registerHandler('register', ({ payload }) => {
    const { key } = payload
    id.value = key
    status.value = 'ready'
    onReady()
  })

  // 处理 Offer 消息：作为接收方响应连接请求
  registerHandler('offer', async ({ payload }) => {
    const { key, desc } = payload
    await peer.setRemoteDescription(desc)
    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)
    send({
      type: 'answer',
      payload: {
        key,
        desc: answer,
      },
    })
  })

  // 处理 Answer 消息：作为发起方接收响应
  registerHandler('answer', async ({ payload }) => {
    const { key, desc } = payload
    await peer.setRemoteDescription(desc)
    if (!connected.value.includes(key)) {
      connected.value.push(key)
    }
    send({
      type: 'answer-ok',
      payload: {
        key,
      },
    })
  })

  // 处理 Answer-ok 消息：确认连接建立
  registerHandler('answer-ok', ({ payload }) => {
    const { key } = payload
    status.value = 'connected'
    if (!connected.value.includes(key)) {
      connected.value.push(key)
    }
  })

  // 处理 ICE candidate 消息：添加远程 ICE 候选者
  registerHandler('ice-candidate', async ({ payload }) => {
    const { candidate } = payload
    try {
      await peer.addIceCandidate(candidate)
    }
    catch (error) {
      console.error('添加 ICE 候选者失败:', error)
    }
  })

  /**
   * 发起数据通道连接
   *
   * 创建数据通道并发送 offer 给指定对等端
   *
   * @example
   * ```ts
   * // 创建聊天数据通道
   * const channel = await connect('peer-123', 'chat')
   * channel.onopen = () => console.log('通道已打开')
   * channel.onmessage = (e) => console.log('收到:', e.data)
   * channel.send('你好！')
   * ```
   *
   * @param id - 目标对等端的标识符
   * @param label - 数据通道的标签，用于标识通道用途
   * @returns 创建的数据通道对象
   */
  async function connect(id: string, label = 'label') {
    const dataChannel = peer.createDataChannel(label)
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    send({
      type: 'offer',
      payload: {
        key: id,
        desc: offer,
      },
    })

    return dataChannel
  }

  /**
   * 发起媒体流连接
   *
   * 将本地媒体流添加到连接并发送 offer 给指定对等端
   *
   * @example
   * ```ts
   * // 发起视频通话
   * const stream = await navigator.mediaDevices.getUserMedia({
   *   video: true,
   *   audio: true
   * })
   * await connectStream('peer-123', stream)
   *
   * // 监听远程流
   * onConnectionStream((event) => {
   *   const remoteStream = event.streams[0]
   *   videoElement.srcObject = remoteStream
   * })
   * ```
   *
   * @param id - 目标对等端的标识符
   * @param stream - 要发送的媒体流（音频/视频）
   * @returns RTCPeerConnection 实例
   */
  async function connectStream(id: string, stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream)
    })
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    send({
      type: 'offer',
      payload: {
        key: id,
        desc: offer,
      },
    })
    return peer
  }

  // 注册 RTCPeerConnection 事件监听器
  // 使用 AbortController 的 signal 来统一管理清理

  // ICE 候选者收集事件
  peer.addEventListener('icecandidate', onIcecandidate, { signal: controller.signal })

  // ICE 连接状态变化事件
  peer.addEventListener('iceconnectionstatechange', () => {
    iceConnectionState.value = peer.iceConnectionState
  }, { signal: controller.signal })

  // 信令状态变化事件
  peer.addEventListener('signalingstatechange', () => {
    signalingState.value = peer.signalingState
  }, { signal: controller.signal })

  // 连接状态变化事件
  peer.addEventListener('connectionstatechange', () => {
    connectionState.value = peer.connectionState
  }, { signal: controller.signal })

  // 数据通道接收事件
  peer.addEventListener('datachannel', onConnection, { signal: controller.signal })

  // 媒体轨道接收事件
  peer.addEventListener('track', onConnectionStream, { signal: controller.signal })

  /**
   * 清理资源
   * 终止所有事件监听器并关闭连接
   */
  function destroy() {
    controller.abort()
    peer.close()
  }

  // 组件卸载时自动清理
  onUnmounted(() => {
    destroy()
  })

  return {
    /** 当前客户端的唯一标识符 */
    id,
    /** 已连接的对等端标识符列表 */
    connected,
    /** 当前连接状态 */
    status,
    /** RTCPeerConnection 实例 */
    peer,
    /** ICE 连接状态 */
    signalingState,
    /** 连接状态 */
    connectionState,
    /** 发起数据通道连接 */
    connect,
    /** 发起媒体流连接 */
    connectStream,
    /** 监听就绪事件 */
    onReady: onReadyEvent.on,
    /** 监听数据通道连接事件 */
    onConnection: onConnectionEvent.on,
    /** 监听媒体流连接事件 */
    onConnectionStream: onConnectionStreamEvent.on,
  }
}
