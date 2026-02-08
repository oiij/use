import { nextTick } from 'vue'

/**
 * 视图过渡选项配置
 * @description 用于配置视图过渡动画的各项参数
 */
export type ViewTransitionOptions = {
  /** 动画持续时间，单位毫秒，默认 300ms */
  duration?: number
  /** 动画缓动函数，默认 'linear' */
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  /** 是否启用过渡效果，默认 true */
  effect?: boolean
  /** 反转选择器，用于控制特定元素（如暗黑模式）的层级，默认 '.dark' */
  reverseSelector?: string
}

/**
 * 视图过渡样式文本
 * @description 用于控制视图过渡期间的元素层级和混合模式
 */
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
 * @description 封装了 View Transition API，提供带圆形裁剪动画的视图过渡效果
 * @param options - 过渡配置选项
 * @returns 包含 run 方法的对象
 *
 * @example
 * ```ts
 * const { run } = useViewTransition({
 *   duration: 500,
 *   easing: 'ease-in-out'
 * })
 *
 * // 执行过渡动画
 * await run(() => {
 *   state.value = !state.value
 * }, { x: 100, y: 100 })
 * ```
 */
export function useViewTransition(options?: ViewTransitionOptions) {
  // 检测是否支持视图过渡 API 且用户未启用减弱动画
  const isAppearanceTransition = typeof document !== 'undefined' && !!document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // 解构配置选项并设置默认值
  const { duration = 300, easing = 'linear', effect = true, reverseSelector = '.dark' } = options ?? {}

  // 动态注入视图过渡样式到页面头部
  if (typeof document !== 'undefined' && !document.querySelector('style[vts-id="view-transition-style"]')) {
    const style = document.createElement('style')
    style.setAttribute('vts-id', 'view-transition-style')
    style.appendChild(document.createTextNode(styleText.replaceAll('._', reverseSelector)))
    document.head.appendChild(style)
  }

  /**
   * 执行视图过渡动画
   * @description 在指定的坐标点执行圆形裁剪动画，支持正向和反向过渡
   * @param cb - 需要在过渡期间执行的回调函数
   * @param opt - 过渡选项
   * @param opt.reverse - 是否反向过渡，默认 false
   * @param opt.x - 动画起始点的 X 坐标
   * @param opt.y - 动画起始点的 Y 坐标
   *
   * @example
   * ```ts
   * // 正向过渡
   * await run(() => {
   *   toggleTheme()
   * }, { x: event.clientX, y: event.clientY })
   *
   * // 反向过渡
   * await run(() => {
   *   toggleTheme()
   * }, { reverse: true, x: event.clientX, y: event.clientY })
   * ```
   */
  async function run(cb: () => void, opt?: { reverse?: boolean, x: number, y: number }) {
    // 解构过渡选项并设置默认值
    const { reverse = false, x = 0, y = 0 } = opt ?? {}

    // 计算从起始点到屏幕最远角落的距离，作为圆形裁剪的最终半径
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    // 定义圆形裁剪路径：从 0px 到覆盖整个屏幕
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]

    // 如果不支持视图过渡 API 或禁用了效果，直接执行回调
    if (!isAppearanceTransition || !effect) {
      if (typeof cb === 'function') {
        await Promise.try(cb)
      }
      return
    }

    // 启动视图过渡并等待 DOM 更新完成
    await document.startViewTransition(async () => {
      if (typeof cb === 'function') {
        await Promise.try(cb)
      }
      await nextTick()
    }).ready

    // 执行圆形裁剪动画
    await document.documentElement.animate(
      { clipPath: reverse ? clipPath.reverse() : clipPath },
      {
        duration,
        easing,
        fill: 'forwards',
        // 根据反向状态选择要动画化的伪元素
        pseudoElement: `::view-transition-${reverse ? 'old' : 'new'}(root)`,
      },
    ).finished
  }

  return { run }
}

/**
 * 视图过渡组合式函数的返回类型
 * @description 包含 run 方法的返回值类型
 */
export type UseViewTransitionReturns = ReturnType<typeof useViewTransition>
