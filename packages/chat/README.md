# @oiij/chat

[![NPM version](https://img.shields.io/npm/v/@oiij/chat)](https://www.npmjs.com/package/@oiij/chat)
[![MIT-license](https://img.shields.io/npm/l/@oiij/chat)](https://github.com/oiij/use/blob/main/LICENSE)

一套开箱即用的全栈消息系统：Vue 3 组合式函数前端 + 基于 h3 与 crossws 的 Node 后端。前端负责连接管理与状态机，后端负责通道、消息持久化与广播，二者共享同一套协议类型。

## 特点

- **前后端一体**：`useChat` 与 `createChatServer` 共用协议类型，接入即用
- **连接可靠**：断线指数退避重连、心跳保活、离线发送队列（可持久化到 localStorage）
- **消息能力完整**：乐观更新、发送状态、已读回执、编辑、删除、撤回、输入中提示
- **@提及与引用**：发送时可 @ 多个用户并引用回复历史消息，服务端生成昵称与引用快照
- **媒体消息**：图片、视频、音频与文件通过预签名直传对象存储，消息只携带附件引用
- **用户资料**：服务端统一注入昵称与头像，在线用户列表与消息快照自动携带
- **用户状态**：支持在线、忙碌、离开与自定义状态说明，切换后实时同步通道成员
- **在线用户列表**：订阅、取消订阅与断线时自动同步通道内在线用户
- **多通道复用**：`useChat` 用一条 WebSocket 连接同时订阅多个通道，维护未读数
- **存储可插拔**：内置内存、JSON 文件、SQLite 三种适配器，也可自定义实现
- **支持多实例**：通过 `broadcaster` 接入 Redis Pub/Sub，实现跨进程广播
- **消息检索**：通道内按关键字检索，存储层支持时下推查询
- **鉴权内建**：WebSocket 握手与 REST 接口共用 `onConnect` 钩子

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/chat

# 使用 npm
npm install @oiij/chat

# 使用 yarn
yarn add @oiij/chat
```

前端要求 `vue` >= 3.5 与 `@vueuse/core` >= 14。

## 快速开始

### 1. 启动后端

```bash
# 仓库内开发（默认端口 3000）
pnpm --filter @oiij/chat dev:server

# 自定义端口与数据目录
CHAT_PORT=4000 CHAT_DATA_DIR=./data pnpm --filter @oiij/chat dev:server
```

也可以把服务嵌入任意 Node 应用：

```ts
import { createChatServer, JsonFileStorage } from '@oiij/chat/server'

const { app, bus } = createChatServer({
  storage: new JsonFileStorage('./data'),
})

export { app }
```

`app` 是标准 h3 应用，可交给 listhen、Nitro 或自定义 HTTP Server；`bus` 是消息总线，可调用 `bus.close()` 释放资源。

### 2. 前端连接

单通道场景：

```ts
import { useChat } from '@oiij/chat'

const { activeMessages, activeRoom, connected, send, sendTyping, markRead } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['room-1'],
})

send('你好，世界')
```

多通道会话列表：

```ts
import { useChat } from '@oiij/chat'

const { rooms, activeId, activeMessages, unreadTotal, switchTo, send } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: [
    { id: 'lobby', name: '大厅' },
    { id: 'tech', name: '技术讨论' },
  ],
})

switchTo('tech')
send('大家好')
```

## API 概览

### `useChat(options)`

统一的实时消息组合式函数：单条连接管理一个或多个通道，负责连接、重连、心跳、离线队列与消息状态。

| 选项                | 类型                          | 默认值  | 说明                         |
| ------------------- | ----------------------------- | ------- | ---------------------------- |
| `baseUrl`           | `string`                      | —       | 服务端地址（必填）           |
| `userId`            | `string`                      | —       | 当前用户标识（必填）         |
| `profile`           | `ChatUser`                    | —       | 当前用户资料，用于乐观消息   |
| `channels`          | `(string \| ChatRoomInput)[]` | `[]`    | 初始订阅的通道列表           |
| `token`             | `string`                      | —       | 握手令牌                     |
| `autoConnect`       | `boolean`                     | `true`  | 创建时是否自动连接           |
| `heartbeatInterval` | `number`                      | `25000` | 心跳间隔（毫秒）             |
| `reconnect`         | `boolean`                     | `true`  | 断开后是否自动重连           |
| `offlineQueueKey`   | `string`                      | —       | 离线队列 localStorage 键名   |
| `typingTimeout`     | `number`                      | `4000`  | 输入中状态超时（毫秒）       |
| `presign`           | `function`                    | —       | 预签名直传回调，启用媒体上传 |

返回 `rooms`、`activeId`、`activeRoom`、`activeMessages`、`unreadTotal`、`connected`、`error`、`availability`、`statusText` 等响应式状态，以及 `send`、`sendMedia`、`uploadFile`、`resend`、`switchTo`、`markRead`、`search`、`sendTyping`、`setAvailability`、`recallMessage`、`editMessage`、`deleteMessage`、`join`、`leave`、`disconnect` 方法与 `onMessage`、`onStatusChange`、`onTyping`、`onRead`、`onMessageDeleted`、`onMessageRecalled`、`onMention`、`onConnected`、`onError` 事件钩子。每个通道状态包含在线用户 `members`（`ChatUser[]`）。

`send` 的 `ChatSendInput` 支持 `mentions`（被 @ 的用户标识数组）与 `quoteId`（被引用消息标识），服务端会解析为 `message.mentions` 与 `message.quote` 快照；`sendMedia` 的 `options` 同样支持这两个字段。

```ts
send({ content: '@张三 看下这条', mentions: ['user-2'], quoteId: 'msg-1' })

onMention(({ channelId, message }) => {
  console.log(`${message.senderId} 在 ${channelId} @ 了我`)
})
```

### 消息检索

```ts
import { useChat } from '@oiij/chat'

const { search } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  channels: ['tech'],
})

// 第一个参数为通道标识，结果不会改动本地消息列表
const hits = await search('tech', '部署', 20)
```

对应 REST 接口：

```http
GET /channels/:id/messages/search?q=发票&limit=20
```

返回 `{ messages: ChatMessage[], hasMore: boolean }`，消息按创建时间倒序，大小写不敏感。

### 用户资料（昵称与头像）

在线用户列表和消息发送者资料由服务端 `getUserProfile` 统一注入，客户端不需要自己拼装：

```ts
import { createChatServer } from '@oiij/chat/server'

const { app } = createChatServer({
  getUserProfile: async (userId) => {
    const user = await db.users.find(userId)
    return user ? { id: user.id, name: user.nickname, avatar: user.avatarUrl } : undefined
  },
})
```

- 订阅、退出、断线时，presence 下发 `ChatUser[]`（`id`、`name`、`avatar`）
- 发送消息时，服务端把当时的资料写入 `message.sender` 快照，历史消息不依赖实时资料
- 未配置钩子时仅下发 `{ id }`；资料变更后历史消息保留发送时的昵称与头像
- 钩子会在每次在线列表变化和发送消息时调用，建议在业务侧自行缓存用户资料

前端 `members` 类型为 `ChatUser[]`，渲染时使用 `user.name ?? user.id` 与 `user.avatar`。

### 用户可用状态

连接是否在线仍由 `members` 判断，用户主动状态通过 `availability` 表示：

```ts
const { activeRoom, availability, statusText, setAvailability } = useChat({
  baseUrl: 'http://localhost:3000',
  userId: 'user-1',
  profile: { id: 'user-1', availability: 'online' },
  channels: ['room-1'],
})

setAvailability('busy', '会议中')
setAvailability('away', '暂时离开')
setAvailability('online')

// 同通道成员会收到最新 presence，sender 保存发送时的状态快照
console.log(activeRoom.value?.members.map(user => user.availability))
```

可选状态为 `online`、`busy`、`away`。离线设置会在重连后自动同步；默认状态保存在 `ChatBus` 内存中，需要跨重启恢复或多实例共享时应结合业务存储与 `getUserProfile`。

### 媒体消息（预签名直传）

文件不经过聊天服务：业务后端签发对象存储的预签名 URL，客户端直传后把附件描述写入消息。

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
await sendMedia(file, { onProgress: percent => console.log(percent) })

// 也可先单独上传，再自己组装消息
const attachment = await uploadFile(file)
send({ content: '看这张图', type: 'image', attachments: [attachment] })
```

服务端可对附件做来源校验：

```ts
const { app } = createChatServer({
  onAttachment: ({ attachment, userId, channelId }) => {
    return attachment.url.startsWith('https://cdn.example.com/')
  },
})
```

附件结构为 `ChatAttachment`，包含 `id`、`url`、`mimeType`、`size` 及可选的 `name`、`width`、`height`、`duration`、`thumbnailUrl`。预设直传地址与访问地址必须分开，不要用带签名的临时地址做 `url`。

## 后端配置

```ts
import { createChatServer } from '@oiij/chat/server'

const { app, bus } = createChatServer({
  // 存储适配器，默认内存存储
  storage: undefined,
  // 连接鉴权，返回 false 拒绝（同时作用于 WebSocket 与 REST）
  onConnect: ({ userId, token, request }) => Boolean(userId),
  // 消息业务钩子，持久化与广播前调用，可修改或拦截消息
  onMessage: (ctx, message) => message,
  // 心跳超时（毫秒）
  heartbeat: 30_000,
  // 跨实例广播适配器
  broadcaster: undefined,
  // 附件校验，返回 false 拒绝该消息
  onAttachment: ({ attachment }) => Boolean(attachment.url),
  // 用户资料解析，用于在线用户列表与发送者快照
  getUserProfile: async userId => ({ id: userId, name: '昵称', avatar: 'https://cdn.example.com/a.png' }),
})
```

### 存储适配器

| 适配器            | 导入路径                   | 说明                             |
| ----------------- | -------------------------- | -------------------------------- |
| `MemoryStorage`   | `@oiij/chat/server`        | 进程内存，重启丢失（默认）       |
| `JsonFileStorage` | `@oiij/chat/server`        | 单 JSON 文件，原子写入           |
| `SqliteStorage`   | `@oiij/chat/server/sqlite` | 需 Node >= 22.5 的 `node:sqlite` |

```ts
import { createChatServer } from '@oiij/chat/server'
import { SqliteStorage } from '@oiij/chat/server/sqlite'

const { app } = createChatServer({
  storage: new SqliteStorage('./data'), // 目录或 .db 文件路径
})
```

自定义存储只需实现 `StorageAdapter` 的 7 个必选方法；额外实现 `searchMessages` 即可让检索下推到存储层，否则自动回退为内存过滤。

### 多实例广播

默认广播只在当前进程内生效。多实例部署时接入 Redis Pub/Sub：

```ts
import { createChatServer, createRedisBroadcaster } from '@oiij/chat/server'
import Redis from 'ioredis'

const { app, bus } = createChatServer({
  broadcaster: createRedisBroadcaster({
    publisher: new Redis(),
    subscriber: new Redis(), // 订阅连接需与发布连接分开
    prefix: 'myapp:chat',
  }),
})

process.on('SIGTERM', () => void bus.close())
```

适配器会按通道懒订阅，并丢弃自身发布的消息，避免与本实例的本地投递重复。

### 鉴权约定

- 请求头：`x-chat-user`、`x-chat-token`
- 查询参数：`userId`、`token`
- REST 鉴权通过后可用 `getChatUserId(event)` 读取当前用户
- 也可用 `createChatAuthMiddleware` 为自定义路由挂载同一套鉴权

## REST 接口

| 方法     | 路径                            | 说明             |
| -------- | ------------------------------- | ---------------- |
| `GET`    | `/channels`                     | 列出通道         |
| `POST`   | `/channels`                     | 创建通道         |
| `GET`    | `/channels/:id/messages`        | 分页拉取历史消息 |
| `GET`    | `/channels/:id/messages/search` | 按关键字检索消息 |
| `DELETE` | `/channels/:id/messages/:mid`   | 删除单条消息     |

## WebSocket 协议

连接地址：`ws(s)://<host>/ws?userId=<id>&token=<token>`

客户端消息：`subscribe`、`unsubscribe`、`send`、`typing`、`read`、`edit`、`delete`、`recall`、`set-presence`、`ping`。

服务端消息：`message`、`status`、`typing`、`history`、`message-updated`、`message-deleted`、`read`、`presence`、`error`、`pong`。

完整字段定义见 `src/types.ts`。

## 文档

- [useChat 文档](./demos/use-chat.md)

## 许可证

MIT
