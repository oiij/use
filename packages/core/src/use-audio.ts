import { tryOnScopeDispose, useEventListener } from '@vueuse/core'
import { readonly } from 'vue'
import { createAudioElementPlayback } from './_audio-element-playback'

/**
 * 音频配置选项
 * @example
 * const options: UseAudioOptions = {
 *   volume: 0.7,
 *   playbackRate: 1.0,
 *   autoPlay: false,
 *   loop: true,
 *   timeUpdateFormat: (time) => Math.floor(time)
 * }
 */
export type UseAudioOptions = {
  /** 音量（0-1），默认为 1 */
  volume?: number
  /** 播放速率，默认为 1 */
  playbackRate?: number
  /** 是否自动播放，默认为 true */
  autoPlay?: boolean
  /** 是否循环播放，默认为 true */
  loop?: boolean
  /** 时间更新格式化函数，默认为 (time) => time */
  timeUpdateFormat?: (time: number) => number
}

/**
 * 音频控制组合式函数
 * 提供音频播放控制、音量管理、进度控制等功能
 *
 * @param src 音频源地址
 * @param options 配置选项
 * @returns 音频控制对象
 *
 * @example
 * // 基本用法
 * const audio = useAudio('https://example.com/audio.mp3', {
 *   volume: 0.7,
 *   autoPlay: false,
 *   loop: true
 * })
 *
 * audio.play('https://example.com/audio.mp3')
 * audio.pause()
 * audio.setVolume(0.5)
 *
 * @example
 * // 监听事件
 * const { onPlaying, onPaused, onEnded } = useAudio()
 *
 * onPlaying(() => {
 *   console.log('音频开始播放')
 * })
 */
export function useAudio(src?: string, options?: UseAudioOptions) {
  const { autoPlay = true, loop = true, volume, playbackRate, timeUpdateFormat } = options ?? {}

  const audioElement = new Audio()
  audioElement.crossOrigin = 'anonymous'
  audioElement.autoplay = autoPlay
  audioElement.loop = loop

  if (src) {
    audioElement.src = src
    audioElement.load()
  }

  const playback = createAudioElementPlayback({
    audioElement,
    defaultVolume: volume,
    defaultPlaybackRate: playbackRate,
    timeUpdateFormat,
    applyVolume: (v) => { audioElement.volume = v },
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
   * @param url 音频地址
   * @example
   * play('https://example.com/audio.mp3')
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
   * 停止播放并重置到开始位置
   * @example
   * stop() // 停止播放
   */
  function stop() {
    audioElement.currentTime = 0
    audioElement.pause()
  }

  /**
   * 暂停音频
   * 暂停当前播放
   * @example
   * pause() // 暂停播放
   */
  function pause() {
    if (audioElement.paused) {
      return
    }
    audioElement.pause()
  }

  /**
   * 恢复播放
   * 从暂停位置恢复播放
   * @example
   * resume() // 恢复播放
   */
  function resume() {
    if (!audioElement.paused) {
      return
    }
    audioElement.play()
  }

  /**
   * 切换播放/暂停状态
   * 根据当前状态切换播放或暂停
   * @example
   * toggle() // 切换播放/暂停
   */
  function toggle() {
    audioElement.paused ? resume() : pause()
  }

  useEventListener(audioElement, 'ratechange', onRateChange)
  useEventListener(audioElement, 'playing', onPlaying)
  useEventListener(audioElement, 'pause', onPause)
  useEventListener(audioElement, 'ended', onEnded)
  useEventListener(audioElement, 'timeupdate', onTimeUpdate)
  useEventListener(audioElement, 'durationchange', onDurationChange)
  useEventListener(audioElement, 'canplay', onCanplay)

  /**
   * 销毁音频元素
   * 清理音频资源
   * @example
   * destroy() // 销毁音频元素
   */
  function destroy() {
    audioElement.remove()
  }

  tryOnScopeDispose(() => {
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

/**
 * useAudio 函数的返回类型
 * 包含音频元素、状态、方法和事件钩子
 * @example
 * const audio: UseAudioReturns = useAudio('https://example.com/audio.mp3')
 */
export type UseAudioReturns = ReturnType<typeof useAudio>
