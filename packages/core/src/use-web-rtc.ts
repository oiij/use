import { createEventHook } from '@vueuse/core'
import { onUnmounted, ref } from 'vue'
import { useWebSocket } from './use-web-socket'

/**
 * WebRTC 配置选项
 * 继承自 RTCConfiguration，支持自定义 WebSocket 协议
 */
export type WebRTCOptions = RTCConfiguration & {
  /**
   * WebSocket 子协议列表，用于指定连接时使用的协议
   */
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
  /**
   * 注册消息：服务器分配唯一标识符
   */
  'register': {
    payload: {
      /**
       * 分配给客户端的唯一标识符
       */
      key: string
    }
  }
  /**
   * Offer 消息：发起连接请求
   */
  'offer': {
    payload: {
      /**
       * 目标客户端标识符
       */
      key: string
      /**
       * SDP offer 描述
       */
      desc: RTCSessionDescriptionInit
    }
  }
  /**
   * Answer 消息：响应连接请求
   */
  'answer': {
    payload: {
      /**
       * 发起方客户端标识符
       */
      key: string
      /**
       * SDP answer 描述
       */
      desc: RTCSessionDescriptionInit
    }
  }
  /**
   * Answer-ok 消息：确认 answer 已接收
   */
  'answer-ok': {
    payload: {
      /**
       * 目标客户端标识符
       */
      key: string
    }
  }
  /**
   * ICE candidate 消息：交换网络候选地址
   */
  'ice-candidate': {
    payload: {
      /**
       * ICE 候选者信息
       */
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
 * @param url WebSocket 信令服务器地址
 * @param options WebRTC 配置选项，继承 RTCConfiguration
 * @returns WebRTC 连接管理对象
 *
 * @example
 * ```ts
 * const { connect, onConnection, status } = useWebRTC('ws://localhost:8080')
 *
 * onConnection((event) => {
 *   const channel = event.channel
 *   channel.onmessage = (e) => console.log('收到消息:', e.data)
 * })
 *
 * const dataChannel = await connect('remote-peer-id', 'chat-channel')
 * dataChannel.send('Hello!')
 * ```
 *
 * @example
 * ```ts
 * const { connectStream, onConnectionStream, status } = useWebRTC('ws://localhost:8080')
 *
 * const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
 * await connectStream('remote-peer-id', stream)
 *
 * onConnectionStream((event) => {
 *   const remoteStream = event.streams[0]
 *   videoElement.srcObject = remoteStream
 * })
 * ```
 *
 * @example
 * ```ts
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
 */
export function useWebRTC(url: string | URL, options?: WebRTCOptions) {
  const { protocols = [], ...rtcConfig } = options ?? {}

  const onReadyEvent = createEventHook<void>()
  const onConnectionEvent = createEventHook<RTCDataChannelEvent>()
  const onConnectionStreamEvent = createEventHook<RTCTrackEvent>()

  const controller = new AbortController()

  const id = ref<string>()
  const connected = ref<string[]>([])
  const status = ref<Status>('pending')

  const peer = new RTCPeerConnection(rtcConfig)

  const iceConnectionState = ref<RTCIceConnectionState>(peer.iceConnectionState)
  const signalingState = ref<RTCSignalingState>(peer.signalingState)
  const connectionState = ref<RTCPeerConnectionState>(peer.connectionState)

  const { registerHandler, send } = useWebSocket<HandleEvent>(url, { protocols, parseMessage: true })

  function onReady() {
    onReadyEvent.trigger()
  }

  function onConnection(ev: RTCDataChannelEvent) {
    onConnectionEvent.trigger(ev)
  }

  function onConnectionStream(ev: RTCTrackEvent) {
    onConnectionStreamEvent.trigger(ev)
  }

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

  registerHandler('register', ({ payload }) => {
    const { key } = payload
    id.value = key
    status.value = 'ready'
    onReady()
  })

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

  registerHandler('answer-ok', ({ payload }) => {
    const { key } = payload
    status.value = 'connected'
    if (!connected.value.includes(key)) {
      connected.value.push(key)
    }
  })

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
   * 创建数据通道并发送 offer 给指定对等端
   *
   * @param id 目标对等端的标识符
   * @param label 数据通道的标签，用于标识通道用途
   * @returns 创建的数据通道对象
   *
   * @example
   * ```ts
   * const channel = await connect('peer-123', 'chat')
   * channel.onopen = () => console.log('通道已打开')
   * channel.onmessage = (e) => console.log('收到:', e.data)
   * channel.send('你好！')
   * ```
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
   * 将本地媒体流添加到连接并发送 offer 给指定对等端
   *
   * @param id 目标对等端的标识符
   * @param stream 要发送的媒体流（音频/视频）
   * @returns RTCPeerConnection 实例
   *
   * @example
   * ```ts
   * const stream = await navigator.mediaDevices.getUserMedia({
   *   video: true,
   *   audio: true
   * })
   * await connectStream('peer-123', stream)
   *
   * onConnectionStream((event) => {
   *   const remoteStream = event.streams[0]
   *   videoElement.srcObject = remoteStream
   * })
   * ```
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

  peer.addEventListener('icecandidate', onIcecandidate, { signal: controller.signal })

  peer.addEventListener('iceconnectionstatechange', () => {
    iceConnectionState.value = peer.iceConnectionState
  }, { signal: controller.signal })

  peer.addEventListener('signalingstatechange', () => {
    signalingState.value = peer.signalingState
  }, { signal: controller.signal })

  peer.addEventListener('connectionstatechange', () => {
    connectionState.value = peer.connectionState
  }, { signal: controller.signal })

  peer.addEventListener('datachannel', onConnection, { signal: controller.signal })

  peer.addEventListener('track', onConnectionStream, { signal: controller.signal })

  /**
   * 清理资源
   * 终止所有事件监听器并关闭连接
   *
   * @example
   * ```ts
   * const { destroy } = useWebRTC('ws://localhost:8080')
   * destroy()
   * ```
   */
  function destroy() {
    controller.abort()
    peer.close()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    id,
    connected,
    status,
    peer,
    signalingState,
    connectionState,
    connect,
    connectStream,
    onReady: onReadyEvent.on,
    onConnection: onConnectionEvent.on,
    onConnectionStream: onConnectionStreamEvent.on,
  }
}

/**
 * useWebRTC 函数的返回类型
 */
export type UseWebRTCReturns = ReturnType<typeof useWebRTC>
