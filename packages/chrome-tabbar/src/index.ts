import type { CSSProperties, VNode } from 'vue'

type VNodeChild = VNode | string | number | undefined | void | null | boolean
export type TabItemKey = string | number
export { default as CTabs } from './Tabs.vue'
export type TabsOption = & {
  key: TabItemKey
  label: string | ((key: TabItemKey, index: number) => VNodeChild)
  icon?: (key: TabItemKey, index: number) => VNodeChild
  closable?: boolean | ((key: TabItemKey, index: number) => boolean)
  disabled?: boolean | ((key: TabItemKey, index: number) => boolean)
  loading?: boolean | ((key: TabItemKey, index: number) => boolean)
  loadingIcon?: (key: TabItemKey, index: number) => VNodeChild
  onClick?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onContextMenu?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onClose?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  class?: string
  style?: CSSProperties | string
}
export type TabsItemProps = Omit<TabsOption, 'key'> & {
  activeIndex?: number
  itemIndex: number
  itemKey: TabItemKey
}
export type TabsProps = & {
  value?: TabItemKey
  colors?: {
    active?: string
    primary?: string
    background?: string
  }
  dropdown?: boolean
  addable?: boolean
  options?: TabsOption[]
  loadingValue?: TabItemKey
  contentClass?: string
  contentStyle?: CSSProperties | string
}
