import type { VNode } from 'vue'

type VNodeChild = VNode | string | number | undefined | void | null | boolean
export type TabItemKey = string | number
export { default as CTabs } from './Tabs.vue'
export interface TabsOptions {
  key: TabItemKey
  label: string | ((key: TabItemKey, index: number) => VNodeChild)
  icon?: (key: TabItemKey, index: number) => VNodeChild
  closable?: boolean
  disabled?: boolean
  loading?: boolean
  loadingIcon?: (key: TabItemKey, index: number) => VNodeChild
  onClick?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onContextMenu?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onClose?: (key: TabItemKey, index: number, ev: MouseEvent) => void
}
export type TabsItemProps = Omit<TabsOptions, 'key'> & {
  activeIndex?: number
  itemIndex: number
  itemKey: TabItemKey
}
export interface TabsProps {
  colors?: {
    active?: string
    primary?: string
    background?: string
  }
  dropdown?: boolean
  addable?: boolean
  options?: TabsOptions[]
}
