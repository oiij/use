import { createEventHook } from '@vueuse/core'
import { computed, onUnmounted, ref, shallowRef, watchEffect } from 'vue'

/**
 * 格式化时间（秒）为 mm:ss 格式
 *
 * @param {number} seconds - 秒数
 * @returns {string} - 格式化后的时间字符串
 *
 * @example
 * ```javascript
 * formatTime(65) // 返回 "1:05"
 * formatTime(125) // 返回 "2:05"
 * formatTime(5) // 返回 "0:05"
 * ```
 */
function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 音频上下文缓冲区配置选项
 */
export type AudioContextBufferOptions = {
  /** 是否启用音频分析器 */
  analyser?: boolean
  /** 默认音量（0-100） */
  volume?: number
  /** 默认播放速率 */
  playbackRate?: number
  /** 淡入淡出选项，可设置为布尔值或对象 */
  fadeOptions?: AudioContextBufferFadeOptions | boolean
}

/**
 * 淡入淡出选项
 */
export type AudioContextBufferFadeOptions = {
  /** 是否启用淡入淡出 */
  fade?: boolean
  /** 淡入淡出持续时间（秒） */
  duration?: number
}

/**
 * 音频上下文缓冲区管理
 *
 * 用于管理音频缓冲区的加载、播放、暂停、停止等操作，支持音量控制、播放速率调整、均衡器等功能
 *
 * @param {AudioContextBufferOptions} [options] - 配置选项
 * @param {boolean} [options.analyser] - 是否启用音频分析器
 * @param {number} [options.volume] - 默认音量（0-100）
 * @param {number} [options.playbackRate] - 默认播放速率
 * @param {AudioContextBufferFadeOptions|boolean} [options.fadeOptions] - 淡入淡出选项
 * @returns {UseAudioContextBufferReturns} - 返回的状态和方法
 *
 * @example
 * ```javascript
 * import { useAudioContextBuffer } from 'use-audio-context-buffer'
 *
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
 * // 播放音频缓冲区
 * async function handlePlay() {
 *   const response = await fetch('audio.mp3')
 *   const arrayBuffer = await response.arrayBuffer()
 *   await playBuffer(new Uint8Array(arrayBuffer))
 * }
 * ```
 */
export function useAudioContextBuffer(options?: AudioContextBufferOptions) {
  const { analyser = false, volume: defaultVolume = 80, playbackRate: defaultPlaybackRate = 1, fadeOptions } = options ?? {}

  // 均衡器频率点（Hz）
  const eqFrequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

  // 淡入淡出默认选项
  const defaultFadeOptions = typeof fadeOptions === 'boolean' ? { fade: true, duration: 1 } : fadeOptions ?? {}

  // 音频上下文实例
  const audioContext = new AudioContext()
  // 音频缓冲区引用
  const audioBuffer = shallowRef<AudioBuffer>()
  // 音频缓冲区源节点引用
  const bufferSource = shallowRef<AudioBufferSourceNode | null>(null)
  // 音量控制节点
  const gainNode = audioContext.createGain()
  // 音频分析器节点
  const analyserNode = audioContext.createAnalyser()
  // FFT大小，影响频率分析精度
  analyserNode.fftSize = 2048
  // 频率bin数量，为fftSize的一半
  const bufferLength = analyserNode.frequencyBinCount
  // 用于存储时域数据的数组
  const unit8Array = new Uint8Array(bufferLength)

  // 均衡器滤波器
  const filters = eqFrequencies.map((freq) => {
    const filter = audioContext.createBiquadFilter()
    // 设置为峰值滤波器类型
    filter.type = 'peaking'
    // 设置滤波器频率
    filter.frequency.value = freq
    // 设置Q值（品质因子）
    filter.Q.value = 1
    // 初始增益为0（无增益）
    filter.gain.value = 0
    return filter
  })

  /**
   * 创建滤波器节点链
   * @returns {BiquadFilterNode} - 最终的滤波器节点
   */
  function createFilterNode() {
    let filterNode: AudioNode = gainNode
    // 连接所有滤波器形成链
    filters.forEach((filter) => {
      filterNode.connect(filter)
      filterNode = filter
    })
    return filterNode as BiquadFilterNode
  }

  // 创建滤波器节点
  const filterNode = createFilterNode()

  // 音频图连接
  gainNode.connect(filterNode) // 音量节点连接到滤波器
  filterNode.connect(analyserNode) // 滤波器连接到分析器
  analyserNode.connect(audioContext.destination) // 分析器连接到音频输出

  // 事件钩子
  const onVolumeUpdateEv = createEventHook<void>() // 音量更新事件
  const onRateUpdateEv = createEventHook<void>() // 播放速率更新事件
  const onPlayingEv = createEventHook<void>() // 开始播放事件
  const onPausedEv = createEventHook<void>() // 暂停事件
  const onEndedEv = createEventHook<void>() // 结束事件
  const onTimeUpdateEv = createEventHook<void>() // 时间更新事件
  const onDurationUpdateEv = createEventHook<void>() //  duration更新事件
  const onByteTimeDomainDataEv = createEventHook<Uint8Array>() // 时域数据事件

  // 音频上下文状态
  const status = ref<AudioContextState>(audioContext.state)
  audioContext.addEventListener('statechange', () => {
    status.value = audioContext.state
  })

  // 播放状态
  const playing = ref(false) // 是否正在播放
  const paused = ref(false) // 是否暂停
  const ended = ref(false) // 是否结束

  // 时间跟踪
  const startFlag = ref(0) // 开始时间标记
  const pauseFlag = ref(0) // 暂停时间标记

  // 当前时间（原始值，秒）
  const currentTimeRaw = ref(0)
  // 当前时间（格式化，mm:ss）
  const currentTime = computed(() => formatTime(currentTimeRaw.value))
  // 当前时间文本（格式化，mm:ss）
  const currentTimeText = computed(() => formatTime(currentTimeRaw.value))

  // 音频总时长（原始值，秒）
  const durationRaw = ref(0)
  // 音频总时长（格式化，mm:ss）
  const duration = computed(() => formatTime(durationRaw.value))
  // 音频总时长文本（格式化，mm:ss）
  const durationText = computed(() => formatTime(durationRaw.value))

  // 播放进度（原始值，0-100）
  const progressRaw = ref(0)
  // 播放进度（取整，0-100）
  const progress = computed(() => Number(progressRaw.value.toFixed(0)))

  // 缓存的缓冲区信息
  const cachedDuration = ref(0) // 缓存的音频时长
  const cachedDurationText = computed(() => formatTime(cachedDuration.value)) // 缓存的音频时长文本
  const cachedProgress = ref(0) // 缓存的加载进度

  // 音量控制
  const volume = ref(defaultVolume) // 当前音量（0-100）
  gainNode.gain.value = volume.value / 100 // 初始化音量

  /**
   * 设置音量
   * @param {number} volume - 音量值（0-100）
   */
  function setVolume(volume: number) {
    // 取消之前的音量调度
    gainNode.gain.cancelScheduledValues(audioContext.currentTime)
    // 设置音量（限制在0-100之间）
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(100, volume)) / 100, audioContext.currentTime)
    // 触发音量更新事件
    onVolumeUpdateEv.trigger()
  }

  // 监听音量变化
  watchEffect(() => {
    setVolume(volume.value)
  })

  // 音高控制
  const detune = ref(0) // 音高调整（音分）
  watchEffect(() => {
    if (bufferSource.value) {
      bufferSource.value.detune.value = detune.value
    }
  })

  // 播放速率控制
  const playbackRate = ref(defaultPlaybackRate) // 当前播放速率

  /**
   * 设置播放速率
   * @param {number} playbackRate - 播放速率
   */
  function setPlaybackRate(playbackRate: number) {
    if (bufferSource.value) {
      bufferSource.value.playbackRate.value = playbackRate
    }
    // 触发播放速率更新事件
    onRateUpdateEv.trigger()
  }

  // 监听播放速率变化
  watchEffect(() => {
    setPlaybackRate(playbackRate.value)
  })

  // 时域数据
  /**
   * 获取音频时域数据
   */
  function getByteTimeDomainData() {
    if (analyser) {
      analyserNode.getByteTimeDomainData(unit8Array)
      // 触发时域数据事件
      onByteTimeDomainDataEv.trigger(unit8Array)
      // 请求下一帧
      requestAnimationFrame(getByteTimeDomainData)
    }
  }

  // 更新时长和进度
  /**
   * 更新播放时长和进度
   */
  function updateDuration() {
    if (!playing.value || durationRaw.value === 0) {
      return
    }

    const _currentTime = audioContext.currentTime - startFlag.value
    // 检查是否播放结束
    if (_currentTime >= durationRaw.value) {
      playing.value = false
      ended.value = true
      onEndedEv.trigger()
      return
    }
    // 更新当前时间
    currentTimeRaw.value = _currentTime
    // 更新播放进度
    progressRaw.value = (_currentTime / durationRaw.value) * 100
    // 触发时间更新事件
    onTimeUpdateEv.trigger()
    // 请求下一帧更新
    requestAnimationFrame(updateDuration)
  }

  // 创建缓冲区源节点
  /**
   * 创建音频缓冲区源节点
   * @param {AudioBuffer} audioBuffer - 音频缓冲区
   * @returns {AudioBufferSourceNode} - 音频缓冲区源节点
   */
  function createBufferSourceNode(audioBuffer: AudioBuffer) {
    const bufferSource = audioContext.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.detune.value = detune.value
    bufferSource.playbackRate.value = playbackRate.value
    bufferSource.connect(gainNode)

    // 设置结束事件
    bufferSource.onended = () => {
      playing.value = false
      ended.value = true
      onEndedEv.trigger()
    }

    return bufferSource
  }

  // 设置当前时间
  /**
   * 设置当前播放时间
   * @param {number} time - 目标时间（秒）
   */
  function setCurrentTime(time: number) {
    if (audioBuffer.value) {
      // 限制时间范围在0到总时长之间
      const targetDuration = Math.max(0, Math.min(time, durationRaw.value))
      // 停止当前播放
      bufferSource.value?.stop()
      // 创建新的缓冲区源节点
      bufferSource.value = createBufferSourceNode(audioBuffer.value)
      // 从指定时间开始播放
      bufferSource.value.start(0, targetDuration)
      // 更新开始时间标记
      startFlag.value = audioContext.currentTime - targetDuration
      // 更新当前时间
      currentTimeRaw.value = targetDuration
      // 如果当前不是播放状态，则暂停
      if (!playing.value) {
        pauseFlag.value = targetDuration
        audioContext.suspend()
      }
    }
  }

  // 设置进度（百分比）
  /**
   * 设置播放进度
   * @param {number} val - 进度值（0-100）
   */
  function setProgress(val: number) {
    if (audioBuffer.value) {
      // 计算目标时间
      const targetDuration = (val / 100) * durationRaw.value
      // 设置当前时间
      setCurrentTime(targetDuration)
    }
  }

  // 从数组缓冲区播放
  /**
   * 播放音频缓冲区
   * @param {Uint8Array} arrayBuffer - 音频数据数组缓冲区
   * @returns {Promise<void>} - Promise
   */
  async function playBuffer(arrayBuffer: Uint8Array) {
    try {
      // 解码音频数据
      audioBuffer.value = await audioContext.decodeAudioData(arrayBuffer.buffer as ArrayBuffer)
      // 加载缓冲区时更新缓存的时长
      cachedDuration.value = audioBuffer.value.duration
      cachedProgress.value = 100
      // 触发时长更新事件
      onDurationUpdateEv.trigger()
      // 开始播放
      play()
    }
    catch (error) {
      console.error('useAudioContextBuffer:playBuffer error:', error)
      throw error
    }
  }

  // 播放
  /**
   * 开始播放音频
   */
  function play() {
    if (audioBuffer.value) {
      // 停止当前播放
      bufferSource.value?.stop()
      // 创建新的缓冲区源节点
      bufferSource.value = createBufferSourceNode(audioBuffer.value)
      // 开始播放
      bufferSource.value.start(0)

      // 更新播放状态
      playing.value = true
      paused.value = false
      ended.value = false

      // 更新时长和时间标记
      durationRaw.value = audioBuffer.value.duration
      startFlag.value = audioContext.currentTime
      pauseFlag.value = 0

      // 如果音频上下文处于挂起状态，则恢复
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      // 触发播放事件
      onPlayingEv.trigger()
      // 开始更新时长和进度
      updateDuration()
    }
  }

  // 暂停（支持淡入淡出）
  /**
   * 暂停播放
   * @param {AudioContextBufferFadeOptions} [options] - 淡入淡出选项
   */
  function pause(options?: AudioContextBufferFadeOptions) {
    const { fade = true, duration = 1 } = options ?? defaultFadeOptions
    if (fade) {
      // 淡入淡出效果
      const currentTime = audioContext.currentTime
      gainNode.gain.cancelScheduledValues(currentTime)
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration)
      setTimeout(() => {
        // 暂停音频上下文
        audioContext.suspend()
        // 更新暂停标记
        pauseFlag.value = audioContext.currentTime - startFlag.value
        // 更新播放状态
        playing.value = false
        paused.value = true
        // 触发暂停事件
        onPausedEv.trigger()
      }, duration * 1000)
      return
    }
    // 直接暂停
    audioContext.suspend()
    pauseFlag.value = audioContext.currentTime - startFlag.value
    playing.value = false
    paused.value = true
    onPausedEv.trigger()
  }

  // 恢复播放（支持淡入淡出）
  /**
   * 恢复播放
   * @param {AudioContextBufferFadeOptions} [options] - 淡入淡出选项
   */
  function resume(options?: AudioContextBufferFadeOptions) {
    // 如果已结束，则重新播放
    if (ended.value) {
      play()
      return
    }
    const { fade = true, duration = 1 } = options ?? defaultFadeOptions
    if (fade) {
      // 淡入淡出效果
      const currentTime = audioContext.currentTime
      gainNode.gain.cancelScheduledValues(currentTime)
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(volume.value / 100, currentTime + duration)
      setTimeout(() => {
        // 恢复音频上下文
        audioContext.resume()
        // 更新开始标记
        startFlag.value = audioContext.currentTime - pauseFlag.value
        // 更新播放状态
        playing.value = true
        paused.value = false
        // 触发播放事件
        onPlayingEv.trigger()
        // 开始更新时长和进度
        updateDuration()
      }, duration * 1000)
      return
    }
    // 直接恢复
    audioContext.resume()
    startFlag.value = audioContext.currentTime - pauseFlag.value
    playing.value = true
    paused.value = false
    onPlayingEv.trigger()
    updateDuration()
  }

  // 停止
  /**
   * 停止播放
   */
  function stop() {
    // 停止当前播放
    bufferSource.value?.stop()
    // 重置时间标记
    pauseFlag.value = 0
    startFlag.value = 0
    currentTimeRaw.value = 0
    // 更新播放状态
    playing.value = false
    paused.value = false
    ended.value = true
  }

  // 切换播放/暂停
  /**
   * 切换播放/暂停状态
   */
  function toggle() {
    if (playing.value) {
      pause()
    }
    else {
      resume()
    }
  }

  // 获取频率数据
  /**
   * 获取音频频率数据
   * @returns {Uint8Array} - 频率数据数组
   */
  function getFrequencyData() {
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(frequencyData)
    return frequencyData
  }

  // 均衡器频率控制
  /**
   * 设置均衡器频率增益
   * @param {number} index - 频率索引
   * @param {number} value - 增益值
   */
  function setEQFrequency(index: number, value: number) {
    if (index >= 0 && index < filters.length) {
      filters[index].gain.value = value
    }
  }

  /**
   * 获取均衡器频率增益
   * @param {number} index - 频率索引
   * @returns {number} - 增益值
   */
  function getEQFrequency(index: number) {
    if (index >= 0 && index < filters.length) {
      return filters[index].gain.value
    }
    return 0
  }

  /**
   * 获取所有均衡器频率和增益
   * @returns {Array<{frequency: number, gain: number}>} - 频率和增益数组
   */
  function getEQFrequencies() {
    return eqFrequencies.map((freq, index) => ({
      frequency: freq,
      gain: getEQFrequency(index),
    }))
  }

  // 销毁
  /**
   * 销毁音频上下文和相关资源
   */
  function destroy() {
    stop()
    bufferSource.value = null
    // 关闭音频上下文
    audioContext.close().catch((error) => {
      console.error('useAudioContextBuffer:destroy error:', error)
    })
  }

  // Initialize analyser if enabled
  if (analyser) {
    getByteTimeDomainData()
  }

  // Cleanup on unmount
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

export type UseAudioContextBufferReturns = ReturnType<typeof useAudioContextBuffer>
