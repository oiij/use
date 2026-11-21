import type { ConfigurableWindow, UseColorModeOptions, UseDarkOptions } from '@vueuse/core'
import { useColorMode, useDark, usePreferredDark } from '@vueuse/core'

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
 * 提供完整的主题切换功能，支持暗色/亮色模式切换、系统主题跟随等
 *
 * @param options 主题配置选项
 * @returns 返回主题相关的状态和方法
 *
 * @example
 * ```ts
 * const { isDark, toggleDark, setDark, setLight } = useTheme({
 *   storageKey: 'my-app-theme'
 * })
 *
 * toggleDark()
 * setDark()
 * setLight()
 * ```
 */
export function useTheme(options?: UseThemeOptions) {
  const { storageKey = '__COLOR_MODE_PERSIST__', useDarkOptions, usePreferredDarkOptions, useColorModeOptions } = options ?? {}

  const isDark = useDark({ storageKey, ...useDarkOptions })
  const preferredDark = usePreferredDark(usePreferredDarkOptions)
  const { store: colorMode, system: systemColorMode } = useColorMode({ emitAuto: true, storageKey, ...useColorModeOptions })

  /**
   * 设置颜色模式（暗色/亮色/自动跟随系统）
   *
   * @param mode 目标模式：'dark' | 'light' | 'auto'
   *
   * @example
   * ```ts
   * // 直接切换
   * setColorMode('dark')
   * ```
   */
  function setColorMode(mode: 'dark' | 'light' | 'auto') {
    colorMode.value = mode
  }

  /**
   * 设置为暗色模式
   *
   * @example
   * ```ts
   * setDark()
   * ```
   */
  function setDark() {
    setColorMode('dark')
  }

  /**
   * 设置为亮色模式
   *
   * @example
   * ```ts
   * setLight()
   * ```
   */
  function setLight() {
    setColorMode('light')
  }

  /**
   * 切换暗色/亮色模式
   *
   * @example
   * ```ts
   * toggleDark()
   * ```
   */
  function toggleDark() {
    setColorMode(isDark.value ? 'light' : 'dark')
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
