import { createEventHook } from '@vueuse/core'

function formatTime(seconds: number): string {
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

export class IAudioContext {
  public eqFrequencies: number[] = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
  public audioContext: AudioContext
  public audioElement: HTMLAudioElement
  public sourceNode: MediaElementAudioSourceNode
  public gainNode: GainNode
  public analyserNode: AnalyserNode
  public filters: BiquadFilterNode[]
  public filterNode: BiquadFilterNode
  public volume: number
  public playbackRate: number
  public playing: boolean = false
  public paused: boolean = false
  public ended: boolean = false
  public currentTime: number = 0
  public currentTimeText: string = '0:00'
  public duration: number = 0
  public durationText: string = '0:00'
  public progress: number = 0
  public cachedDuration: number = 0
  public cachedDurationText: string = '0:00'
  public cachedProgress: number = 0
  public url?: string

  private defaultFadeOptions: AudioContextFadeOptions
  private onVolumeUpdateEv = createEventHook<HTMLAudioElement>()
  private onRateUpdateEv = createEventHook<HTMLAudioElement>()
  private onPlayingEv = createEventHook<HTMLAudioElement>()
  private onPausedEv = createEventHook<HTMLAudioElement>()
  private onEndedEv = createEventHook<HTMLAudioElement>()
  private onTimeUpdateEv = createEventHook<HTMLAudioElement>()
  private onDurationUpdateEv = createEventHook<HTMLAudioElement>()

  constructor(options?: AudioContextOptions) {
    const { volume: defaultVolume = 1, playbackRate: defaultPlaybackRate = 1, fadeOptions } = options ?? {}

    this.defaultFadeOptions = typeof fadeOptions === 'boolean' ? { fade: true, duration: 1 } : fadeOptions ?? {}

    this.audioContext = new AudioContext()

    this.audioElement = new Audio()
    this.audioElement.crossOrigin = 'anonymous'

    this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement)
    this.gainNode = this.audioContext.createGain()
    this.analyserNode = this.audioContext.createAnalyser()
    this.analyserNode.fftSize = 2048

    this.filters = this.eqFrequencies.map((freq) => {
      const filter = this.audioContext.createBiquadFilter()
      filter.type = 'peaking'
      filter.frequency.value = freq
      filter.Q.value = 1
      filter.gain.value = 0
      return filter
    })

    this.filterNode = this.createFilterNode()
    this.filterNode.connect(this.analyserNode)
    this.analyserNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)

    this.volume = defaultVolume
    this.gainNode.gain.value = this.volume

    this.playbackRate = defaultPlaybackRate
    this.audioElement.playbackRate = this.playbackRate

    this.setupEventListeners()
  }

  private createFilterNode(): BiquadFilterNode {
    let filterNode: AudioNode = this.sourceNode
    this.filters.forEach((filter) => {
      filterNode.connect(filter)
      filterNode = filter
    })
    return filterNode as BiquadFilterNode
  }

  private setupEventListeners(): void {
    this.audioElement.addEventListener('volumechange', () => {
      this.volume = this.audioElement.volume
      this.onVolumeUpdateEv.trigger(this.audioElement)
    })

    this.audioElement.addEventListener('ratechange', () => {
      this.playbackRate = this.audioElement.playbackRate
      this.onRateUpdateEv.trigger(this.audioElement)
    })

    this.audioElement.addEventListener('playing', () => {
      this.playing = true
      this.paused = false
      this.onPlayingEv.trigger(this.audioElement)
    })

    this.audioElement.addEventListener('pause', () => {
      this.paused = true
      this.playing = false
      this.onPausedEv.trigger(this.audioElement)
    })

    this.audioElement.addEventListener('ended', () => {
      this.ended = true
      this.playing = false
      this.paused = true
      this.onEndedEv.trigger(this.audioElement)
    })

    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = this.audioElement.currentTime
      this.currentTimeText = formatTime(this.currentTime)
      this.progress = Number(((this.audioElement.currentTime / this.audioElement.duration) * 100).toFixed(2))
      this.onTimeUpdateEv.trigger(this.audioElement)
    })

    this.audioElement.addEventListener('durationchange', () => {
      this.duration = this.audioElement.duration
      this.durationText = formatTime(this.duration)
      this.onDurationUpdateEv.trigger(this.audioElement)
    })

    this.audioElement.addEventListener('canplay', () => {
      const duration = this.audioElement.buffered.end(Math.max(0, this.audioElement.buffered.length - 1))
      this.cachedDuration = Number(duration.toFixed(2))
      this.cachedDurationText = formatTime(this.cachedDuration)
      this.cachedProgress = Number((duration / this.audioElement.duration * 100).toFixed(2))
    })
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime)
    this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
  }

  public setPlaybackRate(playbackRate: number): void {
    this.playbackRate = playbackRate
    this.audioElement.playbackRate = this.playbackRate
  }

  public setCurrentTime(time: number): void {
    this.currentTime = time
    this.audioElement.currentTime = time
  }

  public setProgress(progress: number): void {
    this.progress = progress
    this.audioElement.currentTime = Number(((progress / 100) * this.audioElement.duration).toFixed(2))
  }

  public async play(_url?: string): Promise<void> {
    if (_url) {
      this.url = _url
    }
    if (!this.url) {
      console.error('AudioContext:play error: url is required')
      throw new Error('AudioContext:play error: url is required')
    }
    this.audioElement.src = this.url
    this.audioElement.load()
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    try {
      await this.audioElement.play()
    }
    catch (error) {
      console.error('AudioContext:play error:', error)
      throw error
    }
  }

  public pause(options?: AudioContextFadeOptions): void {
    const { fade = true, duration = 1 } = options ?? this.defaultFadeOptions
    if (fade) {
      const currentTime = this.audioContext.currentTime
      this.gainNode.gain.cancelScheduledValues(currentTime)
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime)
      this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration)
      setTimeout(() => {
        this.audioElement.pause()
      }, duration * 1000)
      return
    }
    this.audioElement.pause()
  }

  public resume(options?: AudioContextFadeOptions): void {
    const { fade = true, duration = 1 } = options ?? this.defaultFadeOptions
    if (fade) {
      const currentTime = this.audioContext.currentTime
      this.gainNode.gain.cancelScheduledValues(currentTime)
      this.gainNode.gain.setValueAtTime(0, currentTime)
      this.gainNode.gain.linearRampToValueAtTime(this.volume, currentTime + duration)
      setTimeout(() => {
        this.audioElement.play()
      }, duration * 1000)
      return
    }
    this.audioElement.play()
  }

  public stop(): void {
    this.audioElement.pause()
    this.audioElement.currentTime = 0
  }

  public toggle(): void {
    this.audioElement.paused ? this.resume() : this.pause({ fade: true })
  }

  public destroy(): void {
    this.sourceNode.disconnect()
    this.gainNode.disconnect()
    this.analyserNode.disconnect()
    this.filterNode.disconnect()
    this.audioContext.close()
    this.audioElement.remove()
  }

  public getFrequencyData(): Uint8Array {
    const frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount)
    this.analyserNode.getByteFrequencyData(frequencyData)
    return frequencyData
  }

  public setEQFrequency(index: number, value: number): void {
    if (this.filters[index]) {
      this.filters[index].gain.value = value
    }
  }

  public getEQFrequency(index: number): number {
    return this.filters[index]?.gain.value ?? 0
  }

  public getEQFrequencies(): Array<{ frequency: number, gain: number }> {
    return this.eqFrequencies.map((freq, index) => ({
      frequency: freq,
      gain: this.getEQFrequency(index),
    }))
  }

  public get onVolumeUpdate() {
    return this.onVolumeUpdateEv.on
  }

  public get onRateUpdate() {
    return this.onRateUpdateEv.on
  }

  public get onTimeUpdate() {
    return this.onTimeUpdateEv.on
  }

  public get onDurationUpdate() {
    return this.onDurationUpdateEv.on
  }

  public get onPlaying() {
    return this.onPlayingEv.on
  }

  public get onPaused() {
    return this.onPausedEv.on
  }

  public get onEnded() {
    return this.onEndedEv.on
  }
}
