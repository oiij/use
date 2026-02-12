import type { CSSProperties, VNode } from 'vue'

type VNodeChild = VNode | string | number | undefined | void | null | boolean

/**
 * 标签页键类型
 */
export type TabItemKey = string | number

/**
 * 标签页组件
 *
 * @example
 * ```vue
 * <template>
 *   <CTabs
 *     v-model="activeKey"
 *     :options="options"
 *     :addable="true"
 *     @add="handleAdd"
 *   />
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { CTabs, type TabsOption } from '@oiij/chrome-tabs'
 *
 * const activeKey = ref('1')
 * const options = ref<TabsOption[]>([
 *   { key: '1', label: '标签页 1' },
 *   { key: '2', label: '标签页 2' },
 *   { key: '3', label: '标签页 3', closable: true }
 * ])
 *
 * const handleAdd = () => {
 *   const newKey = String(options.value.length + 1)
 *   options.value.push({
 *     key: newKey,
 *     label: `标签页 ${newKey}`,
 *     closable: true
 *   })
 *   activeKey.value = newKey
 * }
 * </script>
 * ```
 */
export { default as CTabs } from './Tabs.vue'

/**
 * 标签页选项配置
 */
export type TabsOption = {
  /**
   * 标签页键
   */
  key: TabItemKey
  /**
   * 标签页标题
   */
  label: string | ((key: TabItemKey, index: number) => VNodeChild)
  /**
   * 标签页图标
   */
  icon?: (key: TabItemKey, index: number) => VNodeChild
  /**
   * 是否可关闭
   * @default false
   */
  closable?: boolean | ((key: TabItemKey, index: number) => boolean)
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean | ((key: TabItemKey, index: number) => boolean)
  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean | ((key: TabItemKey, index: number) => boolean)
  /**
   * 加载图标
   */
  loadingIcon?: (key: TabItemKey, index: number) => VNodeChild
  /**
   * 点击事件
   */
  onClick?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  /**
   * 右键菜单事件
   */
  onContextMenu?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  /**
   * 关闭事件
   */
  onClose?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  /**
   * 自定义类名
   */
  class?: string
  /**
   * 自定义样式
   */
  style?: CSSProperties | string
}

/**
 * 标签项属性
 */
export type TabsItemProps = Omit<TabsOption, 'key'> & {
  /**
   * 激活索引
   */
  activeIndex?: number
  /**
   * 项索引
   */
  itemIndex: number
  /**
   * 项键
   */
  itemKey: TabItemKey
  /**
   * 图标大小
   */
  iconSize?: number
}

/**
 * 标签页组件属性
 */
export type TabsProps = {
  /**
   * 当前激活的标签页键
   */
  value?: TabItemKey
  /**
   * 颜色配置
   */
  colors?: {
    /**
     * 激活状态颜色
     */
    active?: string
    /**
     * 主要颜色
     */
    primary?: string
    /**
     * 背景颜色
     */
    background?: string
  }
  /**
   * 是否显示下拉菜单
   * @default false
   */
  dropdown?: boolean
  /**
   * 是否可添加标签页
   * @default false
   */
  addable?: boolean
  /**
   * 标签页选项配置
   */
  options?: TabsOption[]
  /**
   * 加载中的标签页键
   */
  loadingValue?: TabItemKey
  /**
   * 图标大小
   */
  iconSize?: number
  /**
   * 内容区域类名
   */
  contentClass?: string
  /**
   * 内容区域样式
   */
  contentStyle?: CSSProperties | string
}
