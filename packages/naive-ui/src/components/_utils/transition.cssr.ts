import type { CNode } from '@oiij/css-render'
import { cssr } from './cssr-bem'

const { c } = cssr

interface FadeInTransitionOptions {
  name?: string
  enterDuration?: string
  leaveDuration?: string
  enterCubicBezier?: string
  leaveCubicBezier?: string
}

export function fadeInTransition({
  name = 'fade-in',
  enterDuration = '0.2s',
  leaveDuration = '0.2s',
  enterCubicBezier = 'cubic-bezier(.4, 0, .2, 1)',
  leaveCubicBezier = 'cubic-bezier(.4, 0, .2, 1)',
}: FadeInTransitionOptions = {}): CNode[] {
  return [
    c(`&.${name}-transition-enter-active`, {
      transition: `all ${enterDuration} ${enterCubicBezier}!important`,
    }),
    c(`&.${name}-transition-leave-active`, {
      transition: `all ${leaveDuration} ${leaveCubicBezier}!important`,
    }),
    c(`&.${name}-transition-enter-from, &.${name}-transition-leave-to`, {
      opacity: 0,
    }),
    c(`&.${name}-transition-leave-from, &.${name}-transition-enter-to`, {
      opacity: 1,
    }),
  ]
}
