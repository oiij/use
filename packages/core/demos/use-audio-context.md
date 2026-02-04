# UseAudioContext

## Demo

<demo vue="./use-audio-context.vue" title="UseAudioContext" />

## Types

```ts
// #region src/use-audio-context.d.ts
type AudioContextFadeOptions = {
  fade?: boolean
  duration?: number
}
type AudioContextOptions = {
  volume?: number
  playbackRate?: number
  fade?: AudioContextFadeOptions | boolean
  timeUpdateFormat?: (time: number) => number
}
declare function useAudioContext(options?: AudioContextOptions): {
  eqFrequencies: number[]
  audioContext: AudioContext
  audioElement: HTMLAudioElement
  sourceNode: MediaElementAudioSourceNode
  gainNode: GainNode
  analyserNode: AnalyserNode
  filters: BiquadFilterNode[]
  filterNode: BiquadFilterNode
  volume: Readonly<vue36.Ref<number, number>>
  setVolume: (volume: number) => void
  muted: Readonly<vue36.Ref<boolean, boolean>>
  setMuted: (muted?: boolean) => void
  toggleMute: () => void
  playbackRate: Readonly<vue36.Ref<number, number>>
  setPlaybackRate: (playbackRate: number) => void
  playing: Readonly<vue36.Ref<boolean, boolean>>
  paused: Readonly<vue36.Ref<boolean, boolean>>
  ended: Readonly<vue36.Ref<boolean, boolean>>
  currentTime: Readonly<vue36.Ref<number, number>>
  currentTimeText: vue36.ComputedRef<string>
  setCurrentTime: (time: number) => void
  duration: Readonly<vue36.Ref<number, number>>
  durationText: vue36.ComputedRef<string>
  progress: Readonly<vue36.Ref<number, number>>
  setProgress: (progress: number) => void
  cachedDuration: Readonly<vue36.Ref<number, number>>
  cachedDurationText: vue36.ComputedRef<string>
  cachedProgress: Readonly<vue36.Ref<number, number>>
  url: Readonly<vue36.Ref<string | undefined, string | undefined>>
  play: (url: string) => Promise<void>
  pause: (options?: AudioContextFadeOptions) => void
  resume: (options?: AudioContextFadeOptions) => void
  stop: () => void
  toggle: (options?: AudioContextFadeOptions) => void
  getFrequencyData: () => Uint8Array<ArrayBuffer>
  setEQFrequency: (index: number, value: number) => void
  getEQFrequency: (index: number) => number
  getEQFrequencies: () => {
    frequency: number
    gain: number
  }[]
  onVolumeUpdate: _vueuse_core16.EventHookOn<[HTMLAudioElement, number]>
  onMuted: _vueuse_core16.EventHookOn<[HTMLAudioElement]>
  onRateUpdate: _vueuse_core16.EventHookOn<[HTMLAudioElement]>
  onTimeUpdate: _vueuse_core16.EventHookOn<[HTMLAudioElement, number]>
  onTimeUpdateRaf: _vueuse_core16.EventHookOn<[HTMLAudioElement, {
    currentTime: number
    progress: number
  }, UseRafFnCallbackArguments]>
  onDurationUpdate: _vueuse_core16.EventHookOn<[HTMLAudioElement, number]>
  onPlaying: _vueuse_core16.EventHookOn<[HTMLAudioElement]>
  onPaused: _vueuse_core16.EventHookOn<[HTMLAudioElement]>
  onEnded: _vueuse_core16.EventHookOn<[HTMLAudioElement]>
}
type UseAudioContextReturns = ReturnType<typeof useAudioContext>
// #endregion
export { AudioContextFadeOptions, AudioContextOptions, useAudioContext, UseAudioContextReturns }
```
