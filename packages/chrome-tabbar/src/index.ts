import type { VNode } from 'vue'

type VNodeChild = VNode | string | number | undefined | void | null | boolean

export { default as CTabItem } from './TabItem.vue'
export { default as CTabs } from './Tabs.vue'
export interface TabsOptions {
  key: string
  label: string | (() => VNodeChild)
  icon?: () => VNodeChild
  closable?: boolean
  disabled?: boolean
  loading?: boolean
  loadingIcon?: () => VNodeChild
  onClick?: (ev: MouseEvent) => void
  onContextMenu?: (ev: MouseEvent) => void
  onClose?: () => void
}
export type TabsItemProps = Omit<TabsOptions, 'key'> & {
  activeIndex?: number
  index: number
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
