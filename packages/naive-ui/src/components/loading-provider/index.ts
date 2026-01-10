import type { SpinProps } from 'naive-ui'
import type { CSSProperties, InjectionKey, RendererElement } from 'vue'
import type { ClassStyle } from '../data-table-plus'

export { default as NLoadingProvider } from './LoadingProvider.vue'

export type LoadingProviderInst = {
  show: (options?: {
    text?: string
    duration?: number
  }) => void
  hide: () => void
}

export const loadingProviderInjectionKey: InjectionKey<LoadingProviderInst> = Symbol('loading-provider-key')

export type LoadingProviderProps = {
  show?: boolean
  appendTo?: string | RendererElement
  mask?: boolean | CSSProperties
  blur?: boolean
  duration?: number
  spinProps?: Omit<SpinProps, 'show'> & ClassStyle
}
