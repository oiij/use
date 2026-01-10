import { createEventHook } from '@vueuse/core'
import { computed, onUnmounted, ref, shallowRef, watchEffect } from 'vue'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export type AudioContextBufferOptions = {
  analyser?: boolean
  volume?: number
  playbackRate?: number
  fadeOptions?: AudioContextBufferFadeOptions | boolean
}

export type AudioContextBufferFadeOptions = {
  fade?: boolean
  duration?: number
}

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

  // Equalizer filters
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

  // Audio graph connections
  gainNode.connect(filterNode)
  filterNode.connect(analyserNode)
  analyserNode.connect(audioContext.destination)

  // Event hooks
  const onVolumeUpdateEv = createEventHook<void>()
  const onRateUpdateEv = createEventHook<void>()
  const onPlayingEv = createEventHook<void>()
  const onPausedEv = createEventHook<void>()
  const onEndedEv = createEventHook<void>()
  const onTimeUpdateEv = createEventHook<void>()
  const onDurationUpdateEv = createEventHook<void>()
  const onByteTimeDomainDataEv = createEventHook<Uint8Array>()

  // Status
  const status = ref<AudioContextState>(audioContext.state)
  audioContext.addEventListener('statechange', () => {
    status.value = audioContext.state
  })

  // Playback states
  const playing = ref(false)
  const paused = ref(false)
  const ended = ref(false)

  // Time tracking
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

  // Cached buffer information
  const cachedDuration = ref(0)
  const cachedDurationText = computed(() => formatTime(cachedDuration.value))
  const cachedProgress = ref(0)

  // Volume control
  const volume = ref(defaultVolume)
  gainNode.gain.value = volume.value / 100
  function setVolume(volume: number) {
    gainNode.gain.cancelScheduledValues(audioContext.currentTime)
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(100, volume)) / 100, audioContext.currentTime)
    onVolumeUpdateEv.trigger()
  }
  watchEffect(() => {
    setVolume(volume.value)
  })

  // Detune control
  const detune = ref(0)
  watchEffect(() => {
    if (bufferSource.value) {
      bufferSource.value.detune.value = detune.value
    }
  })

  // Playback rate control
  const playbackRate = ref(defaultPlaybackRate)
  function setPlaybackRate(playbackRate: number) {
    if (bufferSource.value) {
      bufferSource.value.playbackRate.value = playbackRate
    }
    onRateUpdateEv.trigger()
  }
  watchEffect(() => {
    setPlaybackRate(playbackRate.value)
  })

  // Time domain data
  function getByteTimeDomainData() {
    analyserNode.getByteTimeDomainData(unit8Array)
    onByteTimeDomainDataEv.trigger(unit8Array)
    requestAnimationFrame(getByteTimeDomainData)
  }

  // Update duration and progress
  function updateDuration() {
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

  // Create buffer source
  function createBufferSourceNode(audioBuffer: AudioBuffer) {
    const bufferSource = audioContext.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.detune.value = detune.value
    bufferSource.playbackRate.value = playbackRate.value
    bufferSource.connect(gainNode)

    // Set up ended event
    bufferSource.onended = () => {
      playing.value = false
      ended.value = true
      onEndedEv.trigger()
    }

    return bufferSource
  }

  // Set current time
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

  // Set progress (percentage)
  function setProgress(val: number) {
    if (audioBuffer.value) {
      const targetDuration = (val / 100) * durationRaw.value
      setCurrentTime(targetDuration)
    }
  }

  // Play from array buffer
  async function playBuffer(arrayBuffer: Uint8Array) {
    try {
      audioBuffer.value = await audioContext.decodeAudioData(arrayBuffer.buffer as unknown as ArrayBuffer)
      // Update cached duration when buffer is loaded
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

  // Play
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

  // Pause with fade option
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

  // Resume with fade option
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

  // Stop
  function stop() {
    bufferSource.value?.stop()
    pauseFlag.value = 0
    startFlag.value = 0
    currentTimeRaw.value = 0
    playing.value = false
    paused.value = false
    ended.value = true
  }

  // Toggle play/pause
  function toggle() {
    if (playing.value) {
      pause()
    }
    else {
      resume()
    }
  }

  // Get frequency data
  function getFrequencyData() {
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(frequencyData)
    return frequencyData
  }

  // EQ frequency controls
  function setEQFrequency(index: number, value: number) {
    if (index >= 0 && index < filters.length) {
      filters[index].gain.value = value
    }
  }

  function getEQFrequency(index: number) {
    if (index >= 0 && index < filters.length) {
      return filters[index].gain.value
    }
    return 0
  }

  function getEQFrequencies() {
    return eqFrequencies.map((freq, index) => ({
      frequency: freq,
      gain: getEQFrequency(index),
    }))
  }

  // Destroy
  function destroy() {
    stop()
    bufferSource.value = null
    audioContext.close()
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
