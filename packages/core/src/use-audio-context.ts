import { tryOnScopeDispose, useEventListener } from '@vueuse/core'
import { readonly } from 'vue'
import { createAudioElementPlayback } from './_audio-element-playback'
import {
  clampVolume,
  connectFiltersInSeries,
  createEQFilters,
  DEFAULT_FADE_DURATION,
  EQ_FREQUENCIES,
} from './_audio-shared'

/**
 * 音频上下文淡入淡出选项
 * @example
 * const fadeOptions: AudioContextFadeOptions = {
 *   fade: true,
 *   duration: 1.0
 * }
 */
export type AudioContextFadeOptions = {
  /** 是否启用淡入淡出效果，默认为 false */
  fade?: boolean
  /** 淡入淡出持续时间（秒），默认为 0.5 */
  duration?: number
}

/**
 * 音频上下文配置选项
 * @example
 * const options: AudioContextOptions = {
 *   volume: 0.7,
 *   playbackRate: 1.0,
 *   fade: true,
 *   timeUpdateFormat: (time) => Math.floor(time)
 * }
 */
export type AudioContextOptions = {
  /** 初始音量（0-1），默认为 1 */
  volume?: number
  /** 初始播放速率，默认为 1 */
  playbackRate?: number
  /** 淡入淡出配置，默认为 false */
  fade?: AudioContextFadeOptions | boolean
  /** 时间更新格式化函数，默认为 (time) => time */
  timeUpdateFormat?: (time: number) => number
}

/**
 * 音频上下文管理
 * 提供音频播放控制、音量管理、均衡器调节、频率分析等功能
 *
 * @param options 配置选项
 * @returns 音频上下文管理对象
 *
 * @example
 * // 基本用法
 * const {
 *   volume,
 *   setVolume,
 *   muted,
 *   toggleMute,
 *   playing,
 *   play,
 *   pause,
 *   resume,
 *   stop,
 *   toggle
 * } = useAudioContext({
 *   volume: 0.7,
 *   fade: true
 * })
 *
 * play('https://example.com/audio.mp3')
 *
 * @example
 * // 监听音频事件
 * const { onPlaying, onPaused, onEnded, onVolumeUpdate } = useAudioContext()
 *
 * onPlaying((audioElement) => {
 *   console.log('开始播放')
 * })
 *
 * onVolumeUpdate((audioElement, volume) => {
 *   console.log('音量变化:', volume)
 * })
 *
 * @example
 * // 使用均衡器
 * const { setEQFrequency, getEQFrequencies, getFrequencyData } = useAudioContext()
 *
 * setEQFrequency(0, 10) // 提升 32Hz 频率
 * const eqSettings = getEQFrequencies()
 * const frequencyData = getFrequencyData()
 */
export function useAudioContext(options?: AudioContextOptions) {
  const { volume: defaultVolume = 1, playbackRate: defaultPlaybackRate = 1, fade, timeUpdateFormat } = options ?? {}

  const defaultFadeOptions = typeof fade === 'boolean' && fade
    ? { fade: true, duration: DEFAULT_FADE_DURATION }
    : fade ?? {}

  const audioContext = new AudioContext()

  const audioElement = new Audio()
  audioElement.crossOrigin = 'anonymous'

  const sourceNode = audioContext.createMediaElementSource(audioElement)

  const gainNode = audioContext.createGain()

  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048

  const filters = createEQFilters(audioContext)
  const filterNode = connectFiltersInSeries(filters, sourceNode)

  filterNode.connect(analyserNode)
  analyserNode.connect(gainNode)
  gainNode.connect(audioContext.destination)

  const playback = createAudioElementPlayback({
    audioElement,
    defaultVolume,
    defaultPlaybackRate,
    timeUpdateFormat,
    applyVolume: (v) => {
      gainNode.gain.cancelScheduledValues(audioContext.currentTime)
      gainNode.gain.setValueAtTime(v, audioContext.currentTime)
    },
    initVolume: (v) => {
      gainNode.gain.value = v
    },
  })

  const {
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
    onVolumeUpdateEv,
    onMutedEv,
    onRateUpdateEv,
    onPlayingEv,
    onPausedEv,
    onEndedEv,
    onTimeUpdateEv,
    onTimeUpdateRafEv,
    onDurationUpdateEv,
    setVolume,
    setMuted,
    toggleMute,
    setPlaybackRate,
    setCurrentTime,
    setProgress,
    onRateChange,
    onPlaying,
    onPause,
    onEnded,
    onTimeUpdate,
    onDurationChange,
    onCanplay,
  } = playback

  /**
   * 播放音频
   * 加载并播放指定 URL 的音频文件
   * @param url 音频 URL
   * @example
   * play('https://example.com/audio.mp3')
   */
  async function play(url: string) {
    stop()
    urlRef.value = url
    audioElement.src = url
    audioElement.load()
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
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
   * 执行淡出效果并暂停音频
   * 使用 exponentialRamp 实现更平滑的衰减
   * @param duration 淡出持续时间（秒）
   */
  function fadeOutAndPause(duration: number) {
    const currentTime = audioContext.currentTime
    gainNode.gain.cancelScheduledValues(currentTime)
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
    gainNode.gain.setValueAtTime(0.0001, currentTime + 0.001)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration)
    setTimeout(() => {
      audioElement.pause()
      gainNode.gain.cancelScheduledValues(audioContext.currentTime)
      gainNode.gain.setValueAtTime(volumeRef.value, audioContext.currentTime)
    }, duration * 1000)
  }

  /**
   * 执行淡入效果并恢复播放
   * 使用 exponentialRamp 实现更自然的渐强
   * @param duration 淡入持续时间（秒）
   */
  function fadeInAndResume(duration: number) {
    const currentTime = audioContext.currentTime
    gainNode.gain.cancelScheduledValues(currentTime)
    gainNode.gain.setValueAtTime(0.0001, currentTime)
    gainNode.gain.exponentialRampToValueAtTime(clampVolume(volumeRef.value), currentTime + duration)
    setTimeout(() => {
      audioElement.play()
    }, duration * 1000)
  }

  /**
   * 暂停音频
   * 暂停当前播放，支持淡入淡出效果
   * @param options 暂停选项，包含 fade 和 duration
   * @example
   * pause() // 直接暂停
   * pause({ fade: true, duration: 1.0 }) // 带淡出的暂停
   */
  function pause(options?: AudioContextFadeOptions) {
    const { fade = false, duration = DEFAULT_FADE_DURATION } = { ...defaultFadeOptions, ...options }
    if (audioElement.paused) {
      return
    }
    if (fade) {
      fadeOutAndPause(duration)
      return
    }
    audioElement.pause()
  }

  /**
   * 恢复播放
   * 从暂停位置恢复播放，支持淡入效果
   * @param options 恢复选项，包含 fade 和 duration
   * @example
   * resume() // 直接恢复
   * resume({ fade: true, duration: 1.0 }) // 带淡入的恢复
   */
  function resume(options?: AudioContextFadeOptions) {
    const { fade = false, duration = DEFAULT_FADE_DURATION } = { ...defaultFadeOptions, ...options }
    if (!audioElement.paused) {
      return
    }
    if (fade) {
      fadeInAndResume(duration)
      return
    }
    audioElement.play()
  }

  /**
   * 切换播放/暂停状态
   * 根据当前状态切换播放或暂停
   * @param options 切换选项，包含 fade 和 duration
   * @example
   * toggle() // 切换播放/暂停
   * toggle({ fade: true }) // 带淡入淡出的切换
   */
  function toggle(options?: AudioContextFadeOptions) {
    audioElement.paused ? resume(options) : pause(options)
  }

  useEventListener(audioElement, 'ratechange', onRateChange)
  useEventListener(audioElement, 'playing', onPlaying)
  useEventListener(audioElement, 'pause', onPause)
  useEventListener(audioElement, 'ended', onEnded)
  useEventListener(audioElement, 'timeupdate', onTimeUpdate)
  useEventListener(audioElement, 'durationchange', onDurationChange)
  useEventListener(audioElement, 'canplay', onCanplay)

  /**
   * 销毁音频上下文
   * 断开所有音频节点并关闭上下文
   * @example
   * destroy() // 销毁音频上下文
   */
  function destroy() {
    sourceNode.disconnect()
    gainNode.disconnect()
    analyserNode.disconnect()
    filterNode.disconnect()
    audioContext.close()
    audioElement.remove()
  }

  /**
   * 获取频率数据
   * 获取当前音频的频率分析数据，用于可视化
   * @returns 频率数据数组（0-255）
   * @example
   * const frequencyData = getFrequencyData()
   * // 使用频率数据绘制可视化效果
   */
  function getFrequencyData() {
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(frequencyData)
    return frequencyData
  }

  /**
   * 设置均衡器频率增益
   * 调节指定频率点的增益值
   * @param index 频率索引（0-9，对应 EQ_FREQUENCIES）
   * @param value 增益值（-40 到 40 dB）
   * @example
   * setEQFrequency(0, 10)  // 提升 32Hz
   * setEQFrequency(5, -5)  // 降低 1000Hz
   */
  function setEQFrequency(index: number, value: number) {
    if (filters[index]) {
      filters[index].gain.value = value
    }
  }

  /**
   * 获取均衡器频率增益
   * 获取指定频率点的当前增益值
   * @param index 频率索引（0-9）
   * @returns 增益值（dB）
   * @example
   * const gain = getEQFrequency(0)
   * console.log('32Hz 增益:', gain)
   */
  function getEQFrequency(index: number) {
    return filters[index]?.gain.value ?? 0
  }

  /**
   * 获取所有均衡器频率和增益
   * 获取完整的均衡器设置列表
   * @returns 均衡器频率和增益数组
   * @example
   * const eqSettings = getEQFrequencies()
   * eqSettings.forEach(({ frequency, gain }) => {
   *   console.log(`${frequency}Hz: ${gain}dB`)
   * })
   */
  function getEQFrequencies() {
    return EQ_FREQUENCIES.map((freq, index) => ({
      frequency: freq,
      gain: getEQFrequency(index),
    }))
  }

  tryOnScopeDispose(() => {
    destroy()
  })

  return {
    eqFrequencies: EQ_FREQUENCIES,
    audioContext,
    audioElement,
    sourceNode,
    gainNode,
    analyserNode,
    filters,
    filterNode,
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
    getFrequencyData,
    setEQFrequency,
    getEQFrequency,
    getEQFrequencies,
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
 * useAudioContext 返回类型
 * 包含音频上下文、音频元素、节点、状态、方法和事件钩子
 * @example
 * const audio: UseAudioContextReturns = useAudioContext()
 */
export type UseAudioContextReturns = ReturnType<typeof useAudioContext>
