import { nextTick } from 'vue'

/**
 * 视图过渡选项配置
 */
export type ViewTransitionOptions = {
  /**
   * 动画持续时间，单位毫秒
   * @default 300
   */
  duration?: number
  /**
   * 动画缓动函数
   * @default 'linear'
   */
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  /**
   * 是否启用过渡效果
   * @default true
   */
  effect?: boolean
  /**
   * 反转选择器，用于控制特定元素（如暗黑模式）的层级
   * @default '.dark'
   */
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

/**
 * 使用视图过渡 API 的组合式函数
 * 封装了 View Transition API，提供带圆形裁剪动画的视图过渡效果
 *
 * @param options 过渡配置选项
 * @returns 包含 run 方法的对象
 *
 * @example
 * ```ts
 * const { run } = useViewTransition({
 *   duration: 500,
 *   easing: 'ease-in-out'
 * })
 *
 * await run(() => {
 *   state.value = !state.value
 * }, { x: 100, y: 100 })
 * ```
 */
export function useViewTransition(options?: ViewTransitionOptions) {
  const isAppearanceTransition = typeof document !== 'undefined' && !!document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const { duration = 300, easing = 'linear', effect = true, reverseSelector = '.dark' } = options ?? {}

  if (typeof document !== 'undefined' && !document.querySelector('style[vts-id="view-transition-style"]')) {
    const style = document.createElement('style')
    style.setAttribute('vts-id', 'view-transition-style')
    style.appendChild(document.createTextNode(styleText.replaceAll('._', reverseSelector)))
    document.head.appendChild(style)
  }

  /**
   * 执行视图过渡动画
   * 在指定的坐标点执行圆形裁剪动画，支持正向和反向过渡
   *
   * @param cb 需要在过渡期间执行的回调函数
   * @param opt 过渡选项
   * @param opt.reverse 是否反向动画
   * @param opt.x 动画中心点 X 坐标
   * @param opt.y 动画中心点 Y 坐标
   *
   * @example
   * ```ts
   * await run(() => {
   *   toggleTheme()
   * }, { x: event.clientX, y: event.clientY })
   * ```
   *
   * @example
   * ```ts
   * await run(() => {
   *   toggleTheme()
   * }, { reverse: true, x: event.clientX, y: event.clientY })
   * ```
   */
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

/**
 * useViewTransition 函数的返回类型
 */
export type UseViewTransitionReturns = ReturnType<typeof useViewTransition>
