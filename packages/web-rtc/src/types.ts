/**
 * 信令消息映射
 * 描述对端会话在信令交换过程中的消息结构，`from` 用于多对端场景下标识发送方
 * @example
 * const message: RtcSignalMap['offer'] = {
 *   payload: { key: 'peer-1', from: 'peer-2', desc: { type: 'offer', sdp: '...' } },
 * }
 */
export type RtcSignalMap = {
  /** 注册消息：信令服务器分配本端唯一标识 */
  'register': {
    payload: {
      /** 分配给客户端的唯一标识，无默认值（必填） */
      key: string
    }
  }
  /** Offer 消息：向目标对端发起连接 */
  'offer': {
    payload: {
      /** 目标对端标识，无默认值（必填） */
      key: string
      /** 发送方标识，默认为 undefined（单对端模式下可省略） */
      from?: string
      /** SDP offer 描述，无默认值（必填） */
      desc: RTCSessionDescriptionInit
    }
  }
  /** Answer 消息：响应对端的连接请求 */
  'answer': {
    payload: {
      /** 目标对端标识，无默认值（必填） */
      key: string
      /** 发送方标识，默认为 undefined */
      from?: string
      /** SDP answer 描述，无默认值（必填） */
      desc: RTCSessionDescriptionInit
    }
  }
  /** Answer-ok 消息：确认 answer 已接收，仅用于兼容旧信令服务 */
  'answer-ok': {
    payload: {
      /** 目标对端标识，无默认值（必填） */
      key: string
      /** 发送方标识，默认为 undefined */
      from?: string
    }
  }
  /** ICE candidate 消息：交换网络候选地址 */
  'ice-candidate': {
    payload: {
      /** 目标对端标识，无默认值（必填） */
      key: string
      /** 发送方标识，默认为 undefined */
      from?: string
      /** ICE 候选者信息，无默认值（必填） */
      candidate: RTCIceCandidateInit
    }
  }
  /** Bye 消息：主动结束与目标对端的会话 */
  'bye': {
    payload: {
      /** 目标对端标识，无默认值（必填） */
      key: string
      /** 发送方标识，默认为 undefined */
      from?: string
    }
  }
  /** Error 消息：服务端拒绝或无法路由时下发的错误通知 */
  'error': {
    payload: {
      /** 错误描述，无默认值（必填） */
      message: string
      /** 相关的目标对端标识，默认为 undefined */
      refKey?: string
    }
  }
}

/**
 * 信令消息联合类型
 * 由 {@link RtcSignalMap} 推导出的可发送消息结构
 * @example
 * const message: RtcSignalMessage = { type: 'bye', payload: { key: 'peer-1' } }
 */
export type RtcSignalMessage = {
  [K in keyof RtcSignalMap]: { type: K } & RtcSignalMap[K]
}[keyof RtcSignalMap]

/**
 * 信令通道
 * 抽象信令收发能力，默认实现基于 WebSocket，也可注入已有连接用于复用或测试
 * @example
 * const signaling: RtcSignaling = {
 *   send: message => socket.send(JSON.stringify(message)),
 *   onMessage: handler => socket.on('message', handler),
 *   close: () => socket.close(),
 * }
 */
export type RtcSignaling = {
  /** 发送一条信令消息，无默认值（必填） */
  send: (message: RtcSignalMessage) => void
  /** 订阅信令消息，返回取消订阅函数，无默认值（必填） */
  onMessage: (handler: (message: RtcSignalMessage) => void) => () => void
  /** 关闭信令通道并释放资源，无默认值（必填） */
  close: () => void
}

/**
 * 整体连接状态
 * - pending: 等待信令服务器分配标识
 * - ready: 已注册，可以发起连接
 * - connected: 至少一个对端已建立连接
 * - closed: 已调用 `destroy`
 */
export type RtcStatus = 'pending' | 'ready' | 'connected' | 'closed'

/**
 * 对端连接状态
 * - new: 初始状态
 * - connecting: 正在建立连接
 * - connected: 已连通
 * - disconnected: 连接中断
 * - failed: 连接失败
 * - closed: 已关闭
 */
export type RtcPeerStatus = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed'

/**
 * 单个对端连接状态
 * 由 `RTCPeerConnection.connectionState` 派生
 * @example
 * const peer: RtcPeerState = { key: 'peer-1', status: 'connected', polite: true }
 */
export type RtcPeerState = {
  /** 对端标识，无默认值（必填） */
  key: string
  /** 该对端的连接状态，默认为 'new' */
  status: RtcPeerStatus
  /** 该端是否为协商中的退让方，默认为 false */
  polite: boolean
}
