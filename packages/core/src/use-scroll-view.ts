import type { MaybeRefOrGetter } from 'vue'
import { useDebounceFn, useElementSize, useEventListener } from '@vueuse/core'
import { computed, nextTick, toValue, watch } from 'vue'

/**
 * 滚动方向
 * - horizontal: 水平滚动
 * - vertical: 垂直滚动
 */
export type ScrollDirection = 'horizontal' | 'vertical'

/**
 * 滚动视图配置选项
 */
export type ScrollViewOptions = {
  /**
   * 激活元素的 CSS 选择器
   * @default '.active'
   */
  activeClassName?: string
  /**
   * 是否启用滚轮滚动
   * @default true
   */
  enableWheel?: boolean
  /**
   * 滚动方向
   * @default 'vertical'
   */
  direction?: ScrollDirection
  /**
   * 滚轮滚动时的滚动偏移量，默认为容器尺寸
   */
  scrollOffset?: number
  /**
   * 滚动防抖延迟时间（毫秒）
   * @default 500
   */
  debounceDelay?: number
  /**
   * 是否在容器尺寸变化时自动滚动到激活元素
   * @default true
   */
  autoScrollOnResize?: boolean
  /**
   * scrollIntoView 的默认配置选项
   */
  scrollIntoViewOptions?: ScrollIntoViewOptions
}

/**
 * 滚动视图 Composable
 * 提供平滑滚动到激活元素的功能，支持滚轮滚动和自动调整
 *
 * @param templateRef 目标滚动容器的模板引用
 * @param options 配置选项
 * @returns 返回包含滚动方法和状态的对象
 *
 * @example
 * ```ts
 * const containerRef = ref<HTMLElement>()
 * const { scrollToView, scrollToNext, scrollToPrevious } = useScrollView(containerRef, {
 *   activeClassName: '.active',
 *   enableWheel: true,
 *   direction: 'vertical'
 * })
 * ```
 */
export function useScrollView(templateRef: MaybeRefOrGetter<HTMLElement | undefined>, options?: ScrollViewOptions) {
  const {
    activeClassName = '.active',
    enableWheel = true,
    direction = 'vertical',
    scrollOffset = 0,
    debounceDelay = 500,
    autoScrollOnResize = true,
    scrollIntoViewOptions = {},
  } = options ?? {}

  const { width, height } = useElementSize(templateRef)

  const getScrollOffset = computed(() => {
    if (scrollOffset && scrollOffset > 0)
      return scrollOffset
    return direction === 'vertical' ? height.value : width.value
  })

  function getActiveElement(): Element | null {
    const container = toValue(templateRef)
    if (!container)
      return null
    return container.querySelector(activeClassName)
  }

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
   * @param customOptions 自定义 ScrollIntoView 配置选项
   *
   * @example
   * ```ts
   * const { scrollToView } = useScrollView(containerRef)
   * scrollToView()
   * scrollToView({ behavior: 'auto', block: 'center' })
   * ```
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
      ...scrollIntoViewOptions,
      ...customOptions,
    })
  }

  /**
   * 滚动到指定元素
   *
   * @param element 目标元素
   * @param customOptions 自定义 ScrollIntoView 配置选项
   *
   * @example
   * ```ts
   * const { scrollToElement } = useScrollView(containerRef)
   * const element = document.querySelector('.item')
   * if (element) scrollToElement(element)
   * ```
   */
  async function scrollToElement(element: Element, customOptions?: ScrollIntoViewOptions) {
    await nextTick()
    if (!element)
      return

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
      ...scrollIntoViewOptions,
      ...customOptions,
    })
  }

  /**
   * 滚动到下一个元素
   *
   * @example
   * ```ts
   * const { scrollToNext } = useScrollView(containerRef)
   * scrollToNext()
   * ```
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
   *
   * @example
   * ```ts
   * const { scrollToPrevious } = useScrollView(containerRef)
   * scrollToPrevious()
   * ```
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

  function wheelEvent(e: WheelEvent) {
    if (!enableWheel)
      return

    const container = toValue(templateRef)
    if (!container)
      return

    e.preventDefault()
    const { deltaY } = e
    const offset = getScrollOffset.value

    switch (direction) {
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

  watch([width, height], () => {
    if (autoScrollOnResize) {
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
 * useScrollView 函数的返回类型
 */
export type UseScrollViewReturns = ReturnType<typeof useScrollView>
