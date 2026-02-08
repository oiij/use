import type { TemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import { nextTick, ref } from 'vue'

/**
 * 上下文菜单配置选项
 */
type UseContextMenuOptions = {
  /**
   * 是否在点击外部时关闭上下文菜单
   * @default true
   */
  closeOnClickOutside?: boolean
  /**
   * 是否在按 ESC 键时关闭上下文菜单
   * @default true
   */
  closeOnEscape?: boolean
  /**
   * 上下文菜单的偏移量
   * @default { x: 0, y: 0 }
   */
  offset?: {
    x: number
    y: number
  }
}

/**
 * 上下文菜单组合式函数
 *
 * @param {TemplateRef<HTMLElement>} [templateRef] - 可选的模板引用，用于指定监听上下文菜单事件的元素
 * @param {UseContextMenuOptions} [options] - 上下文菜单配置选项
 * @returns {object} 上下文菜单相关的状态和方法
 *
 * @example
 * ```vue
 * <template>
 *   <div ref="container">
 *     右键点击此处
 *     <div v-if="show" class="context-menu" :style="{ left: `${x}px`, top: `${y}px` }">
 *       <div @click="hide">菜单项 1</div>
 *       <div @click="hide">菜单项 2</div>
 *       <div @click="hide">菜单项 3</div>
 *     </div>
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { useContextMenu } from '@/composables/useContextMenu'
 *
 * const container = ref<HTMLElement>()
 * const { x, y, show, hide } = useContextMenu(container, {
 *   closeOnClickOutside: true,
 *   closeOnEscape: true,
 *   offset: { x: 10, y: 10 }
 * })
 * </script>
 *
 * <style scoped>
 * .context-menu {
 *   position: fixed;
 *   background: white;
 *   border: 1px solid #ccc;
 *   border-radius: 4px;
 *   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
 *   padding: 8px 0;
 *   z-index: 1000;
 * }
 *
 * .context-menu > div {
 *   padding: 8px 16px;
 *   cursor: pointer;
 * }
 *
 * .context-menu > div:hover {
 *   background: #f5f5f5;
 * }
 * </style>
 * ```
 */
export function useContextMenu(
  templateRef?: TemplateRef<HTMLElement>,
  options: UseContextMenuOptions = {},
) {
  // 默认配置
  const defaultOptions: Required<UseContextMenuOptions> = {
    closeOnClickOutside: true,
    closeOnEscape: true,
    offset: { x: 0, y: 0 },
  }

  // 合并配置
  const config = { ...defaultOptions, ...options }

  // 上下文菜单的 x 坐标
  const x = ref(0)
  // 上下文菜单的 y 坐标
  const y = ref(0)
  // 上下文菜单的显示状态
  const show = ref(false)

  /**
   * 上下文菜单事件处理函数
   * @param {MouseEvent} e - 鼠标事件对象
   */
  function contextMenuEvent(e: MouseEvent) {
    // 阻止默认的上下文菜单
    e.preventDefault()
    // 先隐藏已有的菜单
    hide()
    // 在下一个 tick 中显示菜单并设置坐标
    nextTick(() => {
      show.value = true
      x.value = e.clientX + config.offset.x
      y.value = e.clientY + config.offset.y
    })
  }

  /**
   * 隐藏上下文菜单
   */
  function hide() {
    show.value = false
  }

  /**
   * 点击外部事件处理函数
   */
  function handleClickOutside() {
    if (config.closeOnClickOutside && show.value) {
      hide()
    }
  }

  /**
   * 键盘事件处理函数
   * @param {KeyboardEvent} e - 键盘事件对象
   */
  function handleKeydown(e: KeyboardEvent) {
    if (config.closeOnEscape && show.value && e.key === 'Escape') {
      hide()
    }
  }

  // 监听元素的 contextmenu 事件
  useEventListener(templateRef, 'contextmenu', contextMenuEvent)

  // 监听全局点击事件，用于关闭外部点击
  useEventListener('click', handleClickOutside)

  // 监听全局键盘事件，用于 ESC 键关闭
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
 */
export type UseContextMenuReturns = ReturnType<typeof useContextMenu>
