import type { Ref } from 'vue'
import { createEventHook, useRafFn } from '@vueuse/core'
import { computed, readonly, ref, toValue, watchEffect } from 'vue'

type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | ((t: number) => number)
interface NumberAnimationOptions {
  from?: number
  manual?: boolean
  duration?: number
  precision?: number
  easing?: EasingFunction
}
const easingFns: Record<string, (t: number) => number> = {
  linear: t => t,
  easeIn: t => t * t, // 加速效果
  easeOut: t => 1 - (1 - t) ** 2, // 减速效果
  easeInOut: t => t < 0.5
    ? 2 * t * t // 前半段加速
    : 1 - (-2 * t + 2) ** 2 / 2, // 后半段减速
}
export function useNumberAnimation(to: Ref<number> | number, options?: NumberAnimationOptions) {
  const { from = 0, manual = false, duration = 1 * 1000, precision = 2, easing = 'linear' } = options ?? {}
  const easingFn = typeof easing === 'function'
    ? easing
    : easingFns[easing] || easingFns.linear
  const currentValue = ref(from)
  const targetValue = ref(toValue(to))
  watchEffect(() => {
    if (targetValue.value !== toValue(to)) {
      targetValue.value = toValue(to)
      start()
    }
  })
  const startTime = ref(0)
  const isFirst = ref(true)

  const onStartHook = createEventHook<[]>()
  const onEndHook = createEventHook<[]>()
  const onProgressHook = createEventHook<[number]>()

  const { pause, resume, isActive } = useRafFn(() => {
    const elapsed = performance.now() - startTime.value
    if (isFirst.value) {
      isFirst.value = false
      onStartHook.trigger()
    }
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easingFn(progress)
    currentValue.value = from + (targetValue.value - from) * easedProgress
    if (progress >= 1) {
      currentValue.value = targetValue.value
      pause()
      onEndHook.trigger()
      return
    }
    onProgressHook.trigger(currentValue.value)
  }, { immediate: false })

  function start() {
    startTime.value = performance.now()
    isFirst.value = true
    resume()
  }
  function stop() {
    pause()
    onEndHook.trigger()
    currentValue.value = targetValue.value
  }
  if (!manual)
    start()

  return {
    value: readonly(computed(() => currentValue.value.toFixed(precision))),
    isActive,
    start,
    stop,
    pause,
    resume,
    onStart: onStartHook.on,
    onEnd: onEndHook.on,
    onProgress: onProgressHook.on,
  }
}
export type UseNumberAnimationReturns = ReturnType<typeof useNumberAnimation>
