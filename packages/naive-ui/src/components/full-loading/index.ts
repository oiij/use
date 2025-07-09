import type { SpinProps } from 'naive-ui'
import type { CSSProperties, RendererElement } from 'vue'

export { default as NFullLoading } from './FullLoading.vue'
export interface FullLoadingProps {
  show?: boolean
  appendTo?: string | RendererElement
  mask?: boolean | CSSProperties
  blur?: boolean
  disableScroll?: boolean
  scrollSelector?: string | HTMLElement
  spinProps?: Omit<SpinProps, 'show'>
}
