# UseAudioContext

## 功能描述

**UseAudioContext** 是一个功能强大的音频处理 Vue 组合式函数，提供了完整的音频控制能力，包括音量调节、播放控制、均衡器设置、频谱分析等特性。它基于 Web Audio API 实现，为 Vue 应用提供了流畅的音频处理体验。

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

<demo vue="./use-audio-context.vue" title="UseAudioContext" />

## API

### `useAudioContext(options?)`

创建音频上下文。

#### 参数

| 参数      | 类型                  | 说明     |
| --------- | --------------------- | -------- |
| `options` | `AudioContextOptions` | 配置选项 |

#### AudioContextOptions

| 选项               | 类型                                 | 默认值  | 说明           |
| ------------------ | ------------------------------------ | ------- | -------------- |
| `volume`           | `number`                             | `1`     | 初始音量       |
| `playbackRate`     | `number`                             | `1`     | 播放速率       |
| `fade`             | `boolean \| AudioContextFadeOptions` | `false` | 淡入淡出配置   |
| `timeUpdateFormat` | `function`                           | -       | 时间格式化函数 |

#### 返回值

| 属性                           | 类型                     | 说明              |
| ------------------------------ | ------------------------ | ----------------- |
| `audioContext`                 | `AudioContext`           | AudioContext 实例 |
| `audioElement`                 | `HTMLAudioElement`       | Audio 元素        |
| `volume`                       | `Readonly<Ref<number>>`  | 当前音量          |
| `setVolume(volume)`            | `Function`               | 设置音量          |
| `muted`                        | `Readonly<Ref<boolean>>` | 是否静音          |
| `setMuted(muted?)`             | `Function`               | 设置静音          |
| `toggleMute()`                 | `Function`               | 切换静音          |
| `playing`                      | `Readonly<Ref<boolean>>` | 是否正在播放      |
| `paused`                       | `Readonly<Ref<boolean>>` | 是否暂停          |
| `currentTime`                  | `Readonly<Ref<number>>`  | 当前播放时间      |
| `duration`                     | `Readonly<Ref<number>>`  | 音频总时长        |
| `progress`                     | `Readonly<Ref<number>>`  | 播放进度          |
| `play(url)`                    | `Function`               | 播放音频          |
| `pause(options?)`              | `Function`               | 暂停播放          |
| `resume(options?)`             | `Function`               | 恢复播放          |
| `stop()`                       | `Function`               | 停止播放          |
| `toggle(options?)`             | `Function`               | 切换播放状态      |
| `getFrequencyData()`           | `Function`               | 获取频谱数据      |
| `setEQFrequency(index, value)` | `Function`               | 设置均衡器频率    |
| `onTimeUpdate(callback)`       | `Function`               | 时间更新事件      |
| `onPlaying(callback)`          | `Function`               | 播放事件          |
| `onPaused(callback)`           | `Function`               | 暂停事件          |
| `onEnded(callback)`            | `Function`               | 结束事件          |

## 类型定义

```ts
export type AudioContextFadeOptions = {
  /**
   * 是否启用淡入淡出
   */
  fade?: boolean
  /**
   * 淡入淡出持续时间（毫秒）
   */
  duration?: number
}

export type AudioContextOptions = {
  /**
   * 初始音量
   * @default 1
   */
  volume?: number
  /**
   * 播放速率
   * @default 1
   */
  playbackRate?: number
  /**
   * 淡入淡出配置
   * @default false
   */
  fade?: AudioContextFadeOptions | boolean
  /**
   * 时间格式化函数
   */
  timeUpdateFormat?: (time: number) => number
}

export type UseAudioContextReturns = {
  eqFrequencies: number[]
  audioContext: AudioContext
  audioElement: HTMLAudioElement
  sourceNode: MediaElementAudioSourceNode
  gainNode: GainNode
  analyserNode: AnalyserNode
  filters: BiquadFilterNode[]
  volume: Readonly<Ref<number>>
  setVolume: (volume: number) => void
  muted: Readonly<Ref<boolean>>
  setMuted: (muted?: boolean) => void
  toggleMute: () => void
  playing: Readonly<Ref<boolean>>
  paused: Readonly<Ref<boolean>>
  ended: Readonly<Ref<boolean>>
  currentTime: Readonly<Ref<number>>
  setCurrentTime: (time: number) => void
  duration: Readonly<Ref<number>>
  progress: Readonly<Ref<number>>
  url: Readonly<Ref<string | undefined>>
  play: (url: string) => Promise<void>
  pause: (options?: AudioContextFadeOptions) => void
  resume: (options?: AudioContextFadeOptions) => void
  stop: () => void
  toggle: (options?: AudioContextFadeOptions) => void
  getFrequencyData: () => Uint8Array
  setEQFrequency: (index: number, value: number) => void
  getEQFrequency: (index: number) => number
  onTimeUpdate: (callback: (audio: HTMLAudioElement, time: number) => void) => void
  onPlaying: (callback: (audio: HTMLAudioElement) => void) => void
  onPaused: (callback: (audio: HTMLAudioElement) => void) => void
  onEnded: (callback: (audio: HTMLAudioElement) => void) => void
}

export declare function useAudioContext(options?: AudioContextOptions): UseAudioContextReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useAudioContext } from '@oiij/use'

const {
  volume,
  playing,
  currentTime,
  duration,
  progress,
  play,
  pause,
  resume,
  toggle,
  setVolume
} = useAudioContext()

function handlePlay() {
  play('/audio/music.mp3')
}
</script>

<template>
  <p>播放进度: {{ progress }}%</p>
  <button @click="handlePlay">
    播放
  </button>
  <button @click="toggle">
    切换
  </button>
  <input type="range" :value="volume" @input="(e) => setVolume(e.target.value)">
</template>
```

### 带淡入淡出

```ts
import { useAudioContext } from '@oiij/use'

const { play, pause, resume } = useAudioContext({
  fade: {
    fade: true,
    duration: 500
  }
})

await play('/audio/music.mp3')
pause() // 淡出暂停
resume() // 淡入播放
```

### 频谱分析

```vue
<script setup>
import { useAudioContext } from '@oiij/use'

const { play, getFrequencyData, onTimeUpdate } = useAudioContext()

onTimeUpdate(() => {
  const data = getFrequencyData()
  // 处理频谱数据
  drawSpectrum(data)
})
</script>
```

### 均衡器

```ts
import { useAudioContext } from '@oiij/use'

const { setEQFrequency, getEQFrequencies } = useAudioContext()

// 设置低频增益
setEQFrequency(0, 10)

// 获取所有均衡器频率
const frequencies = getEQFrequencies()
```
