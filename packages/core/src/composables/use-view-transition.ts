import { nextTick } from 'vue'

type ViewTransitionOptions = {
  duration?: number
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  effect?: boolean
  reverseSelector?: string
}
const styleText = `
::view-transition-old(root),::view-transition-new(root){
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root),._::view-transition-new(root){
  z-index: 1;
}
::view-transition-new(root),._::view-transition-old(root){
  z-index: 99999;
}`
export function useViewTransition(options?: ViewTransitionOptions) {
  const isAppearanceTransition = typeof document !== 'undefined' && !!document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const { duration = 300, easing = 'linear', effect = true, reverseSelector = '.dark' } = options ?? {}

  if (typeof document !== 'undefined' && !document.querySelector('style[vts-id="view-transition-style"]')) {
    const style = document.createElement('style')
    style.setAttribute('vts-id', 'view-transition-style')
    style.appendChild(document.createTextNode(styleText.replaceAll('._', reverseSelector)))
    document.head.appendChild(style)
  }
  async function run(cb: () => void, opt?: { reverse?: boolean, x: number, y: number }) {
    const { reverse = false, x = 0, y = 0 } = opt ?? {}
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    if (!isAppearanceTransition || !effect) {
      if (typeof cb === 'function') {
        await Promise.try(cb)
      }
      return
    }
    await document.startViewTransition(async () => {
      if (typeof cb === 'function') {
        await Promise.try(cb)
      }
      await nextTick()
    }).ready
    await document.documentElement.animate(
      { clipPath: reverse ? clipPath.reverse() : clipPath },
      {
        duration,
        easing,
        fill: 'forwards',
        pseudoElement: `::view-transition-${reverse ? 'old' : 'new'}(root)`,
      },
    ).finished
  }
  return { run }
}
export type UseViewTransitionReturns = ReturnType<typeof useViewTransition>
