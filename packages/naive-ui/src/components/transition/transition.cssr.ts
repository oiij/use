import type { CNode } from '@oiij/css-render'
import { c, cB, nB } from '../_utils/cssr-bem'

type FadeInTransitionOptions = {
  name?: string
  enterDuration?: string
  leaveDuration?: string
  enterCubicBezier?: string
  leaveCubicBezier?: string
}
export const cName = nB('transition')
export function fadeTransition({
  name = 'fade',
  enterDuration = '.3s',
  leaveDuration = '.3s',
  enterCubicBezier = 'cubic-bezier(.4, 0, .2, 1)',
  leaveCubicBezier = 'cubic-bezier(.4, 0, .2, 1)',
}: FadeInTransitionOptions = {}): CNode[] {
  return [
    cB(`${name}-enter-active`, {
      transition: `all ${enterDuration} ${enterCubicBezier}!important`,
    }),
    cB(`${name}-leave-active`, {
      transition: `all ${leaveDuration} ${leaveCubicBezier}!important`,
    }),
    cB(`${name}-enter-from`, {
      opacity: 0,
    }),
    cB(`${name}-leave-to`, {
      opacity: 0,
    }),
  ]
}
export function transitionCssr() {
  return c([
    fadeTransition(),
  ])
}
