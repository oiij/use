import type { UseRafFnCallbackArguments } from '@vueuse/core'
import { createEventHook, useRafFn } from '@vueuse/core'
import { computed, ref } from 'vue'
import { clampVolume, formatTime, MIN_VOLUME_CACHE, nanAble } from './_audio-shared'

/**
 * HTMLAudioElement 播放状态工厂函数的配置选项
 * 用于在 useAudio 和 useAudioContext 之间共享 ref 状态、事件钩子、进度/音量控制逻辑
 */
export type CreateAudioElementPlaybackOptions = {
  /** 已创建好的 HTMLAudioElement 实例 */
  audioElement: HTMLAudioElement
  /** 初始音量（0-1），默认为 1 */
  defaultVolume?: number
  /** 初始播放速率，默认为 1 */
  defaultPlaybackRate?: number
  /** 时间更新格式化函数，默认为 (time) => time */
  timeUpdateFormat?: (time: number) => number
  /**
   * 音量实际写入底层媒体的回调
   * - useAudio 传入 (v) => { audioElement.volume = v }
   * - useAudioContext 传入 (v) => { gainNode.gain.setValueAtTime(...) }
   */
  applyVolume?: (volume: number) => void
  /**
   * 工厂创建时的音量初始化回调
   * useAudioContext 需要在创建后把 volumeRef.value 写入 gainNode.gain
   */
  initVolume?: (volume: number) => void
}

/**
 * 创建基于 HTMLAudioElement 的共享播放状态、事件钩子、控制方法和 RAF 循环
 * 消除 useAudio 和 useAudioContext 之间重复的 ref 状态定义与事件逻辑
 *
 * @param options 配置选项
 * @returns 可复用的状态、事件钩子、方法和 RAF 控制器
 *
 * @example
 * ```ts
 * // useAudio 中的用法
 * const audioElement = new Audio()
 * const playback = createAudioElementPlayback({
 *   audioElement,
 *   defaultVolume: 0.8,
 *   applyVolume: (v) => { audioElement.volume = v },
 * })
 * ```
 *
 * @example
 * ```ts
 * // useAudioContext 中的用法
 * const audioElement = new Audio()
 * const gainNode = audioContext.createGain()
 * const playback = createAudioElementPlayback({
 *   audioElement,
 *   applyVolume: (v) => {
 *     gainNode.gain.setValueAtTime(v, audioContext.currentTime)
 *   },
 *   initVolume: (v) => { gainNode.gain.value = v },
 * })
 * ```
 */
export function createAudioElementPlayback(options: CreateAudioElementPlaybackOptions) {
  const {
    audioElement,
    defaultVolume = 1,
    defaultPlaybackRate = 1,
    timeUpdateFormat = (time: number) => time,
    applyVolume,
    initVolume,
  } = options

  // ====== 事件钩子 ======
  const onVolumeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onMutedEv = createEventHook<[HTMLAudioElement]>()
  const onRateUpdateEv = createEventHook<[HTMLAudioElement]>()
  const onPlayingEv = createEventHook<[HTMLAudioElement]>()
  const onPausedEv = createEventHook<[HTMLAudioElement]>()
  const onEndedEv = createEventHook<[HTMLAudioElement]>()
  const onTimeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onTimeUpdateRafEv = createEventHook<[HTMLAudioElement, { currentTime: number, progress: number }, UseRafFnCallbackArguments]>()
  const onDurationUpdateEv = createEventHook<[HTMLAudioElement, number]>()

  // ====== 共享 ref 状态 ======
  const volumeRef = ref(defaultVolume)
  let volumeCache: number = defaultVolume
  const muted = computed(() => volumeRef.value === 0)

  const playbackRateRef = ref(defaultPlaybackRate)

  const playingRef = ref(false)
  const pausedRef = ref(false)
  const endedRef = ref(false)

  const urlRef = ref<string>()

  const currentTimeRef = ref(0)
  const currentTimeText = computed(() => formatTime(currentTimeRef.value))

  const progressRef = ref(0)

  const durationRef = ref(0)
  const durationText = computed(() => formatTime(durationRef.value))

  const cachedDurationRef = ref(0)
  const cachedDurationText = computed(() => formatTime(cachedDurationRef.value))
  const cachedProgressRef = ref(0)

  initVolume?.(volumeRef.value)

  // ====== 共享方法 ======
  function setVolume(volume: number) {
    const clampedVolume = clampVolume(volume)
    applyVolume?.(clampedVolume)
    volumeRef.value = clampedVolume
    onVolumeUpdateEv.trigger(audioElement, clampedVolume)
  }

  function setMuted(mutedFlag = true) {
    if (mutedFlag) {
      volumeCache = Math.max(MIN_VOLUME_CACHE, volumeRef.value)
      onMutedEv.trigger(audioElement)
      setVolume(0)
    }
    else {
      setVolume(volumeCache)
    }
  }

  function toggleMute() {
    setMuted(!muted.value)
  }

  function setPlaybackRate(playbackRate: number) {
    audioElement.playbackRate = playbackRate
  }

  function setCurrentTime(time: number) {
    audioElement.currentTime = time
    currentTimeAndProgressEffect()
  }

  function setProgress(progress: number) {
    const currentTime = Number(((progress / 100) * audioElement.duration).toFixed(2))
    audioElement.currentTime = nanAble(currentTime)
    currentTimeAndProgressEffect()
  }

  function currentTimeAndProgressEffect() {
    const duration = audioElement.duration
    const currentTime = timeUpdateFormat(audioElement.currentTime)
    currentTimeRef.value = currentTime
    const progress = duration > 0 ? Number(((currentTime / duration) * 100).toFixed(2)) : 0
    progressRef.value = nanAble(progress)
  }

  // ====== RAF 循环 ======
  const { resume: rafResume, pause: rafPause } = useRafFn((arg) => {
    currentTimeAndProgressEffect()
    onTimeUpdateRafEv.trigger(audioElement, {
      currentTime: currentTimeRef.value,
      progress: progressRef.value,
    }, arg)
  }, { immediate: false })

  // ====== 事件处理函数 ======
  function onRateChange() {
    playbackRateRef.value = audioElement.playbackRate
    onRateUpdateEv.trigger(audioElement)
  }

  function onPlaying() {
    playingRef.value = true
    pausedRef.value = false
    endedRef.value = false
    rafResume()
    onPlayingEv.trigger(audioElement)
  }

  function onPause() {
    playingRef.value = false
    pausedRef.value = true
    endedRef.value = false
    rafPause()
    onPausedEv.trigger(audioElement)
  }

  function onEnded() {
    playingRef.value = false
    pausedRef.value = false
    endedRef.value = true
    rafPause()
    onEndedEv.trigger(audioElement)
  }

  function onTimeUpdate() {
    onTimeUpdateEv.trigger(audioElement, currentTimeRef.value)
  }

  function onDurationChange() {
    const duration = audioElement.duration
    durationRef.value = nanAble(duration)
    onDurationUpdateEv.trigger(audioElement, durationRef.value)
  }

  function onCanplay() {
    const duration = audioElement.buffered.end(Math.max(0, audioElement.buffered.length - 1))
    cachedDurationRef.value = nanAble(duration)
    cachedProgressRef.value = nanAble(Number((duration / audioElement.duration * 100).toFixed(2)))
  }

  return {
    // 状态
    volumeRef,
    muted,
    playbackRateRef,
    playingRef,
    pausedRef,
    endedRef,
    urlRef,
    currentTimeRef,
    currentTimeText,
    progressRef,
    durationRef,
    durationText,
    cachedDurationRef,
    cachedDurationText,
    cachedProgressRef,
    // 事件钩子
    onVolumeUpdateEv,
    onMutedEv,
    onRateUpdateEv,
    onPlayingEv,
    onPausedEv,
    onEndedEv,
    onTimeUpdateEv,
    onTimeUpdateRafEv,
    onDurationUpdateEv,
    // 方法
    setVolume,
    setMuted,
    toggleMute,
    setPlaybackRate,
    setCurrentTime,
    setProgress,
    currentTimeAndProgressEffect,
    // RAF
    rafResume,
    rafPause,
    // 事件处理函数
    onRateChange,
    onPlaying,
    onPause,
    onEnded,
    onTimeUpdate,
    onDurationChange,
    onCanplay,
  }
}

/** 工厂函数的返回类型，用于在 useAudio / useAudioContext 中声明 */
export type AudioElementPlayback = ReturnType<typeof createAudioElementPlayback>
