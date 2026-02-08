import type { ViewTransitionOptions } from './use-view-transition'
import { useColorMode, useDark, usePreferredDark } from '@vueuse/core'
import { useViewTransition } from './use-view-transition'

/**
 * 主题配置选项
 */
export type UseThemeOptions = {
  /** 存储在 localStorage 中的键名，默认为 '__COLOR_MODE__' */
  storageKey?: string
  /** 视图过渡动画配置选项 */
  viewTransitionOptions?: ViewTransitionOptions
}

/**
 * 主题管理 Composable
 *
 * 提供完整的主题切换功能，支持暗色/亮色模式切换、系统主题跟随、平滑过渡动画等
 *
 * @example
 * ```ts
 * const { isDark, toggleDark, setDark, setLight } = useTheme({
 *   storageKey: 'my-app-theme',
 *   viewTransitionOptions: {
 *     duration: 800,
 *     easing: 'ease-out'
 *   }
 * })
 *
 * // 切换主题（带动画）
 * function handleThemeToggle(event: MouseEvent) {
 *   toggleDark(event)
 * }
 *
 * // 强制设置为暗色模式
 * setDark()
 *
 * // 强制设置为亮色模式
 * setLight()
 * ```
 */
export function useTheme(options?: UseThemeOptions) {
  // 从配置中获取存储键名和视图过渡选项，设置默认值
  const { storageKey = '__COLOR_MODE__', viewTransitionOptions } = options ?? {}

  // 使用 VueUse 的 useDark 创建暗色模式响应式状态，基于 localStorage 持久化
  const isDark = useDark({ storageKey })

  // 获取系统偏好设置（用户操作系统的主题偏好）
  const preferredDark = usePreferredDark()

  // 使用 VueUse 的 useColorMode 获取颜色模式状态
  // emitAuto: true - 当模式为 'auto' 时会自动更新
  const { store: colorMode, system: systemColorMode } = useColorMode({ emitAuto: true, storageKey })

  // 初始化视图过渡动画功能
  // duration: 动画持续时间 1000ms
  // easing: 缓动函数 ease-in-out
  // effect: 启用过渡效果
  // reverseSelector: 暗色模式的反向选择器
  const { run } = useViewTransition({
    duration: 1000,
    easing: 'ease-in-out',
    effect: true,
    reverseSelector: '.dark',
    ...viewTransitionOptions,
  })

  /**
   * 设置暗色模式
   *
   * @param darkMode - 是否启用暗色模式
   * @param event - 可选的鼠标事件对象，用于定位过渡动画的中心点
   */
  function setDarkMode(darkMode: boolean, event?: MouseEvent) {
    // 如果提供了事件对象，则使用视图过渡动画进行平滑切换
    // 动画中心点基于鼠标点击位置
    if (event) {
      run(() => isDark.value = darkMode, { x: event.clientX, y: event.clientY, reverse: darkMode })
    }
    else {
      // 直接切换主题，不使用过渡动画
      isDark.value = darkMode
    }
  }

  /**
   * 设置为暗色模式
   *
   * @param event - 可选的鼠标事件对象，用于定位过渡动画的中心点
   *
   * @example
   * ```ts
   * // 直接切换为暗色模式
   * setDark()
   *
   * // 带动画效果的切换
   * <button @click="(e) => setDark(e)">切换到暗色模式</button>
   * ```
   */
  function setDark(event?: MouseEvent) {
    setDarkMode(true, event)
  }

  /**
   * 设置为亮色模式
   *
   * @param event - 可选的鼠标事件对象，用于定位过渡动画的中心点
   *
   * @example
   * ```ts
   * // 直接切换为亮色模式
   * setLight()
   *
   * // 带动画效果的切换
   * <button @click="(e) => setLight(e)">切换到亮色模式</button>
   * ```
   */
  function setLight(event?: MouseEvent) {
    setDarkMode(false, event)
  }

  /**
   * 切换暗色/亮色模式
   *
   * @param event - 可选的鼠标事件对象，用于定位过渡动画的中心点
   *
   * @example
   * ```ts
   * // 直接切换主题
   * toggleDark()
   *
   * // 带动画效果的切换
   * <button @click="(e) => toggleDark(e)">切换主题</button>
   * ```
   */
  function toggleDark(event?: MouseEvent) {
    setDarkMode(!isDark.value, event)
  }

  return {
    isDark,
    preferredDark,
    colorMode,
    systemColorMode,
    setDarkMode,
    setDark,
    setLight,
    toggleDark,
  }
}
