import { createEventHook } from '@vueuse/core'
import { computed, onUnmounted, ref, watchEffect } from 'vue'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
export type AudioContextOptions = & {
  analyser?: boolean
  volume?: number
  playbackRate?: number
  fadeOptions?: AudioContextFadeOptions | boolean
}
export type AudioContextFadeOptions = & {
  fade?: boolean
  duration?: number
}
export function useAudioContext(options?: AudioContextOptions) {
  const { volume: defaultVolume = 1, playbackRate: defaultPlaybackRate = 1, fadeOptions } = options ?? {}
  const eqFrequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

  const defaultFadeOptions = typeof fadeOptions === 'boolean' ? { fade: true, duration: 1 } : fadeOptions ?? {}

  const audioContext = new AudioContext()

  const audioElement = new Audio()
  audioElement.crossOrigin = 'anonymous'
  const sourceNode = audioContext.createMediaElementSource(audioElement)

  const gainNode = audioContext.createGain()

  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = 2048

  const filters = eqFrequencies.map((freq) => {
    const filter = audioContext.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = freq
    filter.Q.value = 1
    filter.gain.value = 0
    return filter
  })

  function createFilterNode() {
    let filterNode: AudioNode = sourceNode
    filters.forEach((filter) => {
      filterNode.connect(filter)
      filterNode = filter
    })
    return filterNode as BiquadFilterNode
  }

  const filterNode = createFilterNode()

  filterNode.connect(analyserNode)

  analyserNode.connect(gainNode)

  gainNode.connect(audioContext.destination)

  const onVolumeUpdateEv = createEventHook<HTMLAudioElement>()
  const onRateUpdateEv = createEventHook<HTMLAudioElement>()
  const onPlayingEv = createEventHook<HTMLAudioElement>()
  const onPausedEv = createEventHook<HTMLAudioElement>()
  const onEndedEv = createEventHook<HTMLAudioElement>()
  const onTimeUpdateEv = createEventHook<HTMLAudioElement>()
  const onDurationUpdateEv = createEventHook<HTMLAudioElement>()

  // volume
  const volume = ref(defaultVolume)
  gainNode.gain.value = volume.value
  function setVolume(volume: number) {
    gainNode.gain.cancelScheduledValues(audioContext.currentTime)
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioContext.currentTime)
  }
  watchEffect(() => {
    setVolume(volume.value)
  })
  audioElement.addEventListener('volumechange', () => {
    volume.value = audioElement.volume
    onVolumeUpdateEv.trigger(audioElement)
  })

  // playbackRate
  const playbackRate = ref(defaultPlaybackRate)
  function setPlaybackRate(playbackRate: number) {
    audioElement.playbackRate = playbackRate
  }
  watchEffect(() => {
    setPlaybackRate(playbackRate.value)
  })
  audioElement.addEventListener('ratechange', () => {
    playbackRate.value = audioElement.playbackRate
    onRateUpdateEv.trigger(audioElement)
  })

  const playing = ref(false)
  audioElement.addEventListener('playing', () => {
    playing.value = true
    onPlayingEv.trigger(audioElement)
  })

  const paused = ref(false)
  audioElement.addEventListener('pause', () => {
    paused.value = true
    onPausedEv.trigger(audioElement)
  })

  const ended = ref(false)
  audioElement.addEventListener('ended', () => {
    ended.value = true
    onEndedEv.trigger(audioElement)
  })

  const currentTime = ref(0)
  const currentTimeText = computed(() => formatTime(currentTime.value))
  function setCurrentTime(time: number) {
    audioElement.currentTime = time
  }
  watchEffect(() => {
    setCurrentTime(currentTime.value)
  })

  const progress = ref(0)
  function setProgress(progress: number) {
    audioElement.currentTime = Number(((progress / 100) * audioElement.duration).toFixed(2))
  }

  audioElement.addEventListener('timeupdate', () => {
    currentTime.value = audioElement.currentTime
    progress.value = Number(((audioElement.currentTime / audioElement.duration) * 100).toFixed(2))
    onTimeUpdateEv.trigger(audioElement)
  })

  const duration = ref(0)
  const durationText = computed(() => formatTime(duration.value))
  audioElement.addEventListener('durationchange', () => {
    duration.value = audioElement.duration
    onDurationUpdateEv.trigger(audioElement)
  })

  const cachedDuration = ref(0)
  const cachedDurationText = computed(() => formatTime(cachedDuration.value))
  const cachedProgress = ref(0)
  audioElement.addEventListener('canplay', () => {
    const duration = audioElement.buffered.end(Math.max(0, audioElement.buffered.length - 1))
    cachedDuration.value = Number(duration.toFixed(2))
    cachedProgress.value = Number((duration / audioElement.duration * 100).toFixed(2))
  })

  const url = ref<string>()
  async function play(_url?: string) {
    if (_url) {
      url.value = _url
    }
    if (!url.value) {
      console.error('useAudioContext:play error: url is required')
      throw new Error('useAudioContext:play error: url is required')
    }
    audioElement.src = url.value
    audioElement.load()
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
    try {
      await audioElement.play()
    }
    catch (error) {
      console.error('useAudioContext:play error:', error)
      throw error
    }
  }
  function pause(options?: AudioContextFadeOptions) {
    const { fade = true, duration = 1 } = options ?? defaultFadeOptions
    if (fade) {
      const currentTime = audioContext.currentTime
      gainNode.gain.cancelScheduledValues(currentTime)
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
      gainNode.gain.linearRampToValueAtTime(0, currentTime + (duration))
      setTimeout(() => {
        audioElement.pause()
      }, duration * 1000)
      return
    }
    audioElement.pause()
  }
  function resume(options?: AudioContextFadeOptions) {
    const { fade = true, duration = 1 } = options ?? defaultFadeOptions
    if (fade) {
      const currentTime = audioContext.currentTime
      gainNode.gain.cancelScheduledValues(currentTime)
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, currentTime + (duration))
      setTimeout(() => {
        audioElement.play()
      }, duration * 1000)
      return
    }
    audioElement.play()
  }
  function stop() {
    audioElement.pause()
    audioElement.currentTime = 0
  }
  function toggle() {
    audioElement.paused ? resume() : pause({ fade: true })
  }
  function destroy() {
    sourceNode.disconnect()
    gainNode.disconnect()
    analyserNode.disconnect()
    filterNode.disconnect()
    audioContext.close()
    audioElement.remove()
  }
  function getFrequencyData() {
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(frequencyData)
    return frequencyData
  }

  function setEQFrequency(index: number, value: number) {
    filters[index].gain.value = value
  }
  function getEQFrequency(index: number) {
    return filters[index].gain.value
  }
  function getEQFrequencies() {
    return eqFrequencies.map((freq, index) => ({
      frequency: freq,
      gain: getEQFrequency(index),
    }))
  }
  onUnmounted(() => {
    destroy()
  })
  return {
    eqFrequencies,
    audioContext,
    audioElement,
    sourceNode,
    gainNode,
    analyserNode,
    filters,
    filterNode,
    volume,
    setVolume,
    playbackRate,
    setPlaybackRate,
    playing,
    paused,
    ended,
    currentTime,
    currentTimeText,
    setCurrentTime,
    duration,
    durationText,
    progress,
    setProgress,
    cachedDuration,
    cachedDurationText,
    cachedProgress,
    url,
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
    onRateUpdate: onRateUpdateEv.on,
    onTimeUpdate: onTimeUpdateEv.on,
    onDurationUpdate: onDurationUpdateEv.on,
    onPlaying: onPlayingEv.on,
    onPaused: onPausedEv.on,
    onEnded: onEndedEv.on,
  }
}
export type UseAudioContextReturns = ReturnType<typeof useAudioContext>
