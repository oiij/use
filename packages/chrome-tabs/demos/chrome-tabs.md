# Chrome-Tabs Chrome 风格标签页

## Demo

<demo vue="./chrome-tabs.vue" title="Chrome-Tabs Base" />

## Types

```ts
import type { VNode } from 'vue'

type VNodeChild = VNode | string | number | undefined | void | null | boolean

export type TabsOptions = {
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
export type TabsProps = {
  colors?: {
    active?: string
    primary?: string
    background?: string
  }
  dropdown?: boolean
  addable?: boolean
  options?: TabsOptions[]
}
```
