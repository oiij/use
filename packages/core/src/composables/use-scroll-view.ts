import { useDebounceFn, useElementSize, useEventListener } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'

interface ScrollViewOptions {
  activeClassName?: string
  enableWheel?: boolean
  direction?: 'horizontal' | 'vertical'
}
export function useScrollView(options?: ScrollViewOptions) {
  const { activeClassName = '.active', enableWheel = true, direction = 'vertical' } = options ?? {}
  const scrollRef = ref<HTMLElement>()
  const { width, height } = useElementSize(scrollRef)
  async function scrollToView(options?: ScrollIntoViewOptions) {
    await nextTick()
    const activeEl = scrollRef.value?.querySelector(activeClassName)

    if (!activeEl)
      return
    activeEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
      ...options,
    })
  }
  function wheelEvent(e: WheelEvent) {
    if (!enableWheel)
      return
    e.preventDefault()
    const { deltaY } = e
    switch (direction) {
      case 'vertical':
        scrollRef.value?.scrollBy({
          top: deltaY > 0 ? height.value : -height.value,
          behavior: 'smooth',
        })
        break
      case 'horizontal':
        scrollRef.value?.scrollBy({
          left: deltaY > 0 ? width.value : -width.value,
          behavior: 'smooth',
        })
        break
    }
  }
  useEventListener(scrollRef, 'wheel', wheelEvent)
  const debouncedScrollToView = useDebounceFn(scrollToView, 500)
  watch([width, height], () => {
    debouncedScrollToView()
  })

  return {
    scrollRef,
    scrollToView,
  }
}
export type UseScrollViewReturns = ReturnType<typeof useScrollView>
