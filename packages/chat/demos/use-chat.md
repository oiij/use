# UseChat

## 功能描述

**UseChat** 是统一的实时消息组合式函数，基于单条 WebSocket 连接管理一个或多个通道。它封装了连接管理、断线重连、心跳保活、离线队列、乐观更新、消息状态机、已读回执、输入状态、在线用户、@提及、引用回复与媒体上传，并统一维护各通道的消息、未读数与最后一条消息。

`useChat` 同时覆盖单通道页面与多会话布局：只传一个通道即为单通道用法，传入多个通道则自动获得未读数、切换与跨通道事件。

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

前端 composable 需要配合 `@oiij/chat/server` 提供的 WebSocket 服务。任选一种方式启动：

```bash
# 方式一：CLI 独立启动（默认端口 3000）
pnpm --filter @oiij/chat dev:server

# 方式二：Nitro 开发服务器
pnpm --filter @oiij/chat dev:nitro

# 自定义端口与数据目录
CHAT_PORT=4000 CHAT_DATA_DIR=./data pnpm --filter @oiij/chat dev:server
```

## 基本使用

<demo vue="./use-chat.vue" title="UseChat" />

## API

### `useChat(options)`

创建实时消息管理器，只建立一条 WebSocket 连接，可同时订阅多个通道。

#### 参数

| 参数      | 类型             | 说明     |
| --------- | ---------------- | -------- |
| `options` | `UseChatOptions` | 配置选项 |

#### UseChatOptions

| 选项                | 类型                          | 默认值  | 说明                                                       |
| ------------------- | ----------------------------- | ------- | ---------------------------------------------------------- |
| `baseUrl`           | `string`                      | —       | 服务端地址（http/https），自动推导为 ws/wss 地址（必填）   |
| `userId`            | `string`                      | —       | 当前用户标识，拼接到握手地址（必填）                       |
| `profile`           | `ChatUser`                    | —       | 当前用户资料，用于本地乐观消息显示昵称与头像               |
| `channels`          | `(string \| ChatRoomInput)[]` | `[]`    | 初始订阅的通道列表，可通过 `join` 动态新增                 |
| `token`             | `string`                      | —       | 握手令牌，透传到服务端 `onConnect` 钩子                    |
| `autoConnect`       | `boolean`                     | `true`  | 创建时是否自动建立连接                                     |
| `heartbeatInterval` | `number`                      | `25000` | 心跳发送间隔（毫秒）                                       |
| `reconnect`         | `boolean`                     | `true`  | 断开后是否指数退避自动重连                                 |
| `offlineQueueKey`   | `string`                      | —       | 离线队列 localStorage 键名，提供后刷新页面可恢复未送达消息 |
| `typingTimeout`     | `number`                      | `4000`  | 他人「正在输入」状态的超时时间（毫秒）                     |
| `presign`           | `ChatUploadPresign`           | —       | 预签名直传回调，提供后启用 `uploadFile` / `sendMedia`      |

#### 返回值

| 属性                                   | 类型                                                        | 说明                                     |
| -------------------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| `rooms`                                | `Ref<ChatRoomState[]>`                                      | 全部通道状态                             |
| `activeId`                             | `Ref<string>`                                               | 当前激活通道标识                         |
| `activeRoom`                           | `ComputedRef<ChatRoomState \| undefined>`                   | 当前激活通道                             |
| `activeMessages`                       | `ComputedRef<ChatMessage[]>`                                | 当前激活通道的消息列表                   |
| `unreadTotal`                          | `ComputedRef<number>`                                       | 全部通道未读总数                         |
| `connected`                            | `Ref<boolean>`                                              | 是否已连接                               |
| `error`                                | `Ref<Event \| null>`                                        | 最近一次连接错误                         |
| `availability`                         | `Ref<ChatAvailability>`                                     | 当前用户可用状态                         |
| `statusText`                           | `Ref<string \| undefined>`                                  | 当前用户状态补充说明                     |
| `send(input, channelId?)`              | `(input, channelId?) => string`                             | 发送消息，可携带 `mentions` 与 `quoteId` |
| `sendMedia(file, options?)`            | `(file: File, options?: object) => Promise<string>`         | 上传并发送媒体消息，支持 @ 与引用        |
| `uploadFile(file, options?)`           | `(file: File, options?: object) => Promise<ChatAttachment>` | 预签名直传单个文件，返回附件描述         |
| `resend(id, channelId?)`               | `(id: string, channelId?: string) => void`                  | 重新发送指定消息（失败重试）             |
| `switchTo(channelId)`                  | `(channelId: string) => void`                               | 切换激活通道并清零未读                   |
| `markRead(channelId?, messageId?)`     | `(channelId?: string, messageId?: string) => void`          | 标记通道已读，可指定截止消息             |
| `search(channelId, query, limit?)`     | `(channelId, query, limit?) => Promise<ChatMessage[]>`      | 按关键字检索通道消息，按时间倒序         |
| `sendTyping(channelId?)`               | `(channelId?: string) => void`                              | 发送「正在输入」通知，按通道 2 秒节流    |
| `setAvailability(value, text?)`        | `(value: ChatAvailability, text?: string) => void`          | 设置在线、忙碌或离开状态并广播           |
| `recallMessage(id, channelId?)`        | `(id: string, channelId?: string) => void`                  | 撤回消息（仅发送者），保留占位广播       |
| `editMessage(id, content, channelId?)` | `(id: string, content: string, channelId?: string) => void` | 编辑消息内容，广播给其他客户端           |
| `deleteMessage(id, channelId?)`        | `(id: string, channelId?: string) => void`                  | 删除消息，广播给其他客户端               |
| `join(input)`                          | `(input: ChatRoomInput) => void`                            | 新增并订阅通道                           |
| `leave(channelId)`                     | `(channelId: string) => void`                               | 取消订阅并移除通道                       |
| `disconnect()`                         | `() => void`                                                | 主动断开连接，停止心跳与重连             |
| `onMessage(cb)`                        | `(cb) => () => void`                                        | 新消息事件，参数含 `channelId`           |
| `onStatusChange(cb)`                   | `(cb) => () => void`                                        | 消息状态变化事件，参数含 `channelId`     |
| `onTyping(cb)`                         | `(cb) => () => void`                                        | 收到他人输入中事件                       |
| `onRead(cb)`                           | `(cb) => () => void`                                        | 收到他人已读回执事件                     |
| `onMessageDeleted(cb)`                 | `(cb) => () => void`                                        | 消息被删除事件                           |
| `onMessageRecalled(cb)`                | `(cb) => () => void`                                        | 消息被撤回事件                           |
| `onMention(cb)`                        | `(cb) => () => void`                                        | 收到 @我的消息事件，参数含 `channelId`   |
| `onConnected(cb)`                      | `(cb) => () => void`                                        | 连接建立事件                             |
| `onError(cb)`                          | `(cb) => () => void`                                        | 连接错误事件                             |

## 类型定义

```ts
export type ChatMessageType = 'text' | 'system' | (string & {})

export type ChatMessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export type ChatAttachment = {
  id: string
  url: string
  mimeType: string
  size: number
  name?: string
  width?: number
  height?: number
  duration?: number
  thumbnailUrl?: string
}

export type ChatAvailability = 'online' | 'busy' | 'away'

export type ChatUser = {
  id: string
  name?: string
  avatar?: string
  availability?: ChatAvailability
  statusText?: string
  metadata?: Record<string, unknown>
}

export type ChatMention = {
  id: string
  name?: string
}

export type ChatQuotedMessage = {
  id: string
  senderId: string
  senderName?: string
  content: string
  type: ChatMessageType
  createdAt: number
  recalled?: boolean
}

export type ChatMessage = {
  id: string
  channelId: string
  senderId: string
  sender?: ChatUser
  content: string
  type: ChatMessageType
  status: ChatMessageStatus
  createdAt: number
  metadata?: Record<string, unknown>
  readBy?: string[]
  recalled?: boolean
  attachments?: ChatAttachment[]
  mentions?: ChatMention[]
  quote?: ChatQuotedMessage
}

export type ChatSendInput = string | {
  content: string
  type?: ChatMessageType
  metadata?: Record<string, unknown>
  attachments?: ChatAttachment[]
  mentions?: string[]
  quoteId?: string
}

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

export type ChatUploadTarget = {
  url: string
  publicUrl: string
  method?: 'PUT' | 'POST'
  headers?: Record<string, string>
  fields?: Record<string, string>
  attachment?: Partial<ChatAttachment>
}

export type ChatUploadPresign = (file: File) => ChatUploadTarget | Promise<ChatUploadTarget>

export type UseChatOptions = {
  baseUrl: string
  userId: string
  profile?: ChatUser
  channels?: ChatRoomInput[]
  token?: string
  autoConnect?: boolean
  heartbeatInterval?: number
  reconnect?: boolean
  offlineQueueKey?: string
  typingTimeout?: number
  presign?: ChatUploadPresign
}

export declare function useChat(options: UseChatOptions): UseChatReturn
```

## 使用示例

### 单通道收发

```ts
import { useChat } from '@oiij/chat'

const {
  activeMessages,
  activeRoom,
  connected,
  send,
  sendTyping,
  markRead,
} = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['room-1'],
})

send('你好，世界')

// 激活通道的输入状态与在线用户
console.log(activeRoom.value?.typingUsers)
console.log(activeRoom.value?.members)
```

### 多通道会话列表与未读

```vue
<script setup lang="ts">
import { useChat } from '@oiij/chat'

const { rooms, activeId, activeMessages, unreadTotal, switchTo, send } = useChat({
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

### 消息状态与事件

```ts
import { useChat } from '@oiij/chat'

const { send, onMessage, onStatusChange, onRead, onError } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['room-1'],
})

onMessage(({ channelId, message }) => {
  console.log(`[${channelId}] 收到消息:`, message.senderId, message.content)
})

onStatusChange(({ channelId, id, status }) => {
  console.log('消息状态变化:', channelId, id, status)
})

onRead(({ channelId, userId, messageIds }) => {
  console.log(`${userId} 在 ${channelId} 已读:`, messageIds)
})

onError((event) => {
  console.error('连接错误', event)
})

send('你好，世界')
```

### 输入中 / 已读 / 撤回 / 重发

```ts
import { useChat } from '@oiij/chat'

const {
  send,
  sendTyping,
  markRead,
  recallMessage,
  resend,
  onStatusChange,
} = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['room-1'],
  offlineQueueKey: '__CHAT_QUEUE__',
})

// 输入框内容变化时调用，内部自动节流
sendTyping()

// 进入会话或滚动到底部时标记已读
markRead()

// 撤回自己发送的消息
recallMessage('msg-1')

// 发送失败时重试
onStatusChange(({ id, status }) => {
  if (status === 'failed') {
    resend(id)
  }
})
```

### 动态增删通道

```ts
import { useChat } from '@oiij/chat'

const { join, leave, switchTo } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['lobby'],
})

join({ id: 'support', name: '客服支持' })
switchTo('support')
leave('lobby')
```

### 消息检索

```ts
import { useChat } from '@oiij/chat'

const { search } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['lobby', 'tech'],
})

// 大小写不敏感，按创建时间倒序返回，不会改动本地消息列表
const hits = await search('tech', '部署', 20)
console.log(hits.map(message => message.content))
```

### @提及与引用回复

发送时通过 `mentions` 传入被 @ 的用户标识，通过 `quoteId` 引用回复已有消息：

```ts
import { useChat } from '@oiij/chat'

const { activeRoom, send, sendMedia, onMention } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['room-1'],
})

// 普通文本消息：@ 两个用户并引用 msg-1
send({
  content: '@张三 @李四 看下这个方案',
  mentions: ['user-2', 'user-3'],
  quoteId: 'msg-1',
})

// 媒体消息同样支持 @ 与引用
await sendMedia(file, { content: '看这张图', mentions: ['user-2'], quoteId: 'msg-1' })

// 收到别人 @ 我的消息时触发
const off = onMention(({ channelId, message }) => {
  console.log(`${message.senderId} 在 ${channelId} @ 了我：${message.content}`)
})
```

- 服务端会把 `mentions` 解析为 `{ id, name? }` 快照写入 `message.mentions`
- 服务端会按 `quoteId` 生成 `message.quote` 快照（`id`、`senderId`、`senderName`、`content`、`type`、`createdAt`、`recalled`）
- 引用采用发送时快照语义：原消息之后被编辑或撤回不会改写已发出的引用内容
- `mentionCandidates` 可基于 `activeRoom.value?.members` 渲染 @ 候选列表（仅包含在线用户）

### 在线用户与用户资料

服务端配置 `getUserProfile` 后，在线用户列表与消息快照自动携带昵称和头像：

```ts
import { createChatServer } from '@oiij/chat/server'

const { app } = createChatServer({
  getUserProfile: async (userId) => {
    const user = await db.users.find(userId)
    return user ? { id: user.id, name: user.nickname, avatar: user.avatarUrl } : undefined
  },
})
```

```ts
const { activeRoom, activeMessages } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['room-1'],
})

// 在线用户：members 为 ChatUser[]，未配置时仅含 id
console.log(activeRoom.value?.members.map(user => user.name ?? user.id))

// 消息发送者：sender 为发送时的资料快照，未配置时为 undefined
console.log(activeMessages.value[0]?.sender?.avatar)
```

> 资料采用发送时快照语义，修改昵称或头像不会影响历史消息；需要显示最新资料时请结合业务的用户接口。

### 用户可用状态

`availability` 表示用户主动设置的 `online` / `busy` / `away`，是否仍在线则由 `members` 中是否存在该用户决定：

```ts
import { useChat } from '@oiij/chat'

const {
  activeRoom,
  availability,
  statusText,
  setAvailability,
} = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  profile: {
    id: 'user-1',
    name: '张三',
    availability: 'online',
  },
  channels: ['room-1'],
})

// 同通道成员会收到最新 presence，消息 sender 也会保存发送时的状态快照
setAvailability('busy', '会议中')
setAvailability('away', '暂时离开')
setAvailability('online')

console.log(availability.value, statusText.value)
console.log(activeRoom.value?.members.map(user => ({
  name: user.name ?? user.id,
  availability: user.availability,
  statusText: user.statusText,
})))
```

离线时调用只会更新本地状态，连接建立或重连后自动同步。状态默认保存在 `ChatBus` 内存中，需要跨重启恢复或多实例共享时，应通过业务存储与 `getUserProfile` 提供默认状态。

### 媒体消息（预签名直传）

文件不经过聊天服务：业务后端签发对象存储的预签名地址，客户端直传成功后把附件描述写入消息。

```ts
import { useChat } from '@oiij/chat'

const { sendMedia, uploadFile, send } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['room-1'],
  presign: async (file) => {
    const response = await fetch('/api/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, type: file.type }),
    })
    // { url: '预签名直传地址', publicUrl: '上传后的可访问地址', headers?, fields?, method? }
    return response.json()
  },
})

// 上传并发送，消息类型按 MIME 自动推导为 image / video / audio / file
await sendMedia(file, { onProgress: percent => console.log(`上传进度 ${percent}%`) })

// 也可先上传，再自行组装媒体消息
const attachment = await uploadFile(file)
send({ content: '看这张图', type: 'image', attachments: [attachment] })

// 多通道场景可指定目标通道
await sendMedia(file, { channelId: 'tech', content: '看这个设计稿' })
```

> `presign` 返回的 `publicUrl` 必须是长期可访问的地址，不要使用带签名的临时直传地址。离线队列只保存附件描述，因此上传成功后再调用 `send`。

服务端可用 `onAttachment` 校验附件来源：

```ts
const { app } = createChatServer({
  onAttachment: ({ attachment, userId, channelId }) => {
    return attachment.url.startsWith('https://cdn.example.com/')
  },
})
```

## 后端嵌入

`createChatServer` 返回可编程的 h3 应用，可嵌入任意 Node 服务：

```ts
import { createChatServer, JsonFileStorage } from '@oiij/chat/server'

const { app } = createChatServer({
  storage: new JsonFileStorage('./data'),
  // 同时作用于 WebSocket 握手与 REST 接口，返回 false 即拒绝
  onConnect: ({ userId, token, request }) => {
    return Boolean(userId) && token !== 'blocked'
  },
  onMessage: (ctx, message) => {
    console.log(`${ctx.userId} 在 ${ctx.channelId} 发送:`, message.content)
    return message
  },
})

// app 是一个标准 h3 应用，可交给 listhen / Nitro / 自定义 http server
```

### 鉴权约定

- 请求头：`x-chat-user`、`x-chat-token`
- 查询参数：`userId`、`token`
- REST 鉴权通过后可用 `getChatUserId(event)` 读取当前用户

### SQLite 存储

```ts
import { createChatServer } from '@oiij/chat/server'
import { SqliteStorage } from '@oiij/chat/server/sqlite'

const { app, bus } = createChatServer({
  storage: new SqliteStorage('./data'), // 目录或 .db 文件路径
})
```

> SQLite 适配器依赖 Node 内置 `node:sqlite`（Node >= 22.5），因此单独提供子入口，未使用该能力时不会加载。

### 多实例广播

默认广播只在当前进程内生效。多实例部署时传入 `broadcaster`，通过 Redis Pub/Sub 把消息扩散到其他实例：

```ts
import { createChatServer, createRedisBroadcaster } from '@oiij/chat/server'
import { SqliteStorage } from '@oiij/chat/server/sqlite'
import Redis from 'ioredis'

const { app, bus } = createChatServer({
  storage: new SqliteStorage('./data'),
  broadcaster: createRedisBroadcaster({
    publisher: new Redis(),
    subscriber: new Redis(), // 订阅连接需与发布连接分开
    prefix: 'myapp:chat',
  }),
})

// 进程退出时释放订阅连接
process.on('SIGTERM', () => void bus.close())
```

> 适配器按通道懒订阅，实例收到自身发布的消息会自动丢弃，避免与本地投递重复。

### 消息检索接口

开启 `onConnect` 鉴权后，检索接口同样需要携带身份信息：

```bash
curl "http://localhost:3000/channels/room-1/messages/search?q=发票&limit=20" \
  -H "x-chat-user: user-1" \
  -H "x-chat-token: <token>"
```

返回 `{ messages: ChatMessage[], hasMore: boolean }`，消息按创建时间倒序。

### 自定义路由鉴权

```ts
import { createChatAuthMiddleware, getChatUserId } from '@oiij/chat/server'

const guard = createChatAuthMiddleware(({ userId }) => userId !== 'banned')

app.use('/admin/**', guard)
app.get('/admin/me', defineEventHandler(event => ({ userId: getChatUserId(event) })))
```
