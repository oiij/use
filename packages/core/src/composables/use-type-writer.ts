import type { ComputedRef, Ref } from 'vue'
import { createEventHook } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'

export interface TypeWriterOptions {
  step?: number
  interval?: number
  enabled?: boolean
}
interface IEventType {
  update: {
    index: number
    value: string
  }
  start: void
  stop: string
}

export function useTypeWriter(value: Ref<string> | ComputedRef<string>, options?: TypeWriterOptions) {
  const { step = 1, interval = 50, enabled = true } = options ?? {}
  const typeIndex = ref(0)
  const paused = ref(false)
  const ended = ref(false)
  const isTyping = ref(false)
  const typedValue = computed(() => enabled ? value.value.slice(0, typeIndex.value) : value.value)
  const progress = computed(() => Number(Math.min((typeIndex.value / value.value.length) * 100, 100).toFixed(2)))
  let timer: NodeJS.Timeout | null = null

  const onStatEvent = createEventHook<IEventType['start']>()
  const onStopEvent = createEventHook<IEventType['stop']>()
  const onUpdateEvent = createEventHook<IEventType['update']>()

  watch(value, (newValue, oldValue) => {
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
    immediate: true,
  })
  function start() {
    if (timer) {
      clearTimeout(timer)
    }
    if (!enabled) {
      typeIndex.value = value.value.length
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
      if (typeIndex.value >= value.value.length) {
        typeIndex.value = value.value.length
        ended.value = true
        isTyping.value = false
        onStopEvent.trigger(typedValue.value)
        return
      }
      timer = setTimeout(run, interval)
    }
    timer = setTimeout(run, interval)
  }

  function pause() {
    if (timer) {
      clearTimeout(timer)
    }
    paused.value = true
    isTyping.value = false
    ended.value = false
  }
  function resume() {
    if (timer) {
      clearTimeout(timer)
    }
    start()
  }
  function restart() {
    if (timer) {
      clearTimeout(timer)
    }
    typeIndex.value = 0
    nextTick(() => {
      start()
    })
  }
  function stop() {
    if (timer) {
      clearTimeout(timer)
    }
    isTyping.value = false
    paused.value = false
    ended.value = true
    typeIndex.value = value.value.length
    onStopEvent.trigger(typedValue.value)
  }
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
