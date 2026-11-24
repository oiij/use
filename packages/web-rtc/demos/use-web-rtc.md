# UseWebRTC

## 功能描述

**UseWebRTC** 是一个用于实现 WebRTC 实时通信的 Vue 组合式函数。它为每个对端维护独立的 `RTCPeerConnection`，支持数据通道、媒体流、ICE 候选缓存与完美协商（perfect negotiation），可用于视频通话、语音通话和实时数据共享应用。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/web-rtc

# 使用 npm
npm install @oiij/web-rtc

# 使用 yarn
yarn add @oiij/web-rtc
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 本地信令服务

服务端与客户端同属 `@oiij/web-rtc`，通过子路径 `@oiij/web-rtc/server` 引入：

```ts
import { createRtcServer, createWsHooks } from '@oiij/web-rtc/server'
```

也可以直接运行内置 CLI：

```bash
pnpm --filter @oiij/web-rtc build
pnpm --filter @oiij/web-rtc dev:server
# 或使用全局命令
npx web-rtc-server
# 默认监听 http://localhost:4100，WebSocket 路径 /ws
```

支持环境变量 `RTC_PORT`、`RTC_HOST`、`RTC_PATH`，并提供 `GET /health`、`GET /peers` 两个查询接口。

```ts
// 由服务端自动分配标识
const { id, peers } = useWebRTC('ws://localhost:4100/ws')

// 也可以指定固定标识，便于互相输入对方 ID 建立连接
const { id } = useWebRTC('ws://localhost:4100/ws?key=alice')
```

## 基本使用

> 示例连接本地信令服务 `ws://localhost:4100/ws`，请先按上一节启动服务。通过 https 访问文档站点时，浏览器会拦截 `ws://`，建议使用本地 `pnpm docs:dev` 预览。

<demo vue="./use-web-rtc.vue" title="UseWebRTC" />

## API

### `useWebRTC(url, options?)`

创建 WebRTC 连接管理对象。

#### 参数

| 参数      | 类型                              | 说明                           |
| --------- | --------------------------------- | ------------------------------ |
| `url`     | `MaybeRefOrGetter<string \| URL>` | 信令服务器地址，支持响应式引用 |
| `options` | `UseWebRTCOptions`                | 配置选项                       |

#### UseWebRTCOptions

| 选项               | 类型                | 默认值   | 说明                                                   |
| ------------------ | ------------------- | -------- | ------------------------------------------------------ |
| `protocols`        | `string[]`          | `[]`     | WebSocket 子协议列表                                   |
| `transport`        | `RtcSignaling`      | -        | 自定义信令通道，用于复用已有连接或测试                 |
| `autoConnect`      | `boolean`           | `true`   | 是否自动建立信令连接                                   |
| `polite`           | `boolean \| 'auto'` | `'auto'` | 协商冲突角色，`auto` 按 key 字典序自动决定             |
| `RTCConfiguration` | `RTCConfiguration`  | -        | 透传给 `RTCPeerConnection` 的原生配置（如 iceServers） |

#### 返回值

| 属性                         | 类型                          | 说明                       |
| ---------------------------- | ----------------------------- | -------------------------- |
| `id`                         | `Ref<string \| undefined>`    | 本端标识                   |
| `status`                     | `Ref<Status>`                 | 整体状态                   |
| `peers`                      | `ComputedRef<RtcPeerState[]>` | 全部对端状态               |
| `connected`                  | `ComputedRef<string[]>`       | 已连通的对端标识列表       |
| `connect(key, options?)`     | `Function`                    | 建立数据通道               |
| `connectStream(key, stream)` | `Function`                    | 建立媒体流连接             |
| `send(key, data)`            | `Function`                    | 向指定对端发送数据         |
| `broadcast(data)`            | `Function`                    | 向所有对端广播数据         |
| `close(key)`                 | `Function`                    | 关闭指定对端               |
| `destroy()`                  | `Function`                    | 销毁全部连接并关闭信令通道 |
| `onReady(callback)`          | `Function`                    | 信令注册完成               |
| `onChannel(callback)`        | `Function`                    | 数据通道就绪               |
| `onTrack(callback)`          | `Function`                    | 收到远端媒体流             |
| `onStateChange(callback)`    | `Function`                    | 对端连接状态变化           |
| `onError(callback)`          | `Function`                    | 连接过程中的错误           |

## 类型定义

```ts
type UseWebRTCOptions = RTCConfiguration & {
  protocols?: string[]
  transport?: RtcSignaling
  autoConnect?: boolean
  polite?: boolean | 'auto'
}

type Status = 'pending' | 'ready' | 'connected' | 'closed'

type RtcPeerStatus = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed'

type RtcPeerState = {
  key: string
  status: RtcPeerStatus
  polite: boolean
}

type RtcSignaling = {
  send: (message: RtcSignalMessage) => void
  onMessage: (handler: (message: RtcSignalMessage) => void) => () => void
  close: () => void
}

export declare function useWebRTC(
  url: MaybeRefOrGetter<string | URL>,
  options?: UseWebRTCOptions,
): UseWebRTCReturns
```

## 使用示例

### 基础用法（数据通道）

```vue
<script setup>
import { useWebRTC } from '@oiij/web-rtc'

const { id, status, peers, connect, onChannel } = useWebRTC('ws://localhost:4100/ws')

onChannel(({ key, channel }) => {
  channel.onmessage = (e) => {
    console.log(`收到 ${key} 的消息:`, e.data)
  }
})

function connectTo(targetId) {
  const channel = connect(targetId, { label: 'chat' })
  channel?.send('Hello!')
}
</script>

<template>
  <p>状态: {{ status }}</p>
  <p>ID: {{ id }}</p>
  <p>对端: {{ peers.map(peer => `${peer.key}:${peer.status}`).join(', ') }}</p>
  <button @click="connectTo('target-id')">
    连接
  </button>
</template>
```

### 媒体流（视频通话）

```vue
<script setup>
import { useWebRTC } from '@oiij/web-rtc'
import { ref } from 'vue'

const localVideo = ref()
const remoteVideo = ref()
const { connectStream, onTrack } = useWebRTC('ws://localhost:4100/ws')

onTrack(({ stream }) => {
  remoteVideo.value.srcObject = stream
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

### 自定义信令通道

```ts
import type { RtcSignalMessage } from '@oiij/web-rtc'
import { useWebRTC } from '@oiij/web-rtc'

const socket = new WebSocket('ws://localhost:4100/ws')
const handlers = new Set<(message: RtcSignalMessage) => void>()

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  handlers.forEach(handler => handler(message))
})

const { connect } = useWebRTC('ws://localhost:4100/ws', {
  transport: {
    send: message => socket.send(JSON.stringify(message)),
    onMessage(handler) {
      handlers.add(handler)
      return () => handlers.delete(handler)
    },
    close: () => socket.close(),
  },
})

connect('peer-1')
```
