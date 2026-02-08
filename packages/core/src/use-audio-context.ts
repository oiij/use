import type { UseRafFnCallbackArguments } from '@vueuse/core'
import { createEventHook, useEventListener, useRafFn } from '@vueuse/core'
import { computed, onUnmounted, readonly, ref } from 'vue'

// 默认淡入淡出持续时间（秒）
const DEFAULT_FADE_DURATION = 0.5
// 最小音量缓存值，用于静音时保存音量
const MIN_VOLUME_CACHE = 0.1

// 均衡器频率点（Hz）
const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const

/**
 * 音频上下文淡入淡出选项
 */
export type AudioContextFadeOptions = {
  // 是否启用淡入淡出效果
  fade?: boolean
  // 淡入淡出持续时间（秒）
  duration?: number
}

/**
 * 音频上下文配置选项
 */
export type AudioContextOptions = {
  // 初始音量（0-1）
  volume?: number
  // 初始播放速率
  playbackRate?: number
  // 淡入淡出配置
  fade?: AudioContextFadeOptions | boolean
  // 时间更新格式化函数
  timeUpdateFormat?: (time: number) => number
}

/**
 * 格式化时间为 MM:SS 格式
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 处理可能的 NaN 值，将其转换为 0
 * @param val 数值
 * @returns 处理后的值
 */
function nanAble(val: number) {
  return Number.isNaN(val) ? 0 : val
}

/**
 * 音频上下文管理
 * @param options 配置选项
 * @returns 音频上下文管理对象
 * @example
 * ```ts
 * const {
 *   volume,
 *   setVolume,
 *   muted,
 *   setMuted,
 *   toggleMute,
 *   playing,
 *   paused,
 *   ended,
 *   currentTime,
 *   setCurrentTime,
 *   duration,
 *   progress,
 *   setProgress,
 *   play,
 *   pause,
 *   resume,
 *   stop,
 *   toggle,
 *   onVolumeUpdate,
 *   onPlaying,
 *   onPaused,
 *   onEnded
 * } = useAudioContext({
 *   volume: 0.7,
 *   fade: true
 * })
 *
 * // 播放音频
 * play('https://example.com/audio.mp3')
 *
 * // 暂停音频（带淡入淡出）
 * pause({ fade: true, duration: 1 })
 *
 * // 监听音量变化
 * onVolumeUpdate((audioElement, volume) => {
 *   console.log('音量变化:', volume)
 * })
 * ```
 */
export function useAudioContext(options?: AudioContextOptions) {
  const {
    volume: defaultVolume = 1,
    playbackRate: defaultPlaybackRate = 1,
    fade,
    timeUpdateFormat = (time: number) => time,
  } = options ?? {}

  // 处理淡入淡出配置
  const defaultFadeOptions = typeof fade === 'boolean' && fade
    ? { fade: true, duration: DEFAULT_FADE_DURATION }
    : fade ?? {}

  // 创建音频上下文
  const audioContext = new AudioContext()

  // 创建音频元素
  const audioElement = new Audio()
  audioElement.crossOrigin = 'anonymous'

  // 创建媒体元素源节点
  const sourceNode = audioContext.createMediaElementSource(audioElement)

  // 创建增益节点（用于音量控制）
  const gainNode = audioContext.createGain()

  // 创建分析器节点（用于获取频率数据）
  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048

  // 创建均衡器滤波器节点
  const filters = EQ_FREQUENCIES.map((freq) => {
    const filter = audioContext.createBiquadFilter()
    filter.type = 'peaking' // 峰值滤波器
    filter.frequency.value = freq // 频率
    filter.Q.value = 1 // 品质因数
    filter.gain.value = 0 // 增益（默认0，无变化）
    return filter
  })

  /**
   * 创建滤波器节点链
   * @returns 最终的滤波器节点
   */
  function createFilterNode() {
    let filterNode: AudioNode = sourceNode
    filters.forEach((filter) => {
      filterNode.connect(filter)
      filterNode = filter
    })
    return filterNode as BiquadFilterNode
  }

  const filterNode = createFilterNode()

  // 连接音频节点链
  filterNode.connect(analyserNode)
  analyserNode.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // 创建事件钩子
  const onVolumeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onMutedEv = createEventHook<[HTMLAudioElement]>()
  const onRateUpdateEv = createEventHook<[HTMLAudioElement]>()
  const onPlayingEv = createEventHook<[HTMLAudioElement]>()
  const onPausedEv = createEventHook<[HTMLAudioElement]>()
  const onEndedEv = createEventHook<[HTMLAudioElement]>()
  const onTimeUpdateEv = createEventHook<[HTMLAudioElement, number]>()
  const onTimeUpdateRafEv = createEventHook<[HTMLAudioElement, { currentTime: number, progress: number }, UseRafFnCallbackArguments]>()
  const onDurationUpdateEv = createEventHook<[HTMLAudioElement, number]>()

  // 音量相关状态
  const volumeRef = ref(defaultVolume)
  let volumeCache: number = defaultVolume
  const muted = computed(() => volumeRef.value === 0)
  gainNode.gain.value = volumeRef.value

  /**
   * 设置音量
   * @param volume 音量值（0-1）
   */
  function setVolume(volume: number) {
    // 限制音量范围在 0-1 之间
    const clampedVolume = Math.max(0, Math.min(1, volume))
    // 取消之前的音量调度
    gainNode.gain.cancelScheduledValues(audioContext.currentTime)
    // 设置当前音量
    gainNode.gain.setValueAtTime(clampedVolume, audioContext.currentTime)
    // 更新音量状态
    volumeRef.value = clampedVolume
    // 触发音量更新事件
    onVolumeUpdateEv.trigger(audioElement, clampedVolume)
  }

  /**
   * 设置静音状态
   * @param muted 是否静音
   */
  function setMuted(muted = true) {
    if (muted) {
      // 缓存当前音量（最小为 MIN_VOLUME_CACHE）
      volumeCache = Math.max(MIN_VOLUME_CACHE, volumeRef.value)
      // 触发静音事件
      onMutedEv.trigger(audioElement)
      // 设置音量为 0
      setVolume(0)
    }
    else {
      // 恢复之前缓存的音量
      setVolume(volumeCache)
    }
  }

  /**
   * 切换静音状态
   */
  function toggleMute() {
    setMuted(!muted.value)
  }

  // 播放速率相关状态
  const playbackRateRef = ref(defaultPlaybackRate)

  /**
   * 设置播放速率
   * @param playbackRate 播放速率
   */
  function setPlaybackRate(playbackRate: number) {
    audioElement.playbackRate = playbackRate
  }

  // 播放状态相关
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
   * @param url 音频 URL
   */
  async function play(url: string) {
    // 停止当前播放
    stop()
    // 更新 URL
    urlRef.value = url
    // 设置音频源
    audioElement.src = url
    // 加载音频
    audioElement.load()
    // 如果音频上下文被挂起，恢复它
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
    // 播放音频
    await audioElement.play()
  }

  /**
   * 停止音频
   */
  function stop() {
    // 重置当前时间
    audioElement.currentTime = 0
    // 暂停音频
    audioElement.pause()
  }

  /**
   * 暂停音频
   * @param options 暂停选项
   */
  function pause(options?: AudioContextFadeOptions) {
    // 合并默认选项和传入选项
    const { fade = false, duration = DEFAULT_FADE_DURATION } = { ...defaultFadeOptions, ...options }
    // 如果已经暂停，直接返回
    if (audioElement.paused) {
      return
    }
    // 如果启用淡入淡出
    if (fade) {
      const currentTime = audioContext.currentTime
      // 取消之前的音量调度
      gainNode.gain.cancelScheduledValues(currentTime)
      // 设置当前音量
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
      // 线性渐变到音量 0
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration)
      // 延迟暂停
      setTimeout(() => {
        audioElement.pause()
        // 恢复音量设置
        gainNode.gain.setValueAtTime(volumeRef.value, currentTime + 10)
      }, duration * 1000)
      return
    }
    // 直接暂停
    audioElement.pause()
  }

  /**
   * 恢复播放
   * @param options 恢复选项
   */
  function resume(options?: AudioContextFadeOptions) {
    // 合并默认选项和传入选项
    const { fade = false, duration = DEFAULT_FADE_DURATION } = { ...defaultFadeOptions, ...options }
    // 如果已经在播放，直接返回
    if (!audioElement.paused) {
      return
    }
    // 如果启用淡入淡出
    if (fade) {
      const currentTime = audioContext.currentTime
      // 取消之前的音量调度
      gainNode.gain.cancelScheduledValues(currentTime)
      // 设置当前音量为 0
      gainNode.gain.setValueAtTime(0, currentTime)
      // 线性渐变到目标音量
      gainNode.gain.linearRampToValueAtTime(volumeRef.value, currentTime + duration)
      // 延迟播放
      setTimeout(() => {
        audioElement.play()
      }, duration * 1000)
      return
    }
    // 直接播放
    audioElement.play()
  }

  /**
   * 切换播放/暂停状态
   * @param options 切换选项
   */
  function toggle(options?: AudioContextFadeOptions) {
    audioElement.paused ? resume(options) : pause(options)
  }

  /**
   * 设置当前播放时间
   * @param time 时间（秒）
   */
  function setCurrentTime(time: number) {
    audioElement.currentTime = time
    // 更新当前时间和进度
    currentTimeAndProgressEffect()
  }

  /**
   * 设置播放进度
   * @param progress 进度（0-100）
   */
  function setProgress(progress: number) {
    // 计算目标时间
    const currentTime = Number(((progress / 100) * audioElement.duration).toFixed(2))
    // 设置当前时间
    audioElement.currentTime = nanAble(currentTime)
    // 更新当前时间和进度
    currentTimeAndProgressEffect()
  }

  /**
   * 更新当前时间和进度
   */
  function currentTimeAndProgressEffect() {
    // 格式化当前时间
    const currentTime = timeUpdateFormat(audioElement.currentTime)
    // 更新当前时间状态
    currentTimeRef.value = currentTime
    // 计算进度
    const progress = Number(((currentTime / audioElement.duration) * 100).toFixed(2))
    // 更新进度状态
    progressRef.value = nanAble(progress)
  }

  // 使用 RAF 监听时间更新
  const { resume: rafResume, pause: rafPause } = useRafFn((arg) => {
    // 触发时间更新 RAF 事件
    onTimeUpdateRafEv.trigger(audioElement, {
      currentTime: currentTimeRef.value,
      progress: progressRef.value,
    }, arg)
  }, { immediate: false })

  // 监听时间更新 RAF 事件
  onTimeUpdateRafEv.on(() => {
    // 更新当前时间和进度
    currentTimeAndProgressEffect()
  })

  /**
   * 播放速率变化回调
   */
  function onRateChange() {
    // 更新播放速率状态
    playbackRateRef.value = audioElement.playbackRate
    // 触发播放速率更新事件
    onRateUpdateEv.trigger(audioElement)
  }

  /**
   * 开始播放回调
   */
  function onPlaying() {
    // 更新播放状态
    playingRef.value = true
    pausedRef.value = false
    endedRef.value = false
    // 恢复 RAF
    rafResume()
    // 触发播放事件
    onPlayingEv.trigger(audioElement)
  }

  /**
   * 暂停回调
   */
  function onPause() {
    // 更新播放状态
    playingRef.value = false
    pausedRef.value = true
    endedRef.value = false
    // 暂停 RAF
    rafPause()
    // 触发暂停事件
    onPausedEv.trigger(audioElement)
  }

  /**
   * 播放结束回调
   */
  function onEnded() {
    // 更新播放状态
    playingRef.value = false
    pausedRef.value = false
    endedRef.value = true
    // 暂停 RAF
    rafPause()
    // 触发结束事件
    onEndedEv.trigger(audioElement)
  }

  /**
   * 时间更新回调
   */
  function onTimeUpdate() {
    // 触发时间更新事件
    onTimeUpdateEv.trigger(audioElement, currentTimeRef.value)
  }

  /**
   * 时长变化回调
   */
  function onDurationChange() {
    // 获取音频时长
    const duration = audioElement.duration
    // 更新时长状态
    durationRef.value = nanAble(duration)
    // 触发时长更新事件
    onDurationUpdateEv.trigger(audioElement, durationRef.value)
  }

  /**
   * 可播放回调
   */
  function onCanplay() {
    // 获取缓冲时长
    const duration = audioElement.buffered.end(Math.max(0, audioElement.buffered.length - 1))
    // 更新缓冲时长状态
    cachedDurationRef.value = nanAble(duration)
    // 计算缓冲进度
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
   * 销毁音频上下文
   */
  function destroy() {
    // 断开音频节点连接
    sourceNode.disconnect()
    gainNode.disconnect()
    analyserNode.disconnect()
    filterNode.disconnect()
    // 关闭音频上下文
    audioContext.close()
    // 移除音频元素
    audioElement.remove()
  }

  /**
   * 获取频率数据
   * @returns 频率数据数组
   */
  function getFrequencyData() {
    // 创建频率数据数组
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
    // 获取频率数据
    analyserNode.getByteFrequencyData(frequencyData)
    // 返回频率数据
    return frequencyData
  }

  /**
   * 设置均衡器频率增益
   * @param index 频率索引
   * @param value 增益值
   */
  function setEQFrequency(index: number, value: number) {
    filters[index].gain.value = value
  }

  /**
   * 获取均衡器频率增益
   * @param index 频率索引
   * @returns 增益值
   */
  function getEQFrequency(index: number) {
    return filters[index].gain.value
  }

  /**
   * 获取所有均衡器频率和增益
   * @returns 均衡器频率和增益数组
   */
  function getEQFrequencies() {
    return EQ_FREQUENCIES.map((freq, index) => ({
      frequency: freq,
      gain: getEQFrequency(index),
    }))
  }

  // 组件卸载时销毁音频上下文
  onUnmounted(() => {
    destroy()
  })

  return {
    // 均衡器频率点
    eqFrequencies: EQ_FREQUENCIES,
    // 音频上下文
    audioContext,
    // 音频元素
    audioElement,
    // 源节点
    sourceNode,
    // 增益节点
    gainNode,
    // 分析器节点
    analyserNode,
    // 滤波器数组
    filters,
    // 滤波器节点
    filterNode,
    // 音量（只读）
    volume: readonly(volumeRef),
    // 设置音量
    setVolume,
    // 是否静音（只读）
    muted: readonly(muted),
    // 设置静音
    setMuted,
    // 切换静音
    toggleMute,
    // 播放速率（只读）
    playbackRate: readonly(playbackRateRef),
    // 设置播放速率
    setPlaybackRate,
    // 是否正在播放（只读）
    playing: readonly(playingRef),
    // 是否暂停（只读）
    paused: readonly(pausedRef),
    // 是否结束（只读）
    ended: readonly(endedRef),
    // 当前时间（只读）
    currentTime: readonly(currentTimeRef),
    // 当前时间文本
    currentTimeText,
    // 设置当前时间
    setCurrentTime,
    // 总时长（只读）
    duration: readonly(durationRef),
    // 总时长文本
    durationText,
    // 进度（只读）
    progress: readonly(progressRef),
    // 设置进度
    setProgress,
    // 缓冲时长（只读）
    cachedDuration: readonly(cachedDurationRef),
    // 缓冲时长文本
    cachedDurationText,
    // 缓冲进度（只读）
    cachedProgress: readonly(cachedProgressRef),
    // 音频 URL（只读）
    url: readonly(urlRef),
    // 播放
    play,
    // 暂停
    pause,
    // 恢复
    resume,
    // 停止
    stop,
    // 切换播放/暂停
    toggle,
    // 获取频率数据
    getFrequencyData,
    // 设置均衡器频率增益
    setEQFrequency,
    // 获取均衡器频率增益
    getEQFrequency,
    // 获取所有均衡器频率和增益
    getEQFrequencies,
    // 音量更新事件
    onVolumeUpdate: onVolumeUpdateEv.on,
    // 静音事件
    onMuted: onMutedEv.on,
    // 播放速率更新事件
    onRateUpdate: onRateUpdateEv.on,
    // 时间更新事件
    onTimeUpdate: onTimeUpdateEv.on,
    // 时间更新 RAF 事件
    onTimeUpdateRaf: onTimeUpdateRafEv.on,
    // 时长更新事件
    onDurationUpdate: onDurationUpdateEv.on,
    // 开始播放事件
    onPlaying: onPlayingEv.on,
    // 暂停事件
    onPaused: onPausedEv.on,
    // 结束事件
    onEnded: onEndedEv.on,
  }
}

/**
 * useAudioContext 返回类型
 */
export type UseAudioContextReturns = ReturnType<typeof useAudioContext>
