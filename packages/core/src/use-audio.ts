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
type Options = {
  volume?: number
  playbackRate?: number
  autoPlay?: boolean
  loop?: boolean
  timeUpdateFormat?: (time: number) => number
}
export function useAudio(src?: string, options?: Options) {
  const { volume: defaultVolume = 1, playbackRate: defaultPlaybackRate = 1, autoPlay = true, loop = true, timeUpdateFormat = (time: number) => time } = options ?? {}
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
  function setVolume(volume: number) {
    audioElement.volume = volume
    volumeRef.value = volume
    onVolumeUpdateEv.trigger(audioElement, volume)
  }
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

  // refs
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

  async function play(url: string) {
    stop()
    urlRef.value = url
    audioElement.src = url
    audioElement.load()
    await audioElement.play()
  }

  function stop() {
    audioElement.currentTime = 0
    audioElement.pause()
  }
  // pause&resume
  function pause() {
    if (audioElement.paused) {
      return
    }
    audioElement.pause()
  }
  function resume() {
    if (!audioElement.paused) {
      return
    }

    audioElement.play()
  }

  function toggle() {
    audioElement.paused ? resume() : pause()
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

  // eventListener
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
export type UseAudioReturns = ReturnType<typeof useAudio>
