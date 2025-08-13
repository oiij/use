import type { SpinProps } from 'naive-ui'
import type { CSSProperties, RendererElement } from 'vue'
import type { ClassStyle } from '../data-table-plus'

export { default as NFullLoading } from './FullLoading.vue'
export type FullLoadingProps = & {
  show?: boolean
  appendTo?: string | RendererElement
  mask?: boolean | CSSProperties
  blur?: boolean
  disableScroll?: boolean
  scrollSelector?: string | HTMLElement
  spinProps?: Omit<SpinProps, 'show'> & ClassStyle
}
