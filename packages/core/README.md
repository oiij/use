# @oiij/use

[![NPM version](https://img.shields.io/npm/v/@oiij/use)](https://www.npmjs.com/package/@oiij/use)
[![MIT-license](https://img.shields.io/npm/l/@oiij/use)](https://github.com/oiij/use/blob/main/packages/core/LICENSE)

## 简介

Use Core 是一个功能丰富的 Vue 3 组合式 API 工具库，提供了一系列实用的 composables，帮助开发者更高效地构建 Vue 应用。

## 特点

### 🎯 功能丰富

- 📦 提供 17+ 个实用的组合式函数
- 🌐 涵盖音频、动画、网络、UI、主题等多个领域
- 🔌 支持 WebSocket、WebRTC、EventSource 等实时通信

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

### 🚀 轻量高效

- 🪶 核心代码精简，支持按需导入
- ⚡ 优化的性能表现，最小化运行时开销
- 📉 支持 Tree Shaking，进一步减小打包体积

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

## 组合式 API 列表

| API                     | 说明                     |
| ----------------------- | ------------------------ |
| `useBoolean`            | 布尔值状态管理           |
| `useTheme`              | 主题管理（暗黑模式切换） |
| `useTypeWriter`         | 打字机效果               |
| `useWebSocket`          | WebSocket 连接管理       |
| `useWebRTC`             | WebRTC 实时通信          |
| `useEventSource`        | SSE 服务器发送事件       |
| `useAudio`              | 音频播放控制             |
| `useAudioContext`       | Web Audio API 封装       |
| `useAudioContextBuffer` | AudioBuffer 处理         |
| `useAutoRatio`          | 自动比例计算             |
| `useContextMenu`        | 右键菜单                 |
| `useImageVerify`        | 图片验证码               |
| `useNumberAnimation`    | 数字动画                 |
| `useScanCode`           | 扫码枪输入               |
| `useScrollView`         | 滚动视图控制             |
| `useSpectrum`           | 音频频谱可视化           |
| `useViewTransition`     | 视图过渡动画             |

## API

### `useBoolean(initValue?)`

布尔值状态管理。

```vue
<script setup>
import { useBoolean } from '@oiij/use'

const { value, toggle, setTrue, setFalse } = useBoolean(false)
</script>

<template>
  <button @click="toggle">
    切换
  </button>
  <p>当前值: {{ value }}</p>
</template>
```

### `useTheme(options?)`

主题管理，支持暗黑模式切换和平滑过渡动画。

```vue
<script setup>
import { useTheme } from '@oiij/use'

const { isDark, toggleDark, setDark, setLight } = useTheme()
</script>

<template>
  <button @click="toggleDark">
    切换主题
  </button>
</template>
```

### `useTypeWriter(value, options?)`

打字机效果。

```vue
<script setup>
import { useTypeWriter } from '@oiij/use'
import { ref } from 'vue'

const text = ref('Hello World!')
const { typedValue, isTyping, start, pause, resume, stop } = useTypeWriter(text, {
  interval: 50,
  step: 1
})
</script>

<template>
  <p>{{ typedValue }}</p>
  <button @click="pause">
    暂停
  </button>
  <button @click="resume">
    继续
  </button>
</template>
```

### `useWebSocket(url?, options?)`

WebSocket 连接管理。

```vue
<script setup>
import { useWebSocket } from '@oiij/use'

const { status, data, send, onMessage } = useWebSocket('wss://echo.websocket.org', {
  parseMessage: true,
  autoRetry: { retries: 3, delay: 1000 }
})

onMessage((event) => {
  console.log('收到消息:', event.data)
})

function sendPing() {
  send({ type: 'ping', timestamp: Date.now() })
}
</script>

<template>
  <p>状态: {{ status }}</p>
  <button @click="sendPing">
    发送 Ping
  </button>
</template>
```

### `useImageVerify(templateRef, options?)`

图片验证码。

```vue
<script setup>
import { useImageVerify } from '@oiij/use'
import { ref } from 'vue'

const canvasRef = ref()
const { value, code, passed, validate, refresh } = useImageVerify(canvasRef, {
  type: 'character',
  width: 120,
  height: 40,
  characterOptions: { length: 4 }
})

async function handleVerify() {
  try {
    await validate()
    console.log('验证通过')
  }
  catch {
    console.log('验证失败')
    refresh()
  }
}
</script>

<template>
  <canvas ref="canvasRef" />
  <input v-model="value" placeholder="输入验证码">
  <button @click="handleVerify">
    验证
  </button>
</template>
```

### `useScanCode()`

扫码枪输入监听。

```vue
<script setup>
import { useScanCode } from '@oiij/use'

const { value, pending, onScan } = useScanCode()

onScan((code) => {
  console.log('扫码结果:', code)
})
</script>

<template>
  <p>扫码结果: {{ value }}</p>
  <p>等待扫码: {{ pending }}</p>
</template>
```

### `useScrollView(templateRef, options?)`

滚动视图控制。

```vue
<script setup>
import { useScrollView } from '@oiij/use'
import { ref } from 'vue'

const containerRef = ref()
const { scrollToView, scrollToNext, scrollToPrevious } = useScrollView(containerRef, {
  activeClassName: '.active',
  enableWheel: true,
  direction: 'vertical'
})
</script>

<template>
  <div ref="containerRef">
    <div class="item">
      Item 1
    </div>
    <div class="item active">
      Item 2
    </div>
    <div class="item">
      Item 3
    </div>
  </div>
  <button @click="scrollToPrevious">
    上一个
  </button>
  <button @click="scrollToNext">
    下一个
  </button>
</template>
```

### `useNumberAnimation(options?)`

数字动画效果。

```vue
<script setup>
import { useNumberAnimation } from '@oiij/use'

const { value, start } = useNumberAnimation({
  from: 0,
  to: 1000,
  duration: 2000
})
</script>

<template>
  <p>{{ Math.round(value) }}</p>
  <button @click="start">
    开始动画
  </button>
</template>
```

### `useViewTransition(options?)`

视图过渡动画。

```vue
<script setup>
import { useViewTransition } from '@oiij/use'

const { isSupported, run } = useViewTransition()

async function toggleTheme() {
  await run(() => {
    document.documentElement.classList.toggle('dark')
  })
}
</script>

<template>
  <button @click="toggleTheme">
    切换主题
  </button>
</template>
```

### `useContextMenu(templateRef, options?)`

右键菜单。

```vue
<script setup>
import { useContextMenu } from '@oiij/use'
import { ref } from 'vue'

const containerRef = ref()
const { visible, x, y, onContextMenu } = useContextMenu(containerRef)

onContextMenu((event) => {
  console.log('右键点击位置:', event.clientX, event.clientY)
})
</script>

<template>
  <div ref="containerRef">
    右键点击此处
  </div>
  <div v-if="visible" :style="{ left: `${x}px`, top: `${y}px` }">
    菜单内容
  </div>
</template>
```

### `useEventSource(url, options?)`

SSE 服务器发送事件。

```vue
<script setup>
import { useEventSource } from '@oiij/use'

const { status, data, onMessage } = useEventSource('/api/events', {
  withCredentials: true
})

onMessage((event) => {
  console.log('收到事件:', event.data)
})
</script>

<template>
  <p>状态: {{ status }}</p>
  <p>数据: {{ data }}</p>
</template>
```

## 类型定义

```ts
export type UseBooleanReturns = {
  value: Ref<boolean>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
  setValue: (v: boolean) => void
}

export type UseThemeReturns = {
  isDark: Ref<boolean>
  preferredDark: Ref<boolean>
  colorMode: Ref<string>
  systemColorMode: Ref<string>
  setColorMode: (mode: 'dark' | 'light' | 'auto', event?: MouseEvent) => void
  setDark: (event?: MouseEvent) => void
  setLight: (event?: MouseEvent) => void
  toggleDark: (event?: MouseEvent) => void
}

export type UseTypeWriterReturns = {
  value: Ref<string>
  typedValue: ComputedRef<string>
  progress: ComputedRef<number>
  isTyping: Ref<boolean>
  paused: Ref<boolean>
  ended: Ref<boolean>
  start: () => void
  pause: () => void
  resume: () => void
  restart: () => void
  stop: () => void
  destroy: () => void
  onStat: (callback: () => void) => void
  onStop: (callback: (value: string) => void) => void
  onUpdate: (callback: (data: { index: number, value: string }) => void) => void
}

export type UseWebSocketReturns = {
  socket: ShallowRef<WebSocket | null>
  url: Ref<string | URL | undefined>
  status: Ref<'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'PENDING'>
  data: Ref<any>
  connect: (url?: string | URL, protocols?: string | string[]) => void
  close: () => void
  send: (data: object) => void
  sendRaw: (data: string) => void
  destroy: () => void
  registerHandler: <K>(type: K, handler: (data: any) => void) => () => void
  onOpen: (callback: (event: Event) => void) => void
  onMessage: (callback: (event: MessageEvent) => void) => void
  onClose: (callback: (event: CloseEvent) => void) => void
  onError: (callback: (event: Event) => void) => void
}
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/core/core)
