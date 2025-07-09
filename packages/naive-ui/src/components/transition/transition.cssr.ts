import type { CNode } from '@oiij/css-render'
import { cssr, namespace, plugin } from '../_utils/cssr-bem'

const { c } = cssr
const { cB } = plugin
interface FadeInTransitionOptions {
  name?: string
  enterDuration?: string
  leaveDuration?: string
  enterCubicBezier?: string
  leaveCubicBezier?: string
}
export { namespace }
export const cName = `${namespace}-transition`
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
