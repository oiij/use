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
  /** 起始值，默认为 0 */
  from?: number
  /** 是否手动控制动画，默认为 false（自动触发） */
  manual?: boolean
  /** 动画持续时间（毫秒），默认为 1000ms */
  duration?: number
  /** 精度，保留小数位数，默认为 2 */
  precision?: number
  /** 缓动函数，默认为 'linear' */
  easing?: EasingFunction
}

/**
 * 内置缓动函数集合
 */
const easingFns: Record<string, (t: number) => number> = {
  linear: t => t, // 线性动画
  easeIn: t => t * t, // 加速效果
  easeOut: t => 1 - (1 - t) ** 2, // 减速效果
  easeInOut: t => t < 0.5
    ? 2 * t * t // 前半段加速
    : 1 - (-2 * t + 2) ** 2 / 2, // 后半段减速
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
 * // 基本用法
 * const { value: animatedValue } = useNumberAnimation(100)
 *
 * @example
 * // 自定义配置
 * const { value: animatedValue, run, stop } = useNumberAnimation(100, {
 *   from: 0,         // 起始值
 *   duration: 2000,  // 动画持续时间 2 秒
 *   precision: 0,    // 整数精度
 *   easing: 'easeInOut', // 缓动函数
 *   manual: false    // 自动触发
 * })
 *
 * @example
 * // 手动控制
 * const { value: animatedValue, run, stop } = useNumberAnimation(0, { manual: true })
 * // 触发动画到 50
 * run(50)
 * // 停止动画
 * stop()
 */
export function useNumberAnimation(to: MaybeRefOrGetter<number>, options?: NumberAnimationOptions) {
  // 解构配置选项，设置默认值
  const { from = 0, manual = false, duration = 1 * 1000, precision = 2, easing = 'linear' } = options ?? {}

  // 获取缓动函数
  const easingFn = typeof easing === 'function'
    ? easing
    : easingFns[easing] || easingFns.linear

  // 当前动画值
  const currentValueRef = ref(from)

  // 监听目标值变化，自动触发动画（非手动模式）
  const targetValueRef = watchRefOrGetter(to, () => {
    if (!manual) {
      run()
    }
  })

  // 动画开始时间
  const startTime = ref(0)
  // 是否为第一次运行（用于触发 start 事件）
  const isFirst = ref(true)

  // 事件钩子
  const onStartEvent = createEventHook<[]>() // 动画开始事件
  const onEndEvent = createEventHook<[]>() // 动画结束事件
  const onProgressEvent = createEventHook<[number]>() // 动画进度事件

  // 使用 RAF（RequestAnimationFrame）实现动画
  const { pause, resume, isActive } = useRafFn(() => {
    // 计算已经过的时间
    const elapsed = performance.now() - startTime.value

    // 第一次运行时触发开始事件
    if (isFirst.value) {
      isFirst.value = false
      onStartEvent.trigger()
    }

    // 计算进度（0-1）
    const progress = Math.min(elapsed / duration, 1)
    // 应用缓动函数
    const easedProgress = easingFn(progress)
    // 计算当前值
    currentValueRef.value = from + (targetValueRef.value - from) * easedProgress

    // 动画结束条件
    if (progress >= 1) {
      // 确保最终值为目标值
      currentValueRef.value = targetValueRef.value
      // 暂停动画
      pause()
      // 触发结束事件
      onEndEvent.trigger()
      return
    }

    // 触发进度事件
    onProgressEvent.trigger(currentValueRef.value)
  }, { immediate: false })

  /**
   * 运行动画
   * @param value 可选，目标值，如果提供则覆盖当前目标值
   */
  function run(value?: number) {
    if (value) {
      targetValueRef.value = value
    }
    // 重置开始时间
    startTime.value = performance.now()
    // 重置第一次运行标志
    isFirst.value = true
    // 恢复动画
    resume()
  }

  /**
   * 停止动画
   * 立即将当前值设置为目标值并触发结束事件
   */
  function stop() {
    // 暂停动画
    pause()
    // 触发结束事件
    onEndEvent.trigger()
    // 立即设置为目标值
    currentValueRef.value = targetValueRef.value
  }

  // 非手动模式下自动触发动画
  if (!manual)
    run()

  return {
    /** 当前动画值（带精度处理） */
    value: readonly(computed(() => currentValueRef.value.toFixed(precision))),
    /** 目标值 */
    targetValue: targetValueRef,
    /** 动画是否激活 */
    isActive,
    /** 运行动画 */
    run,
    /** 停止动画 */
    stop,
    /** 暂停动画 */
    pause,
    /** 恢复动画 */
    resume,
    /** 动画开始事件 */
    onStart: onStartEvent.on,
    /** 动画结束事件 */
    onEnd: onEndEvent.on,
    /** 动画进度事件 */
    onProgress: onProgressEvent.on,
  }
}

/**
 * useNumberAnimation 函数的返回类型
 */
export type UseNumberAnimationReturns = ReturnType<typeof useNumberAnimation>
