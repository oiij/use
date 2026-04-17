import type { LoaderConfig, PointFn } from '../use-renderer'

export { default as ButterflyPhase } from './ButterflyPhase.vue'
export { default as CardioidGlow } from './CardioidGlow.vue'
export { default as CardioidHeart } from './CardioidHeart.vue'
export { default as FourierFlow } from './FourierFlow.vue'
export { default as HeartWave } from './HeartWave.vue'
export { default as HypotrochoidLoop } from './HypotrochoidLoop.vue'
export { default as LemniscateBloom } from './LemniscateBloom.vue'
export { default as LissajousDrift } from './LissajousDrift.vue'
export { default as OriginalThinking } from './OriginalThinking.vue'
export { default as RoseCurve } from './RoseCurve.vue'
export { default as RoseOrbit } from './RoseOrbit.vue'
export { default as SpiralSearch } from './SpiralSearch.vue'
export { default as ThreePetalSpiral } from './ThreePetalSpiral.vue'

/**
 * 加载器配置参数
 */
export type LoaderProps = {
  config?: LoaderConfig
  pointFn?: PointFn
}
