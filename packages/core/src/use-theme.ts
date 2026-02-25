import type { ConfigurableWindow, UseColorModeOptions, UseDarkOptions } from '@vueuse/core'
import type { ViewTransitionOptions } from './use-view-transition'
import { useColorMode, useDark, usePreferredDark } from '@vueuse/core'
import { useViewTransition } from './use-view-transition'

/**
 * 主题配置选项
 */
export type UseThemeOptions = {
  /**
   * 存储在 localStorage 中的键名
   * @default '__COLOR_MODE_PERSIST__'
   */
  storageKey?: string
  /**
   * 视图过渡动画配置选项
   */
  viewTransitionOptions?: ViewTransitionOptions
  /**
   * 暗色模式选项
   */
  useDarkOptions?: UseDarkOptions
  /**
   * 系统主题跟随选项
   */
  usePreferredDarkOptions?: ConfigurableWindow
  /**
   * 颜色模式选项
   */
  useColorModeOptions?: UseColorModeOptions
}

/**
 * 主题管理 Composable
 *
 * 提供完整的主题切换功能，支持暗色/亮色模式切换、系统主题跟随、平滑过渡动画等
 *
 * @param options 主题配置选项
 * @returns 返回主题相关的状态和方法
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
 * toggleDark(event)
 * setDark()
 * setLight()
 * ```
 */
export function useTheme(options?: UseThemeOptions) {
  const { storageKey = '__COLOR_MODE_PERSIST__', useDarkOptions, usePreferredDarkOptions, useColorModeOptions, viewTransitionOptions } = options ?? {}

  const isDark = useDark({ storageKey, ...useDarkOptions })
  const preferredDark = usePreferredDark(usePreferredDarkOptions)
  const { store: colorMode, system: systemColorMode } = useColorMode({ emitAuto: true, storageKey, ...useColorModeOptions })

  const { run } = useViewTransition({
    duration: 1000,
    easing: 'ease-in-out',
    effect: true,
    reverseSelector: '.dark',
    ...viewTransitionOptions,
  })

  /**
   * 设置颜色模式（暗色/亮色/自动跟随系统）
   *
   * @param mode 目标模式：'dark' | 'light' | 'auto'
   * @param event 可选的鼠标事件，用于定位过渡动画中心点
   *
   * @example
   * ```ts
   * // 直接切换
   * setColorMode('dark')
   * setColorMode('dark',event)
   * ```
   */
  function setColorMode(mode: 'dark' | 'light' | 'auto', event?: MouseEvent) {
    if (event) {
      run(() => colorMode.value = mode, { x: event.clientX, y: event.clientY, reverse: mode === 'dark' })
    }
    else {
      colorMode.value = mode
    }
  }

  /**
   * 设置为暗色模式
   *
   * @param event 可选的鼠标事件对象，用于定位过渡动画的中心点
   *
   * @example
   * ```ts
   * setDark()
   * setDark(event)
   * ```
   */
  function setDark(event?: MouseEvent) {
    setColorMode('dark', event)
  }

  /**
   * 设置为亮色模式
   *
   * @param event 可选的鼠标事件对象，用于定位过渡动画的中心点
   *
   * @example
   * ```ts
   * setLight()
   * setLight(event)
   * ```
   */
  function setLight(event?: MouseEvent) {
    setColorMode('light', event)
  }

  /**
   * 切换暗色/亮色模式
   *
   * @param event 可选的鼠标事件对象，用于定位过渡动画的中心点
   *
   * @example
   * ```ts
   * toggleDark()
   * toggleDark(event)
   * ```
   */
  function toggleDark(event?: MouseEvent) {
    setColorMode(isDark.value ? 'light' : 'dark', event)
  }

  return {
    isDark,
    preferredDark,
    colorMode,
    systemColorMode,
    setColorMode,
    setDark,
    setLight,
    toggleDark,
  }
}

/**
 * useTheme 函数的返回类型
 */
export type UseThemeReturns = ReturnType<typeof useTheme>
