interface Options {
  analyser?: boolean
  volume?: number
  fftSize?: number
}

export class IAudioContext {
  #options: Options = {}
  #controller = new AbortController()
  audioContext = new AudioContext()
  audioBuffer?: AudioBuffer
  bufferSource: AudioBufferSourceNode | null = null
  gainNode = this.audioContext.createGain()
  analyserNode = this.audioContext.createAnalyser()
  bufferLength = this.analyserNode.frequencyBinCount
  unit8Array = new Uint8Array(this.bufferLength)

  status: AudioContextState = this.audioContext.state
  playing = false
  ended = false
  #startFlag = 0
  #pauseFlag = 0
  currentTimeRaw = 0
  get currentTime() {
    return this.#formatTime(this.currentTimeRaw)
  }

  durationRaw = 0
  get duration() {
    return this.#formatTime(this.durationRaw)
  }

  progressRaw = 0
  get progress() {
    return Number(this.progressRaw.toFixed(0))
  }

  #volume: number = this.gainNode.gain.value * 100
  get volume() {
    return this.#volume
  }

  set volume(val: number) {
    this.gainNode.gain.value = val / 100
  }

  #detune = this.bufferSource?.detune.defaultValue ?? 0 // 音调
  get detune() {
    return this.#detune
  }

  set detune(val: number) {
    if (this.bufferSource)
      this.bufferSource.detune.value = val
  }

  #playbackRate = this.bufferSource?.playbackRate.defaultValue ?? 1 // 播放速率
  get playbackRate() {
    return this.#playbackRate
  }

  set playbackRate(val: number) {
    if (this.bufferSource)
      this.bufferSource.playbackRate.value = val
  }

  #onByteTimeDomainDataFn: ((array: Uint8Array) => void) | null = null

  #getByteTimeDomainData() {
    this.analyserNode.getByteTimeDomainData(this.unit8Array)
    if (typeof this.#onByteTimeDomainDataFn === 'function') {
      this.#onByteTimeDomainDataFn(this.unit8Array)
    }
    requestAnimationFrame(this.#getByteTimeDomainData)
  }

  onByteTimeDomainData(fn: (array: Uint8Array) => void) {
    this.#onByteTimeDomainDataFn = fn
    if (this.#options.analyser) {
      this.#getByteTimeDomainData()
    }
  }

  #onEndedFn: (() => void) | null = null
  #onProgressFn: ((progress: number) => void) | null = null
  #updateDuration() {
    const _currentTime = this.audioContext.currentTime - this.#startFlag
    if (_currentTime >= this.durationRaw) {
      this.playing = false
      this.ended = true
      if (typeof this.#onEndedFn === 'function') {
        this.#onEndedFn()
      }
      return
    }
    this.currentTimeRaw = _currentTime
    this.progressRaw = (_currentTime / this.durationRaw) * 100
    if (typeof this.#onProgressFn === 'function') {
      this.#onProgressFn(this.progressRaw)
    }
    requestAnimationFrame(this.#updateDuration)
  }

  #formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  createBufferSource(audioBuffer: AudioBuffer) {
    const bufferSource = this.audioContext.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.connect(this.gainNode)
    return bufferSource
  }

  setProgress(val: number) {
    if (this.audioBuffer) {
      const targetDuration = val / 100 * this.durationRaw
      this.bufferSource?.stop()
      this.bufferSource = this.createBufferSource(this.audioBuffer)
      this.bufferSource.start(0, targetDuration)
      this.#startFlag = this.audioContext.currentTime - targetDuration
      if (!this.playing) {
        this.#pauseFlag = this.audioContext.currentTime - this.#startFlag
      }
    }
  }

  onProgress(fn: (progress: number) => void) {
    this.#onProgressFn = fn
  }

  onEnded(fn: () => void) {
    this.#onEndedFn = fn
  }

  async playBuffer(arrayBuffer: Uint8Array) {
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.buffer as unknown as ArrayBuffer)
    this.play()
  }

  play() {
    if (this.audioBuffer) {
      this.bufferSource?.stop()
      this.bufferSource = this.createBufferSource(this.audioBuffer)
      this.bufferSource.start(0)

      this.playing = true
      this.ended = false

      this.durationRaw = this.audioBuffer.duration
      this.#startFlag = this.audioContext.currentTime

      this.#updateDuration()
    }
  }

  pause() {
    this.audioContext.suspend()
    this.#pauseFlag = this.audioContext.currentTime - this.#startFlag
    this.playing = false
  }

  resume() {
    if (this.ended) {
      this.play()
      return
    }
    this.audioContext.resume()
    this.#startFlag = this.audioContext.currentTime - this.#pauseFlag
    this.playing = true
  }

  stop() {
    this.bufferSource?.stop()
    this.#pauseFlag = 0
    this.#startFlag = 0
    this.currentTimeRaw = 0
    this.playing = false
    this.ended = true
  }

  destroy() {
    stop()
    this.bufferSource = null
    this.audioContext.close()
  }

  constructor(options?: Options) {
    this.#options = { ...options }
    this.#volume = this.#options.volume ?? 80
    this.analyserNode.fftSize = this.#options.fftSize ?? 2048
    this.gainNode.connect(this.analyserNode).connect(this.audioContext.destination)
    this.audioContext.addEventListener('statechange', () => {
      this.status = this.audioContext.state
    }, { signal: this.#controller.signal })
    if (this.#options.analyser) {
      this.#getByteTimeDomainData()
    }
  }
}
