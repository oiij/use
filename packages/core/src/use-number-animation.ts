import type { Ref } from 'vue'
import { createEventHook, useRafFn } from '@vueuse/core'
import { computed, readonly, ref, toValue, watch, watchEffect } from 'vue'

type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | ((t: number) => number)
type NumberAnimationOptions = {
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
  watchEffect(() => targetValue.value = toValue(to))
  watch(targetValue, () => {
    if (!manual) {
      run()
    }
  })
  const startTime = ref(0)
  const isFirst = ref(true)

  const onStartEvent = createEventHook<[]>()
  const onEndEvent = createEventHook<[]>()
  const onProgressEvent = createEventHook<[number]>()

  const { pause, resume, isActive } = useRafFn(() => {
    const elapsed = performance.now() - startTime.value
    if (isFirst.value) {
      isFirst.value = false
      onStartEvent.trigger()
    }
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easingFn(progress)
    currentValue.value = from + (targetValue.value - from) * easedProgress
    if (progress >= 1) {
      currentValue.value = targetValue.value
      pause()
      onEndEvent.trigger()
      return
    }
    onProgressEvent.trigger(currentValue.value)
  }, { immediate: false })

  function run(value?: number) {
    if (value) {
      targetValue.value = value
    }
    startTime.value = performance.now()
    isFirst.value = true
    resume()
  }
  function stop() {
    pause()
    onEndEvent.trigger()
    currentValue.value = targetValue.value
  }
  if (!manual)
    run()

  return {
    value: readonly(computed(() => currentValue.value.toFixed(precision))),
    isActive,
    run,
    stop,
    pause,
    resume,
    onStart: onStartEvent.on,
    onEnd: onEndEvent.on,
    onProgress: onProgressEvent.on,
  }
}
export type UseNumberAnimationReturns = ReturnType<typeof useNumberAnimation>
