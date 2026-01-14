import { createEventHook } from '@vueuse/core'
import { computed, onUnmounted, readonly, ref } from 'vue'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  seconds = Math.floor(seconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
export type AudioContextFadeOptions = {
  fade?: boolean
  duration?: number
}
export type AudioContextOptions = {
  volume?: number
  playbackRate?: number
  fade?: AudioContextFadeOptions | boolean
}

export function useAudioContext(options?: AudioContextOptions) {
  const { volume: defaultVolume = 1, playbackRate: defaultPlaybackRate = 1, fade } = options ?? {}
  const eqFrequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

  const defaultFadeOptions = typeof fade === 'boolean' ? { fade: true, duration: 0.5 } : fade ?? { }

  const controller = new AbortController()
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
  const onMutedEv = createEventHook<HTMLAudioElement>()
  const onRateUpdateEv = createEventHook<HTMLAudioElement>()
  const onPlayingEv = createEventHook<HTMLAudioElement>()
  const onPausedEv = createEventHook<HTMLAudioElement>()
  const onEndedEv = createEventHook<HTMLAudioElement>()
  const onTimeUpdateEv = createEventHook<HTMLAudioElement>()
  const onDurationUpdateEv = createEventHook<HTMLAudioElement>()

  // volume
  const volumeRef = ref(defaultVolume)
  const muted = computed(() => volumeRef.value === 0)
  gainNode.gain.value = volumeRef.value

  function setVolume(volume: number) {
    gainNode.gain.cancelScheduledValues(audioContext.currentTime)
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), audioContext.currentTime)
    volumeRef.value = volume
    onVolumeUpdateEv.trigger(audioElement)
  }

  // setMuted
  let volumeCache: number = defaultVolume
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
  function toggleMute() {
    setMuted(!muted.value)
  }

  // playbackRate
  const playbackRateRef = ref(defaultPlaybackRate)
  function setPlaybackRate(playbackRate: number) {
    audioElement.playbackRate = playbackRate
  }
  audioElement.addEventListener('ratechange', () => {
    playbackRateRef.value = audioElement.playbackRate
    onRateUpdateEv.trigger(audioElement)
  }, {
    signal: controller.signal,
  })

  const playingRef = ref(false)
  const pausedRef = ref(false)
  const endedRef = ref(false)
  const urlRef = ref<string>()

  // play&stop
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

  function stop() {
    audioElement.currentTime = 0
    audioElement.pause()
    audioElement.removeAttribute('src')
  }

  audioElement.addEventListener('playing', () => {
    playingRef.value = true
    pausedRef.value = false
    endedRef.value = false
    onPlayingEv.trigger(audioElement)
  }, {
    signal: controller.signal,
  })

  // pause&resume
  function pause(options?: AudioContextFadeOptions) {
    const { fade = false, duration = 0.5 } = { ...defaultFadeOptions, ...options }
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
    const { fade = false, duration = 0.5 } = { ...defaultFadeOptions, ...options }
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

  function toggle() {
    audioElement.paused ? resume() : pause({ fade: true })
  }

  audioElement.addEventListener('pause', () => {
    playingRef.value = false
    pausedRef.value = true
    endedRef.value = false
    onPausedEv.trigger(audioElement)
  }, {
    signal: controller.signal,
  })

  // ended
  audioElement.addEventListener('ended', () => {
    playingRef.value = false
    pausedRef.value = false
    endedRef.value = true
    onEndedEv.trigger(audioElement)
  }, {
    signal: controller.signal,
  })

  const currentTimeRef = ref(0)
  const currentTimeText = computed(() => formatTime(currentTimeRef.value))
  function setCurrentTime(time: number) {
    audioElement.currentTime = time
  }

  const progressRef = ref(0)
  function setProgress(progress: number) {
    audioElement.currentTime = Number(((progress / 100) * (audioElement.duration ?? 0)).toFixed(2))
  }
  audioElement.addEventListener('timeupdate', () => {
    currentTimeRef.value = audioElement.currentTime ?? 0
    progressRef.value = Number(((audioElement.currentTime / (audioElement.duration ?? 0)) * 100).toFixed(2))
    onTimeUpdateEv.trigger(audioElement)
  }, {
    signal: controller.signal,
  })

  const durationRef = ref(0)
  const durationText = computed(() => formatTime(durationRef.value))
  audioElement.addEventListener('durationchange', () => {
    durationRef.value = audioElement.duration
    onDurationUpdateEv.trigger(audioElement)
  }, {
    signal: controller.signal,
  })

  const cachedDurationRef = ref(0)
  const cachedDurationText = computed(() => formatTime(cachedDurationRef.value))
  const cachedProgressRef = ref(0)
  audioElement.addEventListener('canplay', () => {
    const duration = audioElement.buffered.end(Math.max(0, audioElement.buffered.length - 1))
    cachedDurationRef.value = Number(duration.toFixed(2))
    cachedProgressRef.value = Number((duration / audioElement.duration * 100).toFixed(2))
  }, {
    signal: controller.signal,
  })

  function destroy() {
    controller.abort()
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
    onDurationUpdate: onDurationUpdateEv.on,
    onPlaying: onPlayingEv.on,
    onPaused: onPausedEv.on,
    onEnded: onEndedEv.on,
  }
}
export type UseAudioContextReturns = ReturnType<typeof useAudioContext>
