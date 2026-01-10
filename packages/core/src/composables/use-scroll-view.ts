import type { TemplateRef } from 'vue'
import { useDebounceFn, useElementSize, useEventListener } from '@vueuse/core'
import { nextTick, watch } from 'vue'

type ScrollViewOptions = {
  activeClassName?: string
  enableWheel?: boolean
  direction?: 'horizontal' | 'vertical'
}
export function useScrollView(templateRef: TemplateRef<HTMLElement>, options?: ScrollViewOptions) {
  const { activeClassName = '.active', enableWheel = true, direction = 'vertical' } = options ?? {}
  const { width, height } = useElementSize(templateRef)
  async function scrollToView(options?: ScrollIntoViewOptions) {
    await nextTick()
    const activeEl = templateRef.value?.querySelector(activeClassName)

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
        templateRef.value?.scrollBy({
          top: deltaY > 0 ? height.value : -height.value,
          behavior: 'smooth',
        })
        break
      case 'horizontal':
        templateRef.value?.scrollBy({
          left: deltaY > 0 ? width.value : -width.value,
          behavior: 'smooth',
        })
        break
    }
  }
  useEventListener(templateRef, 'wheel', wheelEvent)
  const debouncedScrollToView = useDebounceFn(scrollToView, 500)
  watch([width, height], () => {
    debouncedScrollToView()
  })

  return {
    templateRef,
    scrollToView,
  }
}
export type UseScrollViewReturns = ReturnType<typeof useScrollView>
