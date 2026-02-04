# UseAudioContext

## 功能描述

**UseAudioContext** 是一个功能强大的音频处理 Vue 组合式函数，提供了完整的音频控制能力，包括音量调节、播放控制、均衡器设置、频谱分析等特性。它基于 Web Audio API 实现，为 Vue 应用提供了流畅的音频处理体验。

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

<demo vue="./use-audio-context.vue" title="UseAudioContext" />

## API

### 函数签名

```ts
declare function useAudioContext(options?: AudioContextOptions): UseAudioContextReturns
```

## 类型定义

```ts
export type AudioContextFadeOptions = {
  fade?: boolean
  duration?: number
}

export type AudioContextOptions = {
  volume?: number
  playbackRate?: number
  fade?: AudioContextFadeOptions | boolean
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
  filterNode: BiquadFilterNode
  volume: Readonly<Ref<number>>
  setVolume: (volume: number) => void
  muted: Readonly<Ref<boolean>>
  setMuted: (muted?: boolean) => void
  toggleMute: () => void
  playbackRate: Readonly<Ref<number>>
  setPlaybackRate: (playbackRate: number) => void
  playing: Readonly<Ref<boolean>>
  paused: Readonly<Ref<boolean>>
  ended: Readonly<Ref<boolean>>
  currentTime: Readonly<Ref<number>>
  currentTimeText: ComputedRef<string>
  setCurrentTime: (time: number) => void
  duration: Readonly<Ref<number>>
  durationText: ComputedRef<string>
  progress: Readonly<Ref<number>>
  setProgress: (progress: number) => void
  cachedDuration: Readonly<Ref<number>>
  cachedDurationText: ComputedRef<string>
  cachedProgress: Readonly<Ref<number>>
  url: Readonly<Ref<string | undefined>>
  play: (url: string) => Promise<void>
  pause: (options?: AudioContextFadeOptions) => void
  resume: (options?: AudioContextFadeOptions) => void
  stop: () => void
  toggle: (options?: AudioContextFadeOptions) => void
  getFrequencyData: () => Uint8Array
  setEQFrequency: (index: number, value: number) => void
  getEQFrequency: (index: number) => number
  getEQFrequencies: () => {
    frequency: number
    gain: number
  }[]
  onVolumeUpdate: EventHookOn<[HTMLAudioElement, number]>
  onMuted: EventHookOn<[HTMLAudioElement]>
  onRateUpdate: EventHookOn<[HTMLAudioElement]>
  onTimeUpdate: EventHookOn<[HTMLAudioElement, number]>
  onTimeUpdateRaf: EventHookOn<[HTMLAudioElement, {
    currentTime: number
    progress: number
  }, UseRafFnCallbackArguments]>
  onDurationUpdate: EventHookOn<[HTMLAudioElement, number]>
  onPlaying: EventHookOn<[HTMLAudioElement]>
  onPaused: EventHookOn<[HTMLAudioElement]>
  onEnded: EventHookOn<[HTMLAudioElement]>
}
```
