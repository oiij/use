# UseAudioContext

## Demo

<demo vue="./demos/use-audio-context.vue" title="UseAudioContext" />

## Types

```ts
// #region src/composables/use-audio-context.d.ts
interface AudioContextOptions {
  analyser?: boolean
  volume?: number
  playbackRate?: number
  fadeOptions?: AudioContextFadeOptions | boolean
}
interface AudioContextFadeOptions {
  fade?: boolean
  duration?: number
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
  volume: vue13004.Ref<number, number>
  setVolume: (volume: number) => void
  playbackRate: vue13004.Ref<number, number>
  setPlaybackRate: (playbackRate: number) => void
  playing: vue13004.Ref<boolean, boolean>
  paused: vue13004.Ref<boolean, boolean>
  ended: vue13004.Ref<boolean, boolean>
  currentTime: vue13004.Ref<number, number>
  currentTimeText: vue13004.ComputedRef<string>
  setCurrentTime: (time: number) => void
  duration: vue13004.Ref<number, number>
  durationText: vue13004.ComputedRef<string>
  progress: vue13004.Ref<number, number>
  setProgress: (progress: number) => void
  cachedDuration: vue13004.Ref<number, number>
  cachedDurationText: vue13004.ComputedRef<string>
  cachedProgress: vue13004.Ref<number, number>
  url: vue13004.Ref<string | undefined, string | undefined>
  play: (_url?: string) => Promise<void>
  pause: (options?: AudioContextFadeOptions) => void
  resume: (options?: AudioContextFadeOptions) => void
  stop: () => void
  toggle: () => void
  getFrequencyData: () => Uint8Array<ArrayBuffer>
  setEQFrequency: (index: number, value: number) => void
  getEQFrequency: (index: number) => number
  getEQFrequencies: () => {
    frequency: number
    gain: number
  }[]
  onVolumeUpdate: _vueuse_core7706.EventHookOn<HTMLAudioElement>
  onRateUpdate: _vueuse_core7706.EventHookOn<HTMLAudioElement>
  onTimeUpdate: _vueuse_core7706.EventHookOn<HTMLAudioElement>
  onDurationUpdate: _vueuse_core7706.EventHookOn<HTMLAudioElement>
  onPlaying: _vueuse_core7706.EventHookOn<HTMLAudioElement>
  onPaused: _vueuse_core7706.EventHookOn<HTMLAudioElement>
  onEnded: _vueuse_core7706.EventHookOn<HTMLAudioElement>
}
type UseAudioContextReturns = ReturnType<typeof useAudioContext>
// #endregion
export { AudioContextFadeOptions, AudioContextOptions, useAudioContext, UseAudioContextReturns }

// #region src/composables/use-spectrum.d.ts
interface SpectrumBarOptions {
  width?: number
  minHeight?: number
  spacing?: number
  radius?: number
  color?: [string, string] | string
  shadow?: boolean
}
interface SpectrumLineOptions {
  width?: number
  spacing?: number
  color?: [string, string] | string
  smoothness?: number
  fill?: boolean
  shadow?: boolean
}
interface SpectrumCircleBarOptions {
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
interface SpectrumCircleLineOptions {
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
interface SpectrumOptions {
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
