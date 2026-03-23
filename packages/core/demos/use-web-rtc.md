# UseWebRTC

## 功能描述

**UseWebRTC** 是一个用于实现 WebRTC 实时通信的 Vue 组合式函数，支持建立点对点连接、数据传输和媒体流共享，可用于创建视频通话、语音通话和实时数据共享应用。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./use-web-rtc.vue" title="UseWebRTC" />

## API

### `useWebRTC(url, options?)`

创建 WebRTC 连接。

#### 参数

| 参数      | 类型            | 说明           |
| --------- | --------------- | -------------- |
| `url`     | `string \| URL` | 信令服务器地址 |
| `options` | `WebRTCOptions` | 配置选项       |

#### WebRTCOptions

| 选项               | 类型               | 说明                   |
| ------------------ | ------------------ | ---------------------- |
| `protocols`        | `string[]`         | WebSocket 协议         |
| `RTCConfiguration` | `RTCConfiguration` | RTCPeerConnection 配置 |

#### 返回值

| 属性                           | 类型                          | 说明                   |
| ------------------------------ | ----------------------------- | ---------------------- |
| `id`                           | `Ref<string \| undefined>`    | 当前连接 ID            |
| `connected`                    | `Ref<string[]>`               | 已连接的 ID 列表       |
| `status`                       | `Ref<Status>`                 | 连接状态               |
| `peer`                         | `RTCPeerConnection`           | RTCPeerConnection 实例 |
| `signalingState`               | `Ref<RTCSignalingState>`      | 信令状态               |
| `connectionState`              | `Ref<RTCPeerConnectionState>` | 连接状态               |
| `connect(id, label?)`          | `Function`                    | 建立数据通道连接       |
| `connectStream(id, stream)`    | `Function`                    | 建立媒体流连接         |
| `onReady(callback)`            | `Function`                    | 就绪事件               |
| `onConnection(callback)`       | `Function`                    | 连接事件               |
| `onConnectionStream(callback)` | `Function`                    | 媒体流连接事件         |

## 类型定义

```ts
type WebRTCOptions = RTCConfiguration & {
  protocols?: string[]
}

type Status = 'pending' | 'ready' | 'connected' | 'closed'

export type UseWebRTCReturns = {
  /**
   * 当前连接 ID
   */
  id: Ref<string | undefined>
  /**
   * 已连接的 ID 列表
   */
  connected: Ref<string[]>
  /**
   * 连接状态
   */
  status: Ref<Status>
  /**
   * RTCPeerConnection 实例
   */
  peer: RTCPeerConnection
  /**
   * 信令状态
   */
  signalingState: Ref<RTCSignalingState>
  /**
   * 连接状态
   */
  connectionState: Ref<RTCPeerConnectionState>
  /**
   * 建立数据通道连接
   */
  connect: (id: string, label?: string) => Promise<RTCDataChannel>
  /**
   * 建立媒体流连接
   */
  connectStream: (id: string, stream: MediaStream) => Promise<RTCPeerConnection>
  /**
   * 就绪事件
   */
  onReady: (callback: () => void) => void
  /**
   * 连接事件
   */
  onConnection: (callback: (event: RTCDataChannelEvent) => void) => void
  /**
   * 媒体流连接事件
   */
  onConnectionStream: (callback: (event: RTCTrackEvent) => void) => void
}

export declare function useWebRTC(url: string | URL, options?: WebRTCOptions): UseWebRTCReturns
```

## 使用示例

### 基础用法（数据通道）

```vue
<script setup>
import { useWebRTC } from '@oiij/use'

const { id, status, connect, onReady, onConnection } = useWebRTC('wss://signaling-server.com')

onReady(() => {
  console.log('就绪，ID:', id.value)
})

onConnection((event) => {
  const channel = event.channel
  channel.onmessage = (e) => {
    console.log('收到消息:', e.data)
  }
})

async function connectTo(targetId) {
  const channel = await connect(targetId)
  channel.send('Hello!')
}
</script>

<template>
  <p>状态: {{ status }}</p>
  <p>ID: {{ id }}</p>
  <button @click="connectTo('target-id')">
    连接
  </button>
</template>
```

### 媒体流（视频通话）

```vue
<script setup>
import { useWebRTC } from '@oiij/use'
import { ref } from 'vue'

const localVideo = ref()
const remoteVideo = ref()
const { connectStream, onConnectionStream } = useWebRTC('wss://signaling-server.com')

onConnectionStream((event) => {
  remoteVideo.value.srcObject = event.streams[0]
})

async function startCall(targetId) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  localVideo.value.srcObject = stream
  await connectStream(targetId, stream)
}
</script>

<template>
  <video ref="localVideo" autoplay muted />
  <video ref="remoteVideo" autoplay />
  <button @click="startCall('target-id')">
    开始通话
  </button>
</template>
```
