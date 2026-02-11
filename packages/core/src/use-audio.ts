import type { UseRafFnCallbackArguments } from '@vueuse/core'
import { createEventHook, useEventListener, useRafFn } from '@vueuse/core'
import { computed, onUnmounted, readonly, ref } from 'vue'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function nanAble(val: number) {
  return Number.isNaN(val) ? 0 : val
}

/**
 * 音频配置选项
 * @example
 * const options: UseAudioOptions = {
 *   volume: 0.7,
 *   playbackRate: 1.0,
 *   autoPlay: false,
 *   loop: true,
 *   timeUpdateFormat: (time) => Math.floor(time)
 * }
 */
export type UseAudioOptions = {
  /** 音量（0-1），默认为 1 */
  volume?: number
  /** 播放速率，默认为 1 */
  playbackRate?: number
  /** 是否自动播放，默认为 true */
  autoPlay?: boolean
  /** 是否循环播放，默认为 true */
  loop?: boolean
  /** 时间更新格式化函数，默认为 (time) => time */
  timeUpdateFormat?: (time: number) => number
}

/**
 * 音频控制组合式函数
 * 提供音频播放控制、音量管理、进度控制等功能
 *
 * @param src 音频源地址
 * @param options 配置选项
 * @returns 音频控制对象
 *
 * @example
 * // 基本用法
 * const audio = useAudio('https://example.com/audio.mp3', {
 *   volume: 0.7,
 *   autoPlay: false,
 *   loop: true
 * })
 *
 * audio.play('https://example.com/audio.mp3')
 * audio.pause()
 * audio.setVolume(0.5)
 *
 * @example
 * // 监听事件
 * const { onPlaying, onPaused, onEnded } = useAudio()
 *
 * onPlaying(() => {
 *   console.log('音频开始播放')
 * })
 */
export function useAudio(src?: string, options?: UseAudioOptions) {
  const {
    volume: defaultVolume = 1,
    playbackRate: defaultPlaybackRate = 1,
    autoPlay = true,
    loop = true,
    timeUpdateFormat = (time: number) => time,
  } = options ?? {}

  const audioElement = new Audio()
  audioElement.crossOrigin = 'anonymous'
  audioElement.autoplay = autoPlay
  audioElement.loop = loop

  if (src) {
    audioElement.src = src
    audioElement.load()
  }

  const onVolumeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onMutedEv = createEventHook<[HTMLAudioElement]>()
  const onRateUpdateEv = createEventHook<[HTMLAudioElement]>()
  const onPlayingEv = createEventHook<[HTMLAudioElement]>()
  const onPausedEv = createEventHook<[HTMLAudioElement]>()
  const onEndedEv = createEventHook<[HTMLAudioElement]>()
  const onTimeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onTimeUpdateRafEv = createEventHook<[HTMLAudioElement, { currentTime: number, progress: number }, UseRafFnCallbackArguments]>()
  const onDurationUpdateEv = createEventHook<[HTMLAudioElement, number]>()

  const volumeRef = ref(defaultVolume)
  let volumeCache: number = defaultVolume
  const muted = computed(() => volumeRef.value === 0)

  /**
   * 设置音量
   * 设置音频播放音量，范围在 0-1 之间
   * @param volume 音量值（0-1）
   * @example
   * setVolume(0.5) // 设置音量为 50%
   */
  function setVolume(volume: number) {
    audioElement.volume = volume
    volumeRef.value = volume
    onVolumeUpdateEv.trigger(audioElement, volume)
  }

  /**
   * 设置静音状态
   * 静音时缓存当前音量，取消静音时恢复
   * @param muted 是否静音，默认为 true
   * @example
   * setMuted(true)  // 静音
   * setMuted(false) // 取消静音
   */
  function setMuted(muted = true) {
    if (muted) {
      volumeCache = Math.max(0.1, volumeRef.value)
      onMutedEv.trigger(audioElement)
      setVolume(0)
    }
    else {
      setVolume(volumeCache)
    }
  }

  /**
   * 切换静音状态
   * 在静音和非静音之间切换
   * @example
   * toggleMute() // 切换静音状态
   */
  function toggleMute() {
    setMuted(!muted.value)
  }

  const playbackRateRef = ref(defaultPlaybackRate)

  /**
   * 设置播放速率
   * 设置音频播放速度，1.0 为正常速度
   * @param playbackRate 播放速率
   * @example
   * setPlaybackRate(1.5) // 1.5 倍速播放
   * setPlaybackRate(0.5) // 0.5 倍速播放
   */
  function setPlaybackRate(playbackRate: number) {
    audioElement.playbackRate = playbackRate
  }

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

  /**
   * 播放音频
   * 加载并播放指定 URL 的音频文件
   * @param url 音频地址
   * @example
   * play('https://example.com/audio.mp3')
   */
  async function play(url: string) {
    stop()
    urlRef.value = url
    audioElement.src = url
    audioElement.load()
    await audioElement.play()
  }

  /**
   * 停止音频
   * 停止播放并重置到开始位置
   * @example
   * stop() // 停止播放
   */
  function stop() {
    audioElement.currentTime = 0
    audioElement.pause()
  }

  /**
   * 暂停音频
   * 暂停当前播放
   * @example
   * pause() // 暂停播放
   */
  function pause() {
    if (audioElement.paused) {
      return
    }
    audioElement.pause()
  }

  /**
   * 恢复播放
   * 从暂停位置恢复播放
   * @example
   * resume() // 恢复播放
   */
  function resume() {
    if (!audioElement.paused) {
      return
    }

    audioElement.play()
  }

  /**
   * 切换播放/暂停状态
   * 根据当前状态切换播放或暂停
   * @example
   * toggle() // 切换播放/暂停
   */
  function toggle() {
    audioElement.paused ? resume() : pause()
  }

  /**
   * 设置当前播放时间
   * 跳转到指定时间位置
   * @param time 时间（秒）
   * @example
   * setCurrentTime(30) // 跳转到 30 秒处
   */
  function setCurrentTime(time: number) {
    audioElement.currentTime = time
    currentTimeAndProgressEffect()
  }

  /**
   * 设置播放进度
   * 根据百分比设置播放位置
   * @param progress 进度（0-100）
   * @example
   * setProgress(50) // 跳转到 50% 位置
   */
  function setProgress(progress: number) {
    const currentTime = Number(((progress / 100) * audioElement.duration).toFixed(2))
    audioElement.currentTime = nanAble(currentTime)
    currentTimeAndProgressEffect()
  }

  function currentTimeAndProgressEffect() {
    const currentTime = timeUpdateFormat(audioElement.currentTime)
    currentTimeRef.value = currentTime
    const progress = Number(((currentTime / audioElement.duration) * 100).toFixed(2))
    progressRef.value = nanAble(progress)
  }

  const { resume: rafResume, pause: rafPause } = useRafFn((arg) => {
    onTimeUpdateRafEv.trigger(audioElement, {
      currentTime: currentTimeRef.value,
      progress: progressRef.value,
    }, arg)
  }, { immediate: false })

  onTimeUpdateRafEv.on(() => {
    currentTimeAndProgressEffect()
  })

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

  useEventListener(audioElement, 'ratechange', onRateChange)
  useEventListener(audioElement, 'playing', onPlaying)
  useEventListener(audioElement, 'pause', onPause)
  useEventListener(audioElement, 'ended', onEnded)
  useEventListener(audioElement, 'timeupdate', onTimeUpdate)
  useEventListener(audioElement, 'durationchange', onDurationChange)
  useEventListener(audioElement, 'canplay', onCanplay)

  /**
   * 销毁音频元素
   * 清理音频资源
   * @example
   * destroy() // 销毁音频元素
   */
  function destroy() {
    audioElement.remove()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    volume: readonly(volumeRef),
    setVolume,
    muted: readonly(muted),
    setMuted,
    toggleMute,
    playbackRate: readonly(playbackRateRef),
    setPlaybackRate,
    playing: readonly(playingRef),
    paused: readonly(pausedRef),
    ended: readonly(endedRef),
    currentTime: readonly(currentTimeRef),
    currentTimeText,
    setCurrentTime,
    duration: readonly(durationRef),
    durationText,
    progress: readonly(progressRef),
    setProgress,
    cachedDuration: readonly(cachedDurationRef),
    cachedDurationText,
    cachedProgress: readonly(cachedProgressRef),
    url: readonly(urlRef),
    play,
    pause,
    resume,
    stop,
    toggle,
    onVolumeUpdate: onVolumeUpdateEv.on,
    onMuted: onMutedEv.on,
    onRateUpdate: onRateUpdateEv.on,
    onTimeUpdate: onTimeUpdateEv.on,
    onTimeUpdateRaf: onTimeUpdateRafEv.on,
    onDurationUpdate: onDurationUpdateEv.on,
    onPlaying: onPlayingEv.on,
    onPaused: onPausedEv.on,
    onEnded: onEndedEv.on,
  }
}

/**
 * useAudio 函数的返回类型
 * 包含音频元素、状态、方法和事件钩子
 * @example
 * const audio: UseAudioReturns = useAudio('https://example.com/audio.mp3')
 */
export type UseAudioReturns = ReturnType<typeof useAudio>
