/**
 * 用于处理 Naive UI 主题的组合式 API
 * 提供主题切换、语言设置、颜色管理等功能
 */
import type { GlobalThemeOverrides, NDateLocale } from 'naive-ui'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { Colors } from './_helper'
import { darkTheme, dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { computed, ref, toValue, watchEffect } from 'vue'
import { getColors, getDarkColors } from './_helper'

type Locales<T extends string = string> = Record<T, {
  name: string
  dateLocale: NDateLocale
  locale: typeof zhCN
}>

const naiveLocaleMap = {
  'zh-CN': {
    name: '简体中文',
    dateLocale: dateZhCN,
    locale: zhCN,
  },
  'en-US': {
    name: 'English',
    dateLocale: dateEnUS,
    locale: enUS,
  },
} as Locales

/**
 * 主题配置选项
 * @template T 语言代码类型
 */
export type UseNaiveThemeOptions<T extends string> = {
  /** 语言代码，支持响应式引用或普通值 */
  language?: MaybeRefOrGetter<T>
  /** 暗黑模式开关，支持响应式引用或普通值 */
  darkMode?: MaybeRefOrGetter<boolean>
  /** 主题颜色配置 */
  colors?: Colors
  /** 全局主题覆盖 */
  globalThemeOverrides?: GlobalThemeOverrides
  /** 自定义语言包 */
  locales?: Partial<Locales<T>>
  /** 暗黑模式颜色配置，支持对象或函数 */
  darkColors?: Colors | ((colors: Colors) => Colors)
}

/**
 * 用于处理 Naive UI 主题的组合式 API
 * @template T 语言代码类型
 * @param options 配置选项
 * @returns 主题管理对象
 * @example
 * ```ts
 * const {
 *   language,
 *   darkMode,
 *   theme,
 *   themeColors,
 *   themeOverrides,
 *   locale,
 *   setColor
 * } = useNaiveTheme({
 *   language: 'zh-CN',
 *   darkMode: false,
 *   colors: { primary: '#1890ff' },
 *   globalThemeOverrides: { common: { fontSize: '14px' } }
 * })
 * ```
 */
export function useNaiveTheme<T extends string>(options?: UseNaiveThemeOptions<T>) {
  const { language, darkMode, colors, globalThemeOverrides, locales, darkColors } = options ?? {}

  const languageRef = ref(toValue(language)) as Ref<T | undefined>

  watchEffect(() => languageRef.value = toValue(language) as T | undefined)

  const darkModeRef = ref(toValue(darkMode))

  watchEffect(() => darkModeRef.value = toValue(darkMode))

  const { common, ...extra } = globalThemeOverrides ?? {}

  const colorsRef = ref<Colors>({ ...colors })

  const themeColors = computed(() => {
    if (darkModeRef.value) {
      if (typeof darkColors === 'function') {
        const darkColorsResult = darkColors(colorsRef.value)
        return {
          ...colorsRef.value,
          ...darkColorsResult,
        }
      }
      if (typeof darkColors === 'object') {
        return {
          ...colorsRef.value,
          ...darkColors,
        }
      }
      return getDarkColors(colorsRef.value)
    }
    return colorsRef.value
  })

  /**
   * 设置主题颜色
   * @param v - 颜色配置
   * @example
   * ```ts
   * setColor({ primary: '#1890ff' })
   * ```
   */
  function setColor(v: Partial<Colors>) {
    colorsRef.value = { ...colorsRef.value, ...v }
  }

  const theme = computed(() => {
    return darkModeRef?.value ? darkTheme : undefined
  })

  const themeOverrides: ComputedRef<GlobalThemeOverrides> = computed(() => {
    const { primary, info, success, warning, error } = getColors(themeColors.value)

    const commonColors = {
      primaryColor: primary?.color,
      primaryColorHover: primary?.hover,
      primaryColorPressed: primary?.pressed,
      primaryColorSuppl: primary?.suppl,
      infoColor: info?.color,
      infoColorHover: info?.hover,
      infoColorPressed: info?.pressed,
      infoColorSuppl: info?.suppl,
      successColor: success?.color,
      successColorHover: success?.hover,
      successColorPressed: success?.pressed,
      successColorSuppl: success?.suppl,
      warningColor: warning?.color,
      warningColorHover: warning?.hover,
      warningColorPressed: warning?.pressed,
      warningColorSuppl: warning?.suppl,
      errorColor: error?.color,
      errorColorHover: error?.hover,
      errorColorPressed: error?.pressed,
      errorColorSuppl: error?.suppl,
    }

    return {
      common: {
        ...commonColors,
        ...common,
      },
      ...extra,
    }
  })

  const localesMerge = { ...naiveLocaleMap, ...locales } as Locales<T>

  const locale = computed(() => localesMerge[languageRef.value ?? 'zh-CN' as T] ?? naiveLocaleMap['zh-CN'])

  return {
    language: languageRef,
    darkMode: darkModeRef,
    theme,
    colors: colorsRef,
    themeColors,
    themeOverrides,
    locales: localesMerge,
    locale,
    setColor,
  }
}

/**
 * useNaiveTheme 返回类型
 */
export type UseNaiveThemeReturns = ReturnType<typeof useNaiveTheme>
