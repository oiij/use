import type { MaybeRefOrGetter } from 'vue'
import { useDebounceFn, useElementSize, useEventListener } from '@vueuse/core'
import { computed, nextTick, toValue, watch } from 'vue'

/**
 * 滚动方向枚举
 */
export type ScrollDirection = 'horizontal' | 'vertical'

/**
 * 滚动视图配置选项
 */
export type ScrollViewOptions = {
  /** 激活元素的 CSS 选择器，默认为 '.active' */
  activeClassName?: MaybeRefOrGetter<string>
  /** 是否启用滚轮滚动，默认为 true */
  enableWheel?: MaybeRefOrGetter<boolean>
  /** 滚动方向，默认为 'vertical' */
  direction?: MaybeRefOrGetter<ScrollDirection>
  /** 滚轮滚动时的滚动偏移量，默认为容器尺寸 */
  scrollOffset?: MaybeRefOrGetter<number>
  /** 滚动防抖延迟时间（毫秒），默认为 500 */
  debounceDelay?: MaybeRefOrGetter<number>
  /** 是否在容器尺寸变化时自动滚动到激活元素，默认为 true */
  autoScrollOnResize?: MaybeRefOrGetter<boolean>
  /** scrollIntoView 的默认配置选项 */
  scrollIntoViewOptions?: MaybeRefOrGetter<ScrollIntoViewOptions>
}

/**
 * 滚动视图 Composable
 * 提供平滑滚动到激活元素的功能，支持滚轮滚动和自动调整
 *
 * @param templateRef - 目标滚动容器的模板引用
 * @param options - 配置选项
 * @returns 返回包含滚动方法和状态的对象
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { useScrollView } from './use-scroll-view'
 *
 * const containerRef = ref<HTMLElement>()
 * const { scrollToView, scrollToNext, scrollToPrevious } = useScrollView(containerRef, {
 *   activeClassName: '.active',
 *   enableWheel: true,
 *   direction: 'vertical'
 * })
 * </script>
 *
 * <template>
 *   <div ref="containerRef" class="scroll-container">
 *     <div class="item">Item 1</div>
 *     <div class="item active">Item 2</div>
 *     <div class="item">Item 3</div>
 *   </div>
 * </template>
 * ```
 */
export function useScrollView(templateRef: MaybeRefOrGetter<HTMLElement | undefined>, options: ScrollViewOptions = {}) {
  const {
    activeClassName = '.active',
    enableWheel = true,
    direction = 'vertical',
    scrollOffset = 0,
    debounceDelay = 500,
    autoScrollOnResize = true,
    scrollIntoViewOptions = {},
  } = options

  const { width, height } = useElementSize(templateRef)

  /**
   * 获取滚动偏移量
   * 如果未指定 scrollOffset，则根据滚动方向使用容器尺寸
   */
  const getScrollOffset = computed(() => {
    const offset = toValue(scrollOffset)
    if (offset > 0)
      return offset
    return toValue(direction) === 'vertical' ? height.value : width.value
  })

  /**
   * 获取激活元素
   */
  function getActiveElement(): Element | null {
    const container = toValue(templateRef)
    if (!container)
      return null
    return container.querySelector(toValue(activeClassName))
  }

  /**
   * 获取所有可滚动元素
   */
  function getScrollableElements(): Element[] {
    const container = toValue(templateRef)
    if (!container)
      return []
    return Array.from(container.children)
  }

  /**
   * 滚动到激活元素
   * 使用 scrollIntoView API 实现平滑滚动
   *
   * @param customOptions - 自定义 ScrollIntoView 配置选项
   */
  async function scrollToView(customOptions?: ScrollIntoViewOptions) {
    await nextTick()
    const activeEl = getActiveElement()

    if (!activeEl)
      return

    activeEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
      ...toValue(scrollIntoViewOptions),
      ...customOptions,
    })
  }

  /**
   * 滚动到指定元素
   *
   * @param element - 目标元素
   * @param customOptions - 自定义 ScrollIntoView 配置选项
   */
  async function scrollToElement(element: Element, customOptions?: ScrollIntoViewOptions) {
    await nextTick()
    if (!element)
      return

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
      ...toValue(scrollIntoViewOptions),
      ...customOptions,
    })
  }

  /**
   * 滚动到下一个元素
   */
  async function scrollToNext() {
    const activeEl = getActiveElement()
    if (!activeEl)
      return

    const elements = getScrollableElements()
    const currentIndex = elements.indexOf(activeEl)
    const nextIndex = currentIndex + 1

    if (nextIndex < elements.length) {
      await scrollToElement(elements[nextIndex])
    }
  }

  /**
   * 滚动到上一个元素
   */
  async function scrollToPrevious() {
    const activeEl = getActiveElement()
    if (!activeEl)
      return

    const elements = getScrollableElements()
    const currentIndex = elements.indexOf(activeEl)
    const prevIndex = currentIndex - 1

    if (prevIndex >= 0) {
      await scrollToElement(elements[prevIndex])
    }
  }

  /**
   * 滚轮事件处理函数
   * 根据滚动方向和滚轮增量执行平滑滚动
   *
   * @param e - 滚轮事件对象
   */
  function wheelEvent(e: WheelEvent) {
    if (!toValue(enableWheel))
      return

    const container = toValue(templateRef)
    if (!container)
      return

    e.preventDefault()
    const { deltaY } = e
    const currentDirection = toValue(direction)
    const offset = getScrollOffset.value

    switch (currentDirection) {
      case 'vertical':
        container.scrollBy({
          top: deltaY > 0 ? offset : -offset,
          behavior: 'smooth',
        })
        break
      case 'horizontal':
        container.scrollBy({
          left: deltaY > 0 ? offset : -offset,
          behavior: 'smooth',
        })
        break
    }
  }

  useEventListener(templateRef, 'wheel', wheelEvent, { passive: false })

  const debouncedScrollToView = useDebounceFn(scrollToView, debounceDelay)

  watch([width, height, autoScrollOnResize], () => {
    if (toValue(autoScrollOnResize)) {
      debouncedScrollToView()
    }
  })

  return {
    scrollToView,
    scrollToElement,
    scrollToNext,
    scrollToPrevious,
    getActiveElement,
    getScrollableElements,
  }
}

/**
 * useScrollView 返回值类型
 */
export type UseScrollViewReturns = ReturnType<typeof useScrollView>
