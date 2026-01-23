# UseAudioContext

## Demo

<demo vue="./demos/use-audio-context.vue" title="UseAudioContext" />

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
  volume: Readonly<vue30.Ref<number, number>>
  setVolume: (volume: number) => void
  muted: Readonly<vue30.Ref<boolean, boolean>>
  setMuted: (muted?: boolean) => void
  toggleMute: () => void
  playbackRate: Readonly<vue30.Ref<number, number>>
  setPlaybackRate: (playbackRate: number) => void
  playing: Readonly<vue30.Ref<boolean, boolean>>
  paused: Readonly<vue30.Ref<boolean, boolean>>
  ended: Readonly<vue30.Ref<boolean, boolean>>
  currentTime: Readonly<vue30.Ref<number, number>>
  currentTimeText: vue30.ComputedRef<string>
  setCurrentTime: (time: number) => void
  duration: Readonly<vue30.Ref<number, number>>
  durationText: vue30.ComputedRef<string>
  progress: Readonly<vue30.Ref<number, number>>
  setProgress: (progress: number) => void
  cachedDuration: Readonly<vue30.Ref<number, number>>
  cachedDurationText: vue30.ComputedRef<string>
  cachedProgress: Readonly<vue30.Ref<number, number>>
  url: Readonly<vue30.Ref<string | undefined, string | undefined>>
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
  onVolumeUpdate: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onMuted: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onRateUpdate: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onTimeUpdate: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onTimeUpdateRaf: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onDurationUpdate: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onPlaying: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onPaused: _vueuse_core7.EventHookOn<HTMLAudioElement>
  onEnded: _vueuse_core7.EventHookOn<HTMLAudioElement>
}
type UseAudioContextReturns = ReturnType<typeof useAudioContext>
// #endregion
export { AudioContextFadeOptions, AudioContextOptions, useAudioContext, UseAudioContextReturns }

// #region src/composables/use-spectrum.d.ts
type SpectrumBarOptions = {
  width?: number
  minHeight?: number
  spacing?: number
  radius?: number
  color?: [string, string] | string
  shadow?: boolean
}
type SpectrumLineOptions = {
  width?: number
  spacing?: number
  color?: [string, string] | string
  smoothness?: number
  fill?: boolean
  shadow?: boolean
}
type SpectrumCircleBarOptions = {
  width?: number
  minHeight?: number
  spacing?: number
  radius?: number
  barRadius?: number
  color?: [string, string] | string
  startAngle?: number
  endAngle?: number
  shadow?: boolean
}
type SpectrumCircleLineOptions = {
  width?: number
  spacing?: number
  radius?: number
  color?: [string, string] | string
  smoothness?: number
  fill?: boolean
  startAngle?: number
  endAngle?: number
  shadow?: boolean
}
type SpectrumOptions = {
  type?: 'bar' | 'line' | 'circle-bar' | 'circle-line'
  color?: [string, string] | string
  shadow?: boolean
  barOptions?: SpectrumBarOptions
  lineOptions?: SpectrumLineOptions
  circleBarOptions?: SpectrumCircleBarOptions
  circleLineOptions?: SpectrumCircleLineOptions
  animationSpeed?: number
  manual?: boolean
}
declare function useSpectrum(canvasRef: TemplateRef<HTMLCanvasElement>, frequencyDataGetter: () => Uint8Array<ArrayBuffer>, options?: SpectrumOptions): {
  canvasRef: Readonly<vue13888.ShallowRef<HTMLCanvasElement | null>>
  pause: _vueuse_core8243.Fn
  resume: _vueuse_core8243.Fn
  isActive: Readonly<vue13888.ShallowRef<boolean>>
}
// #endregion
export { SpectrumBarOptions, SpectrumCircleBarOptions, SpectrumCircleLineOptions, SpectrumLineOptions, SpectrumOptions, useSpectrum }
```
