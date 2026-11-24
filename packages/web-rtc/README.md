# @oiij/web-rtc

[![NPM version](https://img.shields.io/npm/v/@oiij/web-rtc)](https://www.npmjs.com/package/@oiij/web-rtc)
[![MIT-license](https://img.shields.io/npm/l/@oiij/web-rtc)](https://github.com/oiij/use/blob/main/packages/web-rtc/LICENSE)

## 简介

WebRTC 实时通信的 Vue 3 组合式函数封装，同时内置基于 h3 / crossws 的信令服务器，可在视频通话、语音通话与实时数据共享场景中快速搭建点对点连接。

## 特点

### 📡 多对端通信

- 🔗 为每个对端维护独立的 `RTCPeerConnection`
- 📦 支持数据通道、媒体流与 ICE 候选缓存
- 🤝 支持完美协商（perfect negotiation），按 key 字典序自动决定冲突角色

### 🖥️ 内置信令服务

- 🚀 通过 `@oiij/web-rtc/server` 引入 h3 应用与 WebSocket 钩子
- ⌨️ 提供 `web-rtc-server` 命令行，开箱即用
- 🔍 内置 `/health`、`/peers` 查询接口，支持自定义标识生成与负载限制

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 信令消息、对端状态均有类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

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

- `vue`: ^3.5.0
- `@vueuse/core`: ^14.0.0

## 信令服务

客户端与服务端同属 `@oiij/web-rtc`，服务端通过子路径引入：

```ts
import { createRtcServer, createWsHooks } from '@oiij/web-rtc/server'
import { toNodeHandler } from 'h3/node'
import { listen } from 'listhen'

const { app, hub } = createRtcServer({ path: '/ws' })

await listen(toNodeHandler(app), {
  port: 4100,
  ws: { hooks: createWsHooks(hub) },
})
```

也可以直接使用内置 CLI：

```bash
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

## 示例

### 数据通道

```vue
<script setup>
import { useWebRTC } from '@oiij/web-rtc'

const { id, status, peers, connect, onChannel } = useWebRTC('ws://localhost:4100/ws')

onChannel(({ key, channel }) => {
  channel.onmessage = (event) => {
    console.log(`收到 ${key} 的消息:`, event.data)
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
  <button @click="connectTo('peer-1')">
    连接
  </button>
</template>
```

### 媒体流（视频通话）

```vue
<script setup>
import { useWebRTC } from '@oiij/web-rtc'
import { useTemplateRef } from 'vue'

const localVideo = useTemplateRef('localVideo')
const remoteVideo = useTemplateRef('remoteVideo')

const { connectStream, onTrack } = useWebRTC('ws://localhost:4100/ws', {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
})

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
  <button @click="startCall('peer-1')">
    开始通话
  </button>
</template>
```

### 消息收发

```ts
import { useWebRTC } from '@oiij/web-rtc'

const { send, broadcast, close } = useWebRTC('ws://localhost:4100/ws')

send('peer-1', 'hello')
broadcast('hello everyone')
close('peer-1')
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
| `status`                     | `ComputedRef<RtcStatus>`      | 整体状态                   |
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

### `createRtcServer(options?)`

创建信令服务 h3 应用，返回 `{ app, hub }`。

| 选项             | 类型           | 默认值    | 说明                   |
| ---------------- | -------------- | --------- | ---------------------- |
| `path`           | `string`       | `'/ws'`   | WebSocket 挂载路径     |
| `keyGenerator`   | `() => string` | 8 位短 id | 自定义标识生成函数     |
| `maxPayloadSize` | `number`       | `65536`   | 单条信令消息最大字节数 |

### `createWsHooks(hub)`

为已有 h3/listhen 服务构建信令 WebSocket 生命周期钩子。

### `RtcHub`

信令中心，维护在线客户端并根据目标转发信令。

| 成员                   | 类型                     | 说明                       |
| ---------------------- | ------------------------ | -------------------------- |
| `size`                 | `number`                 | 当前在线连接数             |
| `keys()`               | `() => string[]`         | 列出全部在线标识           |
| `register(peer, key?)` | `(peer, key?) => string` | 注册连接并下发分配到的标识 |
| `unregister(peer)`     | `(peer) => void`         | 注销连接并广播 `bye`       |
| `dispatch(peer, raw)`  | `(peer, raw) => void`    | 校验并转发一条原始信令消息 |

## 类型定义

```ts
type UseWebRTCOptions = RTCConfiguration & {
  protocols?: string[]
  transport?: RtcSignaling
  autoConnect?: boolean
  polite?: boolean | 'auto'
}

type RtcStatus = 'pending' | 'ready' | 'connected' | 'closed'

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

type RtcServerOptions = {
  path?: string
  keyGenerator?: () => string
  maxPayloadSize?: number
}

export declare function useWebRTC(
  url: MaybeRefOrGetter<string | URL>,
  options?: UseWebRTCOptions,
): UseWebRTCReturns
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/web-rtc/use-web-rtc)
