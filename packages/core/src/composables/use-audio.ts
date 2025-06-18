import { onUnmounted, readonly, ref, watch } from 'vue'

interface Options {
  autoPlay?: boolean
  volume?: number
  loop?: boolean
}
export function useAudio(src?: string, options?: Options) {
  const controller = new AbortController()
  const { autoPlay = true, volume = 1, loop = false } = options ?? {}

  const _src = ref(src ?? '')
  const _volume = ref(volume)
  const _loop = ref(loop)

  const duration = ref(0)
  const currentTime = ref(0)
  const progress = ref(0)
  const playing = ref(false)
  const paused = ref(false)
  const ended = ref(false)

  const audio = new Audio(_src.value)
  audio.addEventListener('loadedmetadata', () => {
    duration.value = audio.duration
  }, { signal: controller.signal })
  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
    progress.value = (audio.currentTime / audio.duration) * 100
  }, { signal: controller.signal })
  audio.addEventListener('play', () => {
    playing.value = true
    paused.value = false
    ended.value = false
  }, { signal: controller.signal })
  audio.addEventListener('pause', () => {
    playing.value = false
    paused.value = true
    ended.value = false
  }, { signal: controller.signal })
  audio.addEventListener('ended', () => {
    playing.value = false
    paused.value = false
    ended.value = true
  }, { signal: controller.signal })

  watch(_src, (val) => {
    audio.src = val
  })
  audio.autoplay = autoPlay
  audio.volume = _volume.value
  watch(_volume, (val) => {
    audio.volume = val
  })
  audio.loop = _loop.value
  watch(_loop, (val) => {
    audio.loop = val
  })

  function play() {
    audio.play()
  }
  function pause() {
    audio.pause()
  }
  function stop() {
    audio.pause()
    audio.currentTime = 0
  }
  function jump(time: number) {
    audio.currentTime = time
  }

  function setProgress(progress: number) {
    audio.currentTime = (progress / 100) * audio.duration
  }
  onUnmounted(() => {
    controller.abort()
    audio.remove()
  })
  return {
    audio,
    src: _src,
    volume: _volume,
    loop: _loop,
    duration: readonly(duration),
    currentTime: readonly(currentTime),
    progress: readonly(progress),
    playing: readonly(playing),
    paused: readonly(paused),
    ended: readonly(ended),
    play,
    pause,
    stop,
    jump,
    setProgress,
  }
}
export type UseAudioReturns = ReturnType<typeof useAudio>
