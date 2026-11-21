# UseChatChannel

## 功能描述

**UseChatChannel** 是一个实时消息通道组合式函数，基于 WebSocket 提供连接管理、断线重连、心跳保活、离线队列、乐观更新与消息状态机。它封装了与 `@oiij/chat/server` 的协议交互，对外暴露响应式状态、消息操作方法与事件钩子，是构建即时通讯、协作编辑、实时通知等功能的基础单元。

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

<demo vue="./use-chat-channel.vue" title="UseChatChannel" />

## API

### `useChatChannel(options)`

连接一个实时消息通道，自动管理 WebSocket 生命周期。

#### 参数

| 参数      | 类型                    | 说明     |
| --------- | ----------------------- | -------- |
| `options` | `UseChatChannelOptions` | 配置选项 |

#### UseChatChannelOptions

| 选项                | 类型                | 默认值  | 说明                                                       |
| ------------------- | ------------------- | ------- | ---------------------------------------------------------- |
| `baseUrl`           | `string`            | —       | 服务端地址（http/https），自动推导为 ws/wss 地址（必填）   |
| `userId`            | `string`            | —       | 当前用户标识，拼接到握手地址（必填）                       |
| `channelId`         | `string`            | —       | 要订阅的通道标识（必填）                                   |
| `token`             | `string`            | —       | 握手令牌，透传到服务端 `onConnect` 钩子                    |
| `autoConnect`       | `boolean`           | `true`  | 创建时是否自动建立连接                                     |
| `heartbeatInterval` | `number`            | `25000` | 心跳发送间隔（毫秒）                                       |
| `reconnect`         | `boolean`           | `true`  | 断开后是否指数退避自动重连                                 |
| `offlineQueueKey`   | `string`            | —       | 离线队列 localStorage 键名，提供后刷新页面可恢复未送达消息 |
| `typingTimeout`     | `number`            | `4000`  | 他人「正在输入」状态的超时时间（毫秒）                     |
| `presign`           | `ChatUploadPresign` | —       | 预签名直传回调，提供后启用 `uploadFile` / `sendMedia`      |

#### 返回值

| 属性                         | 类型                                                        | 说明                                    |
| ---------------------------- | ----------------------------------------------------------- | --------------------------------------- |
| `messages`                   | `Ref<ChatMessage[]>`                                        | 当前通道的消息列表（响应式）            |
| `typingUsers`                | `Ref<string[]>`                                             | 正在输入的用户标识列表                  |
| `members`                    | `Ref<ChatUser[]>`                                           | 当前通道在线用户资料列表（含昵称/头像） |
| `connected`                  | `Ref<boolean>`                                              | 是否已连接                              |
| `error`                      | `Ref<Event \| null>`                                        | 最近一次连接错误                        |
| `channelId`                  | `Ref<string>`                                               | 当前订阅的通道标识                      |
| `send(input)`                | `(input) => string`                                         | 发送消息，返回客户端消息标识            |
| `sendMedia(file, options?)`  | `(file: File, options?: object) => Promise<string>`         | 上传并发送媒体消息，类型按 MIME 推导    |
| `uploadFile(file, options?)` | `(file: File, options?: object) => Promise<ChatAttachment>` | 预签名直传单个文件，返回附件描述        |
| `resend(id)`                 | `(id: string) => void`                                      | 重新发送指定消息（失败重试）            |
| `editMessage(id, content)`   | `(id: string, content: string) => void`                     | 编辑消息内容，广播给其他客户端          |
| `deleteMessage(id)`          | `(id: string) => void`                                      | 删除消息，广播给其他客户端              |
| `recallMessage(id)`          | `(id: string) => void`                                      | 撤回消息（仅发送者），保留占位广播      |
| `sendTyping()`               | `() => void`                                                | 发送「正在输入」通知，内置 2 秒节流     |
| `markRead(messageId?)`       | `(messageId?: string) => void`                              | 标记当前通道已读，可指定截止消息        |
| `search(query, limit?)`      | `(query: string, limit?: number) => Promise<ChatMessage[]>` | 按关键字检索通道消息，按时间倒序        |
| `join(channelId)`            | `(channelId: string) => void`                               | 切换并订阅另一个通道                    |
| `leave()`                    | `() => void`                                                | 取消订阅当前通道                        |
| `disconnect()`               | `() => void`                                                | 主动断开连接，停止心跳与重连            |
| `onMessage(cb)`              | `(cb) => () => void`                                        | 收到新消息事件                          |
| `onStatusChange(cb)`         | `(cb) => () => void`                                        | 消息状态变化事件                        |
| `onTyping(cb)`               | `(cb) => () => void`                                        | 收到他人输入中事件                      |
| `onRead(cb)`                 | `(cb) => () => void`                                        | 收到他人已读回执事件                    |
| `onMessageDeleted(cb)`       | `(cb) => () => void`                                        | 消息被删除事件                          |
| `onMessageRecalled(cb)`      | `(cb) => () => void`                                        | 消息被撤回事件                          |
| `onConnected(cb)`            | `(cb) => () => void`                                        | 连接建立事件                            |
| `onError(cb)`                | `(cb) => () => void`                                        | 连接错误事件                            |

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

export type ChatUser = {
  id: string
  name?: string
  avatar?: string
  metadata?: Record<string, unknown>
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
}

export type ChatSendInput = string | {
  content: string
  type?: ChatMessageType
  metadata?: Record<string, unknown>
  attachments?: ChatAttachment[]
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

export type UseChatChannelOptions = {
  baseUrl: string
  userId: string
  channelId: string
  token?: string
  autoConnect?: boolean
  heartbeatInterval?: number
  reconnect?: boolean
  offlineQueueKey?: string
  typingTimeout?: number
  presign?: ChatUploadPresign
}

export declare function useChatChannel(options: UseChatChannelOptions): UseChatChannelReturn
```

## 使用示例

### 基础收发

```vue
<script setup lang="ts">
import { useChatChannel } from '@oiij/chat'

const { messages, connected, send } = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
})
</script>
```

### 消息状态与事件

```ts
import { useChatChannel } from '@oiij/chat'

const { send, onMessage, onStatusChange, onError } = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
})

onMessage((message) => {
  console.log('收到消息:', message.senderId, message.content)
})

onStatusChange(({ id, status }) => {
  console.log('消息状态变化:', id, status)
})

onError((event) => {
  console.error('连接错误', event)
})

send('你好，世界')
```

### 输入中 / 已读 / 撤回

```ts
import { useChatChannel } from '@oiij/chat'

const {
  typingUsers,
  send,
  sendTyping,
  markRead,
  recallMessage,
} = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
  offlineQueueKey: '__CHAT_QUEUE__',
})

// 输入框内容变化时调用，内部自动节流
sendTyping()

// 进入会话或滚动到底部时标记已读
markRead()

// 撤回自己发送的消息
recallMessage('msg-1')

// typingUsers 为正在输入的用户标识列表，会按 typingTimeout 自动过期
console.log(typingUsers.value)
```

### 切换通道与已读

```ts
import { useChatChannel } from '@oiij/chat'

const { join, leave, markRead, deleteMessage, editMessage } = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
})

join('room-2')
markRead()
editMessage('msg-1', '更新后的内容')
deleteMessage('msg-1')
leave()
```

### 消息检索

```ts
import { useChatChannel } from '@oiij/chat'

const { search } = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
})

// 大小写不敏感，按创建时间倒序返回，不会改动本地消息列表
const hits = await search('发票', 20)
console.log(hits.map(message => message.content))
```

### 在线用户列表

```ts
import { useChatChannel } from '@oiij/chat'

const { members } = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
})

// 订阅、取消订阅与断线时，服务端会自动推送最新在线用户资料列表
console.log(members.value)
```

### 用户资料（昵称与头像）

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
const { members, messages } = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
})

// 在线用户：members 为 ChatUser[]，未配置时仅含 id
console.log(members.value.map(user => user.name ?? user.id))

// 消息发送者：sender 为发送时的资料快照，未配置时为 undefined
console.log(messages.value[0]?.sender?.avatar)
```

> 资料采用发送时快照语义，修改昵称或头像不会影响历史消息；需要显示最新资料时请结合业务的用户接口。

### 媒体消息（预签名直传）

文件不经过聊天服务：业务后端签发对象存储的预签名地址，客户端直传成功后把附件描述写入消息。

```ts
import { useChatChannel } from '@oiij/chat'

const { sendMedia, uploadFile, send } = useChatChannel({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channelId: 'room-1',
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
