import type { MaybeRefOrGetter } from 'vue'
import { createEventHook } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

/**
 * 打字机效果配置选项
 */
export type TypeWriterOptions = {
  /** 每次打字的字符步长，默认为 1 */
  step?: number
  /** 打字间隔时间（毫秒），默认为 50ms */
  interval?: number
  /** 是否启用打字效果，默认为 true。禁用时直接显示完整文本 */
  enabled?: boolean
  /** 是否手动控制，默认为 false。为 true 时不自动开始 */
  manual?: boolean
}

/**
 * 事件类型定义
 */
type IEventType = {
  /** 更新事件，包含当前索引和已打字的值 */
  update: {
    index: number
    value: string
  }
  /** 开始事件，无参数 */
  start: void
  /** 停止事件，返回最终打字的值 */
  stop: string
}

/**
 * 打字机效果 composable
 *
 * 创建一个打字机效果，可以逐字显示文本内容。
 *
 * @example
 * ```ts
 * // 基础用法
 * const text = ref('Hello World!')
 * const { typedValue, isTyping, start, stop } = useTypeWriter(text)
 *
 * // 自定义配置
 * const { typedValue } = useTypeWriter(text, {
 *   step: 2,           // 每次打 2 个字符
 *   interval: 100,     // 间隔 100ms
 *   enabled: true,     // 启用打字效果
 *   manual: false,     // 自动开始
 * })
 *
 * // 监听事件
 * const { onUpdate, onStop } = useTypeWriter(text)
 * onUpdate(({ index, value }) => {
 *   console.log(`当前索引: ${index}, 已打字: ${value}`)
 * })
 * onStop((finalValue) => {
 *   console.log(`打字完成: ${finalValue}`)
 * })
 *
 * // 手动控制
 * const { start, pause, resume, restart, stop } = useTypeWriter(text, { manual: true })
 * start()    // 开始打字
 * pause()    // 暂停
 * resume()   // 继续
 * restart()  // 重新开始
 * stop()     // 停止并显示完整文本
 * ```
 *
 * @param value - 要显示的文本，可以是 ref、getter 或普通字符串
 * @param options - 配置选项
 * @returns 打字机效果的控制对象和状态
 */
export function useTypeWriter(value: MaybeRefOrGetter<string>, options?: TypeWriterOptions) {
  const { step = 1, interval = 50, enabled = true, manual } = options ?? {}
  const valueRef = watchRefOrGetter(value)
  const typeIndex = ref(0)
  const paused = ref(false)
  const ended = ref(false)
  const isTyping = ref(false)
  const typedValue = computed(() => enabled ? valueRef.value.slice(0, typeIndex.value) : valueRef.value)
  const progress = computed(() => Number(Math.min((typeIndex.value / valueRef.value.length) * 100, 100).toFixed(2)))
  let timer: NodeJS.Timeout | null = null

  const onStatEvent = createEventHook<IEventType['start']>()
  const onStopEvent = createEventHook<IEventType['stop']>()
  const onUpdateEvent = createEventHook<IEventType['update']>()

  // 监听源文本变化，自动重新开始打字
  watch(valueRef, (newValue, oldValue) => {
    if (!oldValue) {
      typeIndex.value = 0
      start()
      return
    }
    if (newValue.startsWith(oldValue)) {
      start()
    }
    else {
      typeIndex.value = 0
      start()
    }
  }, {
    immediate: !manual,
  })

  /**
   * 开始打字
   * 清除之前的定时器，重置状态，开始逐字显示文本
   */
  function start() {
    if (timer) {
      clearTimeout(timer)
    }
    // 如果禁用打字效果，直接显示完整文本
    if (!enabled) {
      typeIndex.value = valueRef.value.length
      ended.value = true
      isTyping.value = false
      paused.value = false
      onStopEvent.trigger(typedValue.value)

      return
    }
    isTyping.value = true
    paused.value = false
    ended.value = false
    onStatEvent.trigger()
    function run() {
      typeIndex.value += step
      onUpdateEvent.trigger({ index: typeIndex.value, value: typedValue.value })
      // 检查是否打字完成
      if (typeIndex.value >= valueRef.value.length) {
        typeIndex.value = valueRef.value.length
        ended.value = true
        isTyping.value = false
        onStopEvent.trigger(typedValue.value)
        return
      }
      timer = setTimeout(run, interval)
    }
    timer = setTimeout(run, interval)
  }

  /**
   * 暂停打字
   * 清除定时器，将状态设置为暂停
   */
  function pause() {
    if (timer) {
      clearTimeout(timer)
    }
    paused.value = true
    isTyping.value = false
    ended.value = false
  }

  /**
   * 恢复打字
   * 清除之前的定时器，从当前位置继续打字
   */
  function resume() {
    if (timer) {
      clearTimeout(timer)
    }
    start()
  }

  /**
   * 重新开始打字
   * 清除定时器，重置索引到 0，然后重新开始打字
   */
  function restart() {
    if (timer) {
      clearTimeout(timer)
    }
    typeIndex.value = 0
    nextTick(() => {
      start()
    })
  }

  /**
   * 停止打字
   * 清除定时器，显示完整文本，标记为已结束
   */
  function stop() {
    if (timer) {
      clearTimeout(timer)
    }
    isTyping.value = false
    paused.value = false
    ended.value = true
    typeIndex.value = valueRef.value.length
    onStopEvent.trigger(typedValue.value)
  }

  /**
   * 销毁打字机实例
   * 清除定时器，重置所有状态到初始值
   */
  function destroy() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = null
    isTyping.value = false
    paused.value = false
    ended.value = false
    typeIndex.value = 0
  }
  return {
    value: valueRef,
    typeIndex,
    paused,
    ended,
    isTyping,
    typedValue,
    progress,
    start,
    pause,
    resume,
    restart,
    stop,
    destroy,
    onStat: onStatEvent.on,
    onStop: onStopEvent.on,
    onUpdate: onUpdateEvent.on,
  }
}
export type UseTypeWriterReturns = ReturnType<typeof useTypeWriter>
