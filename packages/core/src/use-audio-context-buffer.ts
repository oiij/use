import { createEventHook } from '@vueuse/core'
import { computed, onUnmounted, ref, shallowRef, watchEffect } from 'vue'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 淡入淡出选项
 */
export type AudioContextBufferFadeOptions = {
  /**
   * 是否启用淡入淡出
   * @default true
   */
  fade?: boolean
  /**
   * 淡入淡出持续时间（秒）
   * @default 1
   */
  duration?: number
}

/**
 * 音频上下文缓冲区配置选项
 */
export type AudioContextBufferOptions = {
  /**
   * 是否启用音频分析器
   */
  analyser?: boolean
  /**
   * 默认音量（0-100）
   * @default 80
   */
  volume?: number
  /**
   * 默认播放速率
   * @default 1
   */
  playbackRate?: number
  /**
   * 淡入淡出选项，可设置为布尔值或对象
   */
  fadeOptions?: AudioContextBufferFadeOptions | boolean
}

/**
 * 音频上下文缓冲区管理
 *
 * 用于管理音频缓冲区的加载、播放、暂停、停止等操作，支持音量控制、播放速率调整、均衡器等功能
 *
 * @param options 配置选项
 * @returns 返回的状态和方法
 *
 * @example
 * ```ts
 * const {
 *   volume,
 *   playing,
 *   paused,
 *   currentTime,
 *   duration,
 *   playBuffer,
 *   play,
 *   pause,
 *   resume,
 *   stop,
 *   toggle
 * } = useAudioContextBuffer({
 *   analyser: true,
 *   volume: 70,
 *   fadeOptions: { fade: true, duration: 0.5 }
 * })
 *
 * async function handlePlay() {
 *   const response = await fetch('audio.mp3')
 *   const arrayBuffer = await response.arrayBuffer()
 *   await playBuffer(new Uint8Array(arrayBuffer))
 * }
 * ```
 */
export function useAudioContextBuffer(options?: AudioContextBufferOptions) {
  const { analyser = false, volume: defaultVolume = 80, playbackRate: defaultPlaybackRate = 1, fadeOptions } = options ?? {}

  const eqFrequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

  const defaultFadeOptions = typeof fadeOptions === 'boolean' ? { fade: true, duration: 1 } : fadeOptions ?? {}

  const audioContext = new AudioContext()
  const audioBuffer = shallowRef<AudioBuffer>()
  const bufferSource = shallowRef<AudioBufferSourceNode | null>(null)
  const gainNode = audioContext.createGain()
  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048
  const bufferLength = analyserNode.frequencyBinCount
  const unit8Array = new Uint8Array(bufferLength)

  const filters = eqFrequencies.map((freq) => {
    const filter = audioContext.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = freq
    filter.Q.value = 1
    filter.gain.value = 0
    return filter
  })

  function createFilterNode() {
    let filterNode: AudioNode = gainNode
    filters.forEach((filter) => {
      filterNode.connect(filter)
      filterNode = filter
    })
    return filterNode as BiquadFilterNode
  }

  const filterNode = createFilterNode()

  gainNode.connect(filterNode)
  filterNode.connect(analyserNode)
  analyserNode.connect(audioContext.destination)

  const onVolumeUpdateEv = createEventHook<void>()
  const onRateUpdateEv = createEventHook<void>()
  const onPlayingEv = createEventHook<void>()
  const onPausedEv = createEventHook<void>()
  const onEndedEv = createEventHook<void>()
  const onTimeUpdateEv = createEventHook<void>()
  const onDurationUpdateEv = createEventHook<void>()
  const onByteTimeDomainDataEv = createEventHook<Uint8Array>()

  const status = ref<AudioContextState>(audioContext.state)
  audioContext.addEventListener('statechange', () => {
    status.value = audioContext.state
  })

  const playing = ref(false)
  const paused = ref(false)
  const ended = ref(false)

  const startFlag = ref(0)
  const pauseFlag = ref(0)

  const currentTimeRaw = ref(0)
  const currentTime = computed(() => formatTime(currentTimeRaw.value))
  const currentTimeText = computed(() => formatTime(currentTimeRaw.value))

  const durationRaw = ref(0)
  const duration = computed(() => formatTime(durationRaw.value))
  const durationText = computed(() => formatTime(durationRaw.value))

  const progressRaw = ref(0)
  const progress = computed(() => Number(progressRaw.value.toFixed(0)))

  const cachedDuration = ref(0)
  const cachedDurationText = computed(() => formatTime(cachedDuration.value))
  const cachedProgress = ref(0)

  const volume = ref(defaultVolume)
  gainNode.gain.value = volume.value / 100

  /**
   * 设置音量
   *
   * @param volume 音量值（0-100）
   *
   * @example
   * ```ts
   * const { setVolume } = useAudioContextBuffer()
   * setVolume(50)
   * ```
   */
  function setVolume(volume: number) {
    gainNode.gain.cancelScheduledValues(audioContext.currentTime)
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(100, volume)) / 100, audioContext.currentTime)
    onVolumeUpdateEv.trigger()
  }

  watchEffect(() => {
    setVolume(volume.value)
  })

  const detune = ref(0)
  watchEffect(() => {
    if (bufferSource.value) {
      bufferSource.value.detune.value = detune.value
    }
  })

  const playbackRate = ref(defaultPlaybackRate)

  /**
   * 设置播放速率
   *
   * @param playbackRate 播放速率
   *
   * @example
   * ```ts
   * const { setPlaybackRate } = useAudioContextBuffer()
   * setPlaybackRate(1.5)
   * ```
   */
  function setPlaybackRate(playbackRate: number) {
    if (bufferSource.value) {
      bufferSource.value.playbackRate.value = playbackRate
    }
    onRateUpdateEv.trigger()
  }

  watchEffect(() => {
    setPlaybackRate(playbackRate.value)
  })

  function getByteTimeDomainData() {
    if (analyser) {
      analyserNode.getByteTimeDomainData(unit8Array)
      onByteTimeDomainDataEv.trigger(unit8Array)
      requestAnimationFrame(getByteTimeDomainData)
    }
  }

  function updateDuration() {
    if (!playing.value || durationRaw.value === 0) {
      return
    }

    const _currentTime = audioContext.currentTime - startFlag.value
    if (_currentTime >= durationRaw.value) {
      playing.value = false
      ended.value = true
      onEndedEv.trigger()
      return
    }
    currentTimeRaw.value = _currentTime
    progressRaw.value = (_currentTime / durationRaw.value) * 100
    onTimeUpdateEv.trigger()
    requestAnimationFrame(updateDuration)
  }

  function createBufferSourceNode(audioBuffer: AudioBuffer) {
    const bufferSource = audioContext.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.detune.value = detune.value
    bufferSource.playbackRate.value = playbackRate.value
    bufferSource.connect(gainNode)

    bufferSource.onended = () => {
      playing.value = false
      ended.value = true
      onEndedEv.trigger()
    }

    return bufferSource
  }

  /**
   * 设置当前播放时间
   *
   * @param time 目标时间（秒）
   *
   * @example
   * ```ts
   * const { setCurrentTime } = useAudioContextBuffer()
   * setCurrentTime(30)
   * ```
   */
  function setCurrentTime(time: number) {
    if (audioBuffer.value) {
      const targetDuration = Math.max(0, Math.min(time, durationRaw.value))
      bufferSource.value?.stop()
      bufferSource.value = createBufferSourceNode(audioBuffer.value)
      bufferSource.value.start(0, targetDuration)
      startFlag.value = audioContext.currentTime - targetDuration
      currentTimeRaw.value = targetDuration
      if (!playing.value) {
        pauseFlag.value = targetDuration
        audioContext.suspend()
      }
    }
  }

  /**
   * 设置播放进度
   *
   * @param val 进度值（0-100）
   *
   * @example
   * ```ts
   * const { setProgress } = useAudioContextBuffer()
   * setProgress(50)
   * ```
   */
  function setProgress(val: number) {
    if (audioBuffer.value) {
      const targetDuration = (val / 100) * durationRaw.value
      setCurrentTime(targetDuration)
    }
  }

  /**
   * 播放音频缓冲区
   *
   * @param arrayBuffer 音频数据数组缓冲区
   * @returns Promise
   *
   * @example
   * ```ts
   * const { playBuffer } = useAudioContextBuffer()
   * const response = await fetch('audio.mp3')
   * const arrayBuffer = await response.arrayBuffer()
   * await playBuffer(new Uint8Array(arrayBuffer))
   * ```
   */
  async function playBuffer(arrayBuffer: Uint8Array) {
    try {
      audioBuffer.value = await audioContext.decodeAudioData(arrayBuffer.buffer as ArrayBuffer)
      cachedDuration.value = audioBuffer.value.duration
      cachedProgress.value = 100
      onDurationUpdateEv.trigger()
      play()
    }
    catch (error) {
      console.error('useAudioContextBuffer:playBuffer error:', error)
      throw error
    }
  }

  /**
   * 开始播放音频
   *
   * @example
   * ```ts
   * const { play } = useAudioContextBuffer()
   * play()
   * ```
   */
  function play() {
    if (audioBuffer.value) {
      bufferSource.value?.stop()
      bufferSource.value = createBufferSourceNode(audioBuffer.value)
      bufferSource.value.start(0)

      playing.value = true
      paused.value = false
      ended.value = false

      durationRaw.value = audioBuffer.value.duration
      startFlag.value = audioContext.currentTime
      pauseFlag.value = 0

      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      onPlayingEv.trigger()
      updateDuration()
    }
  }

  /**
   * 暂停播放
   *
   * @param options 淡入淡出选项
   *
   * @example
   * ```ts
   * const { pause } = useAudioContextBuffer()
   * pause()
   * pause({ fade: true, duration: 0.5 })
   * ```
   */
  function pause(options?: AudioContextBufferFadeOptions) {
    const { fade = true, duration = 1 } = options ?? defaultFadeOptions
    if (fade) {
      const currentTime = audioContext.currentTime
      gainNode.gain.cancelScheduledValues(currentTime)
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration)
      setTimeout(() => {
        audioContext.suspend()
        pauseFlag.value = audioContext.currentTime - startFlag.value
        playing.value = false
        paused.value = true
        onPausedEv.trigger()
      }, duration * 1000)
      return
    }
    audioContext.suspend()
    pauseFlag.value = audioContext.currentTime - startFlag.value
    playing.value = false
    paused.value = true
    onPausedEv.trigger()
  }

  /**
   * 恢复播放
   *
   * @param options 淡入淡出选项
   *
   * @example
   * ```ts
   * const { resume } = useAudioContextBuffer()
   * resume()
   * resume({ fade: true, duration: 0.5 })
   * ```
   */
  function resume(options?: AudioContextBufferFadeOptions) {
    if (ended.value) {
      play()
      return
    }
    const { fade = true, duration = 1 } = options ?? defaultFadeOptions
    if (fade) {
      const currentTime = audioContext.currentTime
      gainNode.gain.cancelScheduledValues(currentTime)
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(volume.value / 100, currentTime + duration)
      setTimeout(() => {
        audioContext.resume()
        startFlag.value = audioContext.currentTime - pauseFlag.value
        playing.value = true
        paused.value = false
        onPlayingEv.trigger()
        updateDuration()
      }, duration * 1000)
      return
    }
    audioContext.resume()
    startFlag.value = audioContext.currentTime - pauseFlag.value
    playing.value = true
    paused.value = false
    onPlayingEv.trigger()
    updateDuration()
  }

  /**
   * 停止播放
   *
   * @example
   * ```ts
   * const { stop } = useAudioContextBuffer()
   * stop()
   * ```
   */
  function stop() {
    bufferSource.value?.stop()
    pauseFlag.value = 0
    startFlag.value = 0
    currentTimeRaw.value = 0
    playing.value = false
    paused.value = false
    ended.value = true
  }

  /**
   * 切换播放/暂停状态
   *
   * @example
   * ```ts
   * const { toggle } = useAudioContextBuffer()
   * toggle()
   * ```
   */
  function toggle() {
    if (playing.value) {
      pause()
    }
    else {
      resume()
    }
  }

  /**
   * 获取音频频率数据
   *
   * @returns 频率数据数组
   *
   * @example
   * ```ts
   * const { getFrequencyData } = useAudioContextBuffer()
   * const frequencyData = getFrequencyData()
   * ```
   */
  function getFrequencyData() {
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(frequencyData)
    return frequencyData
  }

  /**
   * 设置均衡器频率增益
   *
   * @param index 频率索引
   * @param value 增益值
   *
   * @example
   * ```ts
   * const { setEQFrequency } = useAudioContextBuffer()
   * setEQFrequency(0, 10)
   * ```
   */
  function setEQFrequency(index: number, value: number) {
    if (index >= 0 && index < filters.length) {
      filters[index].gain.value = value
    }
  }

  /**
   * 获取均衡器频率增益
   *
   * @param index 频率索引
   * @returns 增益值
   *
   * @example
   * ```ts
   * const { getEQFrequency } = useAudioContextBuffer()
   * const gain = getEQFrequency(0)
   * ```
   */
  function getEQFrequency(index: number) {
    if (index >= 0 && index < filters.length) {
      return filters[index].gain.value
    }
    return 0
  }

  /**
   * 获取所有均衡器频率和增益
   *
   * @returns 频率和增益数组
   *
   * @example
   * ```ts
   * const { getEQFrequencies } = useAudioContextBuffer()
   * const eqData = getEQFrequencies()
   * ```
   */
  function getEQFrequencies() {
    return eqFrequencies.map((freq, index) => ({
      frequency: freq,
      gain: getEQFrequency(index),
    }))
  }

  /**
   * 销毁音频上下文和相关资源
   *
   * @example
   * ```ts
   * const { destroy } = useAudioContextBuffer()
   * destroy()
   * ```
   */
  function destroy() {
    stop()
    bufferSource.value = null
    audioContext.close().catch((error) => {
      console.error('useAudioContextBuffer:destroy error:', error)
    })
  }

  if (analyser) {
    getByteTimeDomainData()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    eqFrequencies,
    audioContext,
    audioBuffer,
    bufferSource,
    gainNode,
    analyserNode,
    filters,
    filterNode,
    status,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    detune,
    playing,
    paused,
    ended,
    startFlag,
    pauseFlag,
    currentTimeRaw,
    currentTime,
    currentTimeText,
    setCurrentTime,
    durationRaw,
    duration,
    durationText,
    progressRaw,
    progress,
    setProgress,
    cachedDuration,
    cachedDurationText,
    cachedProgress,
    playBuffer,
    play,
    pause,
    resume,
    stop,
    toggle,
    getFrequencyData,
    setEQFrequency,
    getEQFrequency,
    getEQFrequencies,
    destroy,
    onVolumeUpdate: onVolumeUpdateEv.on,
    onRateUpdate: onRateUpdateEv.on,
    onTimeUpdate: onTimeUpdateEv.on,
    onDurationUpdate: onDurationUpdateEv.on,
    onPlaying: onPlayingEv.on,
    onPaused: onPausedEv.on,
    onEnded: onEndedEv.on,
    onByteTimeDomainData: onByteTimeDomainDataEv.on,
  }
}

/**
 * useAudioContextBuffer 函数的返回类型
 */
export type UseAudioContextBufferReturns = ReturnType<typeof useAudioContextBuffer>
