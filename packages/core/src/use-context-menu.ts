import type { TemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { nextTick, ref } from 'vue'

/**
 * 上下文菜单配置选项
 * @example
 * const options: UseContextMenuOptions = {
 *   closeOnClickOutside: true,
 *   closeOnEscape: true,
 *   offset: { x: 10, y: 10 }
 * }
 */
export type UseContextMenuOptions = {
  /** 是否在点击外部时关闭上下文菜单，默认为 true */
  closeOnClickOutside?: boolean
  /** 是否在按 ESC 键时关闭上下文菜单，默认为 true */
  closeOnEscape?: boolean
  /** 上下文菜单的偏移量，默认为 { x: 0, y: 0 } */
  offset?: {
    x: number
    y: number
  }
}

/**
 * 上下文菜单组合式函数
 * 提供右键菜单的显示、隐藏和位置管理功能
 *
 * @param templateRef 可选的模板引用，用于指定监听上下文菜单事件的元素
 * @param options 上下文菜单配置选项
 * @returns 上下文菜单相关的状态和方法
 *
 * @example
 * // 基本用法
 * const container = ref<HTMLElement>()
 * const { x, y, show, hide } = useContextMenu(container, {
 *   closeOnClickOutside: true,
 *   closeOnEscape: true,
 *   offset: { x: 10, y: 10 }
 * })
 *
 * @example
 * // 在模板中使用
 * // <div ref="container">
 * //   右键点击此处
 * //   <div v-if="show" class="context-menu" :style="{ left: `${x}px`, top: `${y}px` }">
 * //     <div @click="hide">菜单项 1</div>
 * //   </div>
 * // </div>
 */
export function useContextMenu(templateRef?: TemplateRef<HTMLElement>, options?: UseContextMenuOptions) {
  const { closeOnClickOutside = true, closeOnEscape = true, offset = { x: 0, y: 0 } } = options ?? {}

  const x = ref(0)
  const y = ref(0)
  const show = ref(false)

  /**
   * 上下文菜单事件处理函数
   * 处理右键点击事件，显示上下文菜单
   * @param e 鼠标事件对象
   * @example
   * // 手动触发
   * contextMenuEvent(new MouseEvent('contextmenu'))
   */
  function contextMenuEvent(e: MouseEvent) {
    e.preventDefault()
    hide()
    nextTick(() => {
      show.value = true
      x.value = e.clientX + offset.x
      y.value = e.clientY + offset.y
    })
  }

  /**
   * 隐藏上下文菜单
   * 关闭显示的上下文菜单
   * @example
   * hide() // 隐藏菜单
   */
  function hide() {
    show.value = false
  }

  function handleClickOutside() {
    if (closeOnClickOutside && show.value) {
      hide()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (closeOnEscape && show.value && e.key === 'Escape') {
      hide()
    }
  }

  useEventListener(templateRef, 'contextmenu', contextMenuEvent)
  useEventListener('click', handleClickOutside)
  useEventListener('keydown', handleKeydown)

  return {
    templateRef,
    x,
    y,
    show,
    hide,
    contextMenuEvent,
  }
}

/**
 * useContextMenu 函数的返回类型
 * 包含上下文菜单的状态和方法
 * @example
 * const menu: UseContextMenuReturns = useContextMenu(elRef)
 */
export type UseContextMenuReturns = ReturnType<typeof useContextMenu>
