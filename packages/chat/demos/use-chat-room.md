# UseChatRoom

## 功能描述

**UseChatRoom** 是多通道消息管理组合式函数。它复用单条 WebSocket 连接同时订阅多个通道，统一维护各通道的消息列表、未读数、最后一条消息与「正在输入」状态，适合侧边栏会话列表、工作台通知中心等多会话场景。

与 `UseChatChannel` 相比：`UseChatChannel` 面向单通道页面，`UseChatRoom` 面向需要同时感知多个通道的布局。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/chat

# 使用 npm
npm install @oiij/chat

# 使用 yarn
yarn add @oiij/chat
```

## 依赖

- `vue`: ^3.5.0
- `@vueuse/core`: ^14.0.0

## 启动后端

```bash
pnpm --filter @oiij/chat dev:server
```

## 基本使用

<demo vue="./use-chat-room.vue" title="UseChatRoom" />

## API

### `useChatRoom(options)`

创建多通道消息管理器，只建立一条 WebSocket 连接。

#### 参数

| 参数      | 类型                 | 说明     |
| --------- | -------------------- | -------- |
| `options` | `UseChatRoomOptions` | 配置选项 |

#### UseChatRoomOptions

| 选项                | 类型                          | 默认值  | 说明                         |
| ------------------- | ----------------------------- | ------- | ---------------------------- |
| `baseUrl`           | `string`                      | —       | 服务端地址（必填）           |
| `userId`            | `string`                      | —       | 当前用户标识（必填）         |
| `channels`          | `(string \| ChatRoomInput)[]` | —       | 初始订阅的通道列表（必填）   |
| `token`             | `string`                      | —       | 握手令牌                     |
| `autoConnect`       | `boolean`                     | `true`  | 创建时是否自动连接           |
| `heartbeatInterval` | `number`                      | `25000` | 心跳间隔（毫秒）             |
| `reconnect`         | `boolean`                     | `true`  | 断开后是否自动重连           |
| `offlineQueueKey`   | `string`                      | —       | 离线队列 localStorage 键名   |
| `typingTimeout`     | `number`                      | `4000`  | 输入中状态超时（毫秒）       |
| `presign`           | `ChatUploadPresign`           | —       | 预签名直传回调，启用媒体上传 |

#### 返回值

| 属性                                   | 类型                                                        | 说明                           |
| -------------------------------------- | ----------------------------------------------------------- | ------------------------------ |
| `rooms`                                | `Ref<ChatRoomState[]>`                                      | 全部通道状态                   |
| `activeId`                             | `Ref<string>`                                               | 当前激活通道标识               |
| `activeRoom`                           | `ComputedRef<ChatRoomState \| undefined>`                   | 当前激活通道                   |
| `activeMessages`                       | `ComputedRef<ChatMessage[]>`                                | 当前激活通道的消息列表         |
| `unreadTotal`                          | `ComputedRef<number>`                                       | 全部通道未读总数               |
| `rooms[].members`                      | `ChatUser[]`                                                | 各通道在线用户资料列表         |
| `connected`                            | `Ref<boolean>`                                              | 是否已连接                     |
| `error`                                | `Ref<Event \| null>`                                        | 最近一次连接错误               |
| `send(input, channelId?)`              | `(input, channelId?) => string`                             | 发送消息，默认发往激活通道     |
| `sendMedia(file, options?)`            | `(file: File, options?: object) => Promise<string>`         | 上传并发送媒体消息             |
| `uploadFile(file, options?)`           | `(file: File, options?: object) => Promise<ChatAttachment>` | 预签名直传单个文件             |
| `switchTo(channelId)`                  | `(channelId: string) => void`                               | 切换激活通道并清零未读         |
| `markRead(channelId?, messageId?)`     | `Function`                                                  | 标记通道已读                   |
| `search(channelId, query, limit?)`     | `(channelId, query, limit?) => Promise<ChatMessage[]>`      | 按关键字检索指定通道消息       |
| `sendTyping(channelId?)`               | `(channelId?: string) => void`                              | 发送正在输入通知（按通道节流） |
| `recallMessage(id, channelId?)`        | `(id: string, channelId?: string) => void`                  | 撤回消息                       |
| `editMessage(id, content, channelId?)` | `Function`                                                  | 编辑消息内容                   |
| `deleteMessage(id, channelId?)`        | `Function`                                                  | 删除消息                       |
| `join(input)`                          | `(input: ChatRoomInput) => void`                            | 新增并订阅通道                 |
| `leave(channelId)`                     | `(channelId: string) => void`                               | 取消订阅并移除通道             |
| `disconnect()`                         | `() => void`                                                | 主动断开连接                   |
| `onMessage(cb)`                        | `(cb) => () => void`                                        | 新消息事件，参数含 `channelId` |
| `onConnected(cb)`                      | `(cb) => () => void`                                        | 连接建立事件                   |
| `onError(cb)`                          | `(cb) => () => void`                                        | 连接错误事件                   |

## 类型定义

```ts
export type ChatRoomInput = string | { id: string, name?: string }

export type ChatRoomState = {
  id: string
  name: string
  messages: ChatMessage[]
  unread: number
  typingUsers: string[]
  members: ChatUser[]
  lastMessage?: ChatMessage
}

export type UseChatRoomOptions = {
  baseUrl: string
  userId: string
  channels: ChatRoomInput[]
  token?: string
  autoConnect?: boolean
  heartbeatInterval?: number
  reconnect?: boolean
  offlineQueueKey?: string
  typingTimeout?: number
  presign?: ChatUploadPresign
}

export declare function useChatRoom(options: UseChatRoomOptions): UseChatRoomReturn
```

## 使用示例

### 会话列表与未读

```vue
<script setup lang="ts">
import { useChatRoom } from '@oiij/chat'

const { rooms, activeId, activeMessages, unreadTotal, switchTo, send } = useChatRoom({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: [
    { id: 'lobby', name: '大厅' },
    { id: 'tech', name: '技术讨论' },
  ],
})
</script>

<template>
  <button
    v-for="room in rooms"
    :key="room.id"
    :class="{ active: room.id === activeId }"
    @click="switchTo(room.id)"
  >
    {{ room.name }}
    <span v-if="room.unread">{{ room.unread }}</span>
  </button>
  <div v-for="message in activeMessages" :key="message.id">
    {{ message.senderId }}：{{ message.content }}
  </div>
  <p>总未读：{{ unreadTotal }}</p>
  <button @click="send('大家好')">
    发送
  </button>
</template>
```

### 动态增删通道

```ts
import { useChatRoom } from '@oiij/chat'

const { join, leave } = useChatRoom({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['lobby'],
})

join({ id: 'support', name: '客服支持' })
leave('lobby')
```

### 跨通道事件监听

```ts
import { useChatRoom } from '@oiij/chat'

const { onMessage } = useChatRoom({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['lobby', 'tech'],
})

onMessage(({ channelId, message }) => {
  console.log(`[${channelId}] ${message.senderId}: ${message.content}`)
})
```

### 消息检索

```ts
import { useChatRoom } from '@oiij/chat'

const { search } = useChatRoom({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['lobby', 'tech'],
})

// 检索结果不会改动本地消息列表
const hits = await search('tech', '部署', 20)
```

### 媒体消息

```ts
import { useChatRoom } from '@oiij/chat'

const { sendMedia, send } = useChatRoom({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['lobby', 'tech'],
  presign: async (file) => {
    const response = await fetch('/api/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, type: file.type }),
    })
    return response.json()
  },
})

// 上传并发送到指定通道，消息类型按 MIME 自动推导
await sendMedia(file, {
  channelId: 'tech',
  content: '看这个设计稿',
  onProgress: percent => console.log(`上传进度 ${percent}%`),
})
```

> `presign` 返回的 `publicUrl` 需是长期可访问地址；离线队列只保存附件描述，上传成功后再调用 `send`。
