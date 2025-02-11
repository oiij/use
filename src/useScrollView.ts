import { useDebounceFn, useElementSize } from '@vueuse/core'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Options {
  activeClassName?: string
  enableWheel?: boolean
}
export function useScrollView(options?: Options) {
  const { activeClassName = '.active', enableWheel = true } = options || {}
  const scrollRef = ref<HTMLElement>()
  const { width } = useElementSize(scrollRef)
  async function scrollToView() {
    if (!scrollRef.value)
      return
    await nextTick()
    const activeEl = scrollRef.value?.children[0].querySelector(activeClassName)
    if (!activeEl)
      return
    activeEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }
  function wheelEvent(e: WheelEvent) {
    const { deltaY } = e
    if (deltaY > 0) {
      // 向下滚动
      scrollRef.value?.scrollBy({
        top: 0,
        left: width.value,
        behavior: 'smooth',
      })
    }
    else {
      // 向上滚动
      scrollRef.value?.scrollBy({
        top: 0,
        left: -width.value,
        behavior: 'smooth',
      })
    }
  }
  function init() {
    if (!scrollRef.value || !enableWheel)
      return
    scrollRef.value.addEventListener('wheel', wheelEvent)
  }
  function destroy() {
    scrollRef.value?.removeEventListener('wheel', wheelEvent)
  }
  const debouncedScrollToView = useDebounceFn(scrollToView, 500)
  watch(width, () => {
    debouncedScrollToView()
  })
  onBeforeUnmount(() => {
    destroy()
  })
  onMounted(() => {
    scrollToView()
    init()
  })
  return {
    scrollRef,
    scrollToView,
  }
}
