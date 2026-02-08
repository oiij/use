import type { UseRafFnCallbackArguments } from '@vueuse/core'
import { createEventHook, useEventListener, useRafFn } from '@vueuse/core'
import { computed, onUnmounted, readonly, ref } from 'vue'

/**
 * 格式化时间为 MM:SS 格式
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 处理可能为 NaN 的数值，将其转换为 0
 * @param val 数值
 * @returns 处理后的值
 */
function nanAble(val: number) {
  return Number.isNaN(val) ? 0 : val
}

/**
 * 音频配置选项
 */
type Options = {
  /** 音量，默认值为 1 */
  volume?: number
  /** 播放速率，默认值为 1 */
  playbackRate?: number
  /** 是否自动播放，默认值为 true */
  autoPlay?: boolean
  /** 是否循环播放，默认值为 true */
  loop?: boolean
  /** 时间更新格式化函数，默认返回原始时间 */
  timeUpdateFormat?: (time: number) => number
}

/**
 * 音频控制组合式函数
 * @param src 音频源地址
 * @param options 配置选项
 * @returns 音频控制对象
 *
 * @example
 * ```ts
 * import { useAudio } from '@/use-audio'
 *
 * // 基本用法
 * const audio = useAudio('https://example.com/audio.mp3', {
 *   volume: 0.7,
 *   autoPlay: false,
 *   loop: true
 * })
 *
 * // 播放音频
 * audio.play('https://example.com/audio.mp3')
 *
 * // 暂停音频
 * audio.pause()
 *
 * // 调整音量
 * audio.setVolume(0.5)
 *
 * // 监听事件
 * audio.onPlaying(() => {
 *   console.log('音频开始播放')
 * })
 * ```
 */
export function useAudio(src?: string, options?: Options) {
  // 默认配置
  const {
    volume: defaultVolume = 1,
    playbackRate: defaultPlaybackRate = 1,
    autoPlay = true,
    loop = true,
    timeUpdateFormat = (time: number) => time,
  } = options ?? {}

  // 创建音频元素
  const audioElement = new Audio()
  audioElement.crossOrigin = 'anonymous'
  audioElement.autoplay = autoPlay
  audioElement.loop = loop

  // 如果提供了 src，则设置并加载
  if (src) {
    audioElement.src = src
    audioElement.load()
  }

  // 事件钩子
  const onVolumeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onMutedEv = createEventHook<[HTMLAudioElement]>()
  const onRateUpdateEv = createEventHook<[HTMLAudioElement]>()
  const onPlayingEv = createEventHook<[HTMLAudioElement]>()
  const onPausedEv = createEventHook<[HTMLAudioElement]>()
  const onEndedEv = createEventHook<[HTMLAudioElement]>()
  const onTimeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onTimeUpdateRafEv = createEventHook<[HTMLAudioElement, { currentTime: number, progress: number }, UseRafFnCallbackArguments]>()
  const onDurationUpdateEv = createEventHook<[HTMLAudioElement, number]>()

  // 音量控制
  const volumeRef = ref(defaultVolume)
  let volumeCache: number = defaultVolume
  const muted = computed(() => volumeRef.value === 0)

  /**
   * 设置音量
   * @param volume 音量值，范围 0-1
   */
  function setVolume(volume: number) {
    audioElement.volume = volume
    volumeRef.value = volume
    onVolumeUpdateEv.trigger(audioElement, volume)
  }

  /**
   * 设置静音状态
   * @param muted 是否静音
   */
  function setMuted(muted = true) {
    if (muted) {
      // 缓存当前音量，最小为 0.1
      volumeCache = Math.max(0.1, volumeRef.value)
      onMutedEv.trigger(audioElement)
      setVolume(0)
    }
    else {
      // 恢复缓存的音量
      setVolume(volumeCache)
    }
  }

  /**
   * 切换静音状态
   */
  function toggleMute() {
    setMuted(!muted.value)
  }

  // 播放速率控制
  const playbackRateRef = ref(defaultPlaybackRate)

  /**
   * 设置播放速率
   * @param playbackRate 播放速率
   */
  function setPlaybackRate(playbackRate: number) {
    audioElement.playbackRate = playbackRate
  }

  // 状态引用
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
   * @param url 音频地址
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
   */
  function stop() {
    audioElement.currentTime = 0
    audioElement.pause()
  }

  /**
   * 暂停音频
   */
  function pause() {
    if (audioElement.paused) {
      return
    }
    audioElement.pause()
  }

  /**
   * 恢复播放
   */
  function resume() {
    if (!audioElement.paused) {
      return
    }

    audioElement.play()
  }

  /**
   * 切换播放/暂停状态
   */
  function toggle() {
    audioElement.paused ? resume() : pause()
  }

  /**
   * 设置当前播放时间
   * @param time 时间（秒）
   */
  function setCurrentTime(time: number) {
    audioElement.currentTime = time
    currentTimeAndProgressEffect()
  }

  /**
   * 设置播放进度
   * @param progress 进度（百分比）
   */
  function setProgress(progress: number) {
    const currentTime = Number(((progress / 100) * audioElement.duration).toFixed(2))
    audioElement.currentTime = nanAble(currentTime)
    currentTimeAndProgressEffect()
  }

  /**
   * 更新当前时间和进度
   * 内部函数，用于同步音频元素的时间和进度到响应式引用
   */
  function currentTimeAndProgressEffect() {
    const currentTime = timeUpdateFormat(audioElement.currentTime)
    currentTimeRef.value = currentTime
    const progress = Number(((currentTime / audioElement.duration) * 100).toFixed(2))
    progressRef.value = nanAble(progress)
  }

  // RAF 计时器，用于平滑更新时间和进度
  const { resume: rafResume, pause: rafPause } = useRafFn((arg) => {
    onTimeUpdateRafEv.trigger(audioElement, {
      currentTime: currentTimeRef.value,
      progress: progressRef.value,
    }, arg)
  }, { immediate: false })

  // 监听 RAF 事件，更新时间和进度
  onTimeUpdateRafEv.on(() => {
    currentTimeAndProgressEffect()
  })

  // 事件监听器
  /**
   * 播放速率变化事件处理
   */
  function onRateChange() {
    playbackRateRef.value = audioElement.playbackRate
    onRateUpdateEv.trigger(audioElement)
  }

  /**
   * 开始播放事件处理
   */
  function onPlaying() {
    playingRef.value = true
    pausedRef.value = false
    endedRef.value = false
    rafResume()
    onPlayingEv.trigger(audioElement)
  }

  /**
   * 暂停事件处理
   */
  function onPause() {
    playingRef.value = false
    pausedRef.value = true
    endedRef.value = false
    rafPause()
    onPausedEv.trigger(audioElement)
  }

  /**
   * 播放结束事件处理
   */
  function onEnded() {
    playingRef.value = false
    pausedRef.value = false
    endedRef.value = true
    rafPause()
    onEndedEv.trigger(audioElement)
  }

  /**
   * 时间更新事件处理
   */
  function onTimeUpdate() {
    onTimeUpdateEv.trigger(audioElement, currentTimeRef.value)
  }

  /**
   * 时长变化事件处理
   */
  function onDurationChange() {
    const duration = audioElement.duration
    durationRef.value = nanAble(duration)
    onDurationUpdateEv.trigger(audioElement, durationRef.value)
  }

  /**
   * 可播放事件处理，更新缓存时长和进度
   */
  function onCanplay() {
    const duration = audioElement.buffered.end(Math.max(0, audioElement.buffered.length - 1))
    cachedDurationRef.value = nanAble(duration)
    cachedProgressRef.value = nanAble(Number((duration / audioElement.duration * 100).toFixed(2)))
  }

  // 注册事件监听器
  useEventListener(audioElement, 'ratechange', onRateChange)
  useEventListener(audioElement, 'playing', onPlaying)
  useEventListener(audioElement, 'pause', onPause)
  useEventListener(audioElement, 'ended', onEnded)
  useEventListener(audioElement, 'timeupdate', onTimeUpdate)
  useEventListener(audioElement, 'durationchange', onDurationChange)
  useEventListener(audioElement, 'canplay', onCanplay)

  /**
   * 销毁音频元素
   */
  function destroy() {
    audioElement.remove()
  }

  // 组件卸载时销毁音频元素
  onUnmounted(() => {
    destroy()
  })

  return {
    // 音量控制
    volume: readonly(volumeRef),
    setVolume,
    muted: readonly(muted),
    setMuted,
    toggleMute,

    // 播放速率控制
    playbackRate: readonly(playbackRateRef),
    setPlaybackRate,

    // 状态
    playing: readonly(playingRef),
    paused: readonly(pausedRef),
    ended: readonly(endedRef),

    // 时间和进度
    currentTime: readonly(currentTimeRef),
    currentTimeText,
    setCurrentTime,
    duration: readonly(durationRef),
    durationText,
    progress: readonly(progressRef),
    setProgress,

    // 缓存信息
    cachedDuration: readonly(cachedDurationRef),
    cachedDurationText,
    cachedProgress: readonly(cachedProgressRef),

    // 其他
    url: readonly(urlRef),
    play,
    pause,
    resume,
    stop,
    toggle,

    // 事件
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
 */
export type UseAudioReturns = ReturnType<typeof useAudio>
