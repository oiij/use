import type { TransitionProps as BaseTransitionProps } from 'vue'
import type { ClassStyle } from '../data-table-plus'

export { default as NTransition } from './BaseTransition.vue'

/**
 * 过渡动画属性
 */
export type TransitionProps = {
  /** 过渡名称 */
  name?: string
  /** 过渡属性 */
  transitionProps?: BaseTransitionProps & ClassStyle
}
