import type { SpinProps } from 'naive-ui'
import type { CSSProperties, InjectionKey, RendererElement } from 'vue'
import type { ClassStyle } from '../data-table-plus'

export { default as NLoadingProvider } from './LoadingProvider.vue'

/**
 * 加载提供者实例
 */
export type LoadingProviderInst = {
  /** 显示加载 */
  show: (options?: {
    /** 加载文本 */
    text?: string
    /** 持续时间 */
    duration?: number
  }) => void
  /** 隐藏加载 */
  hide: () => void
}

/**
 * 加载提供者注入键
 */
export const LOADING_PROVIDER_INJECTION_KEY: InjectionKey<LoadingProviderInst> = Symbol('loading-provider-key')

/**
 * 加载提供者属性
 */
export type LoadingProviderProps = {
  /** 是否显示 */
  show?: boolean
  /** 挂载目标元素 */
  appendTo?: string | RendererElement
  /** 遮罩层配置 */
  mask?: boolean | CSSProperties
  /** 是否模糊 */
  blur?: boolean
  /** 持续时间 */
  duration?: number
  /** 加载组件属性 */
  spinProps?: Omit<SpinProps, 'show'> & ClassStyle
}
