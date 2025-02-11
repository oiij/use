import { computed, ref } from 'vue'

interface Options {
  from?: number
  to: number
  duration?: number
  onProgress?: (value: number) => void
  fixed?: number
}
export function useNumberAnimation(options: number | Options) {
  const { from = 0, to, duration = 5 * 60 * 60, onProgress = undefined, fixed = 2 } = typeof options === 'number' ? { to: options } : options
  const value = ref(from)
  const speed = (to - from) / duration
  const startTime = Date.now()
  function run() {
    const t = Date.now() - startTime
    if (t >= duration) {
      value.value = to
      onProgress?.(to)
      return
    }
    value.value = from + t * speed
    onProgress?.(value.value)
    requestAnimationFrame(run)
  }
  run()
  return {
    value: computed(() => Number(value.value.toFixed(fixed))),
  }
}
