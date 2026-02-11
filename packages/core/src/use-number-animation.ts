import type { MaybeRefOrGetter } from 'vue'
import { createEventHook, useRafFn } from '@vueuse/core'
import { computed, readonly, ref } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

/**
 * 缓动函数类型
 * - linear: 线性动画
 * - easeIn: 加速动画
 * - easeOut: 减速动画
 * - easeInOut: 先加速后减速动画
 * - 自定义函数: (t: number) => number，t 为 0-1 之间的进度值
 */
type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | ((t: number) => number)

/**
 * 数字动画配置选项
 */
type NumberAnimationOptions = {
  /**
   * 起始值
   * @default 0
   */
  from?: number
  /**
   * 是否手动控制动画
   * @default false
   */
  manual?: boolean
  /**
   * 动画持续时间（毫秒）
   * @default 1000
   */
  duration?: number
  /**
   * 精度，保留小数位数
   * @default 2
   */
  precision?: number
  /**
   * 缓动函数
   * @default 'linear'
   */
  easing?: EasingFunction
}

const easingFns: Record<string, (t: number) => number> = {
  linear: t => t,
  easeIn: t => t * t,
  easeOut: t => 1 - (1 - t) ** 2,
  easeInOut: t => t < 0.5
    ? 2 * t * t
    : 1 - (-2 * t + 2) ** 2 / 2,
}

/**
 * 数字动画组合式函数
 * 用于创建平滑的数字过渡动画效果
 *
 * @param to 目标值，可以是静态数字或响应式引用/计算属性
 * @param options 动画配置选项
 * @returns 动画控制对象
 *
 * @example
 * ```ts
 * // 基本用法
 * const { value: animatedValue } = useNumberAnimation(100)
 * ```
 *
 * @example
 * ```ts
 * // 自定义配置
 * const { value: animatedValue, run, stop } = useNumberAnimation(100, {
 *   from: 0,
 *   duration: 2000,
 *   precision: 0,
 *   easing: 'easeInOut',
 *   manual: false
 * })
 * ```
 *
 * @example
 * ```ts
 * // 手动控制
 * const { value: animatedValue, run, stop } = useNumberAnimation(0, { manual: true })
 * run(50)
 * stop()
 * ```
 */
export function useNumberAnimation(to: MaybeRefOrGetter<number>, options?: NumberAnimationOptions) {
  const { from = 0, manual = false, duration = 1 * 1000, precision = 2, easing = 'linear' } = options ?? {}

  const easingFn = typeof easing === 'function'
    ? easing
    : easingFns[easing] || easingFns.linear

  const currentValueRef = ref(from)

  const targetValueRef = watchRefOrGetter(to, () => {
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
    currentValueRef.value = from + (targetValueRef.value - from) * easedProgress

    if (progress >= 1) {
      currentValueRef.value = targetValueRef.value
      pause()
      onEndEvent.trigger()
      return
    }

    onProgressEvent.trigger(currentValueRef.value)
  }, { immediate: false })

  /**
   * 运行动画
   * @param value 可选，目标值，如果提供则覆盖当前目标值
   *
   * @example
   * ```ts
   * const { run } = useNumberAnimation(100, { manual: true })
   * run()
   * run(50)
   * ```
   */
  function run(value?: number) {
    if (value) {
      targetValueRef.value = value
    }
    startTime.value = performance.now()
    isFirst.value = true
    resume()
  }

  /**
   * 停止动画
   * 立即将当前值设置为目标值并触发结束事件
   *
   * @example
   * ```ts
   * const { stop } = useNumberAnimation(100)
   * stop()
   * ```
   */
  function stop() {
    pause()
    onEndEvent.trigger()
    currentValueRef.value = targetValueRef.value
  }

  if (!manual)
    run()

  return {
    value: readonly(computed(() => currentValueRef.value.toFixed(precision))),
    targetValue: targetValueRef,
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

/**
 * useNumberAnimation 函数的返回类型
 */
export type UseNumberAnimationReturns = ReturnType<typeof useNumberAnimation>
