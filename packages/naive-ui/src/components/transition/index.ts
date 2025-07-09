import type { TransitionProps as BaseTransitionProps } from 'vue'

export { default as NTransition } from './BaseTransition.vue'
export interface TransitionProps {
  name?: string
  transitionProps?: BaseTransitionProps
}
