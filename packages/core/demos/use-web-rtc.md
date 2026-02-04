# UseWebRTC

## 功能描述

**UseWebRTC** 是一个用于实现 WebRTC 实时通信的 Vue 组合式函数，支持建立点对点连接、数据传输和媒体流共享，可用于创建视频通话、语音通话和实时数据共享应用。

## 安装

```bash
# 使用 npm
npm install @use/core

# 使用 yarn
yarn add @use/core

# 使用 pnpm
pnpm add @use/core
```

## 基本使用

<demo vue="./use-web-rtc.vue" title="UseWebRTC" />

## API

### 函数签名

```ts
declare function useWebRTC(url: string | URL, options?: WebRTCOptions): UseWebRTCReturns
```

## 类型定义

```ts
type WebRTCOptions = RTCConfiguration & {
  protocols?: string[]
}

type Status = 'pending' | 'ready' | 'connected' | 'closed'

type HandleEvent = {
  'register': {
    key: string
  }
  'offer': {
    key: string
    desc: RTCSessionDescriptionInit
  }
  'answer': {
    key: string
    desc: RTCSessionDescriptionInit
  }
  'answer-ok': {
    key: string
  }
  'ice-candidate': {
    candidate: RTCIceCandidate
  }
}

export type UseWebRTCReturns = {
  id: Ref<string | undefined>
  connected: Ref<string[]>
  status: Ref<Status>
  peer: RTCPeerConnection
  signalingState: Ref<RTCSignalingState>
  connectionState: Ref<RTCPeerConnectionState>
  connect: (id: string, label?: string) => Promise<RTCDataChannel>
  connectStream: (id: string, stream: MediaStream) => Promise<RTCPeerConnection>
  onReady: EventHookOn<void>
  onConnection: EventHookOn<RTCDataChannelEvent>
  onConnectionStream: EventHookOn<RTCTrackEvent>
}

export function useWebRTC(url: string | URL, options?: WebRTCOptions): UseWebRTCReturns
```
