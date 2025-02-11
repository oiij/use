import type { WritableComputedRef } from 'vue'
import { nextTick, ref, toValue } from 'vue'

interface ViewTransitionOptions {
  x?: number
  y?: number
  effect?: boolean
  reverse?: WritableComputedRef<boolean>
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
  z-index: 2147483646;
}`
export async function useViewTransition(toggle?: () => void, options?: ViewTransitionOptions) {
  const isAppearanceTransition = typeof document !== 'undefined' && !!document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { x = 0, y = 0, effect = true, reverse = ref(true), reverseSelector = '.dark' } = options ?? {}
  if (!isAppearanceTransition || !effect) {
    return toggle && toggle()
  }
  if (!document.querySelector('#view-transition-style')) {
    const style = document.createElement('style')
    style.id = 'view-transition-style'
    style.appendChild(document.createTextNode(styleText.replaceAll('._', reverseSelector)))
    document.head.appendChild(style)
  }

  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${endRadius}px at ${x}px ${y}px)`,
  ]
  await document.startViewTransition(async () => {
    toggle && toggle()
    await nextTick()
  }).ready
  return new Promise<void>((resolve) => {
    const isReverse = toValue(reverse)
    const animation = document.documentElement.animate(
      { clipPath: isReverse ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isReverse ? 'old' : 'new'}(root)`,
      },
    )
    animation.finished.then(() => {
      resolve()
    })
  })
}
