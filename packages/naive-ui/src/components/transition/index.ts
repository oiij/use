import type { TransitionProps as BaseTransitionProps } from 'vue'
import type { ClassStyle } from '../data-table-plus'

export { default as NTransition } from './BaseTransition.vue'
export type TransitionProps = & {
  name?: string
  transitionProps?: BaseTransitionProps & ClassStyle
}
