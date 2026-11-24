/** 默认淡入淡出持续时间（秒） */
export const DEFAULT_FADE_DURATION = 0.5

/** 静音时的最小音量缓存值，避免恢复时音量过小 */
export const MIN_VOLUME_CACHE = 0.1

/** 均衡器频率点（Hz），共 10 个频段 */
export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const

/**
 * 格式化时间秒数为 mm:ss 字符串
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 将 NaN 值安全地转换为 0
 * @param val 可能为 NaN 的数值
 * @returns 原值或 0
 */
export function nanAble(val: number) {
  return Number.isNaN(val) ? 0 : val
}

/**
 * 在给定音频上下文上创建 10 段 peaking 均衡器滤波器
 * @param audioContext Web Audio 上下文
 * @returns 滤波器节点数组
 */
export function createEQFilters(audioContext: AudioContext): BiquadFilterNode[] {
  return EQ_FREQUENCIES.map((freq) => {
    const filter = audioContext.createBiquadFilter()
    filter.type = 'peaking'
    filter.frequency.value = freq
    filter.Q.value = 1
    filter.gain.value = 0
    return filter
  })
}

/**
 * 将一组 EQ 滤波器串联起来，返回链末端节点
 * @param filters 滤波器数组
 * @param startNode 要连接到第一个滤波器的起始节点
 * @returns 串联后的最后一个滤波器节点
 */
export function connectFiltersInSeries(filters: BiquadFilterNode[], startNode: AudioNode): BiquadFilterNode {
  let current: AudioNode = startNode
  filters.forEach((filter) => {
    current.connect(filter)
    current = filter
  })
  return current as BiquadFilterNode
}

/**
 * 将音量值 clamp 到 [0, 1] 范围
 * @param volume 原始音量值
 * @returns 范围内的音量值
 */
export function clampVolume(volume: number) {
  return Math.max(0, Math.min(1, volume))
}
