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

/**
 * 语言包类型
 * @template T 语言代码类型
 */
type Locales<T extends string = string> = Record<T, {
  /** 语言名称 */
  name: string
  /** 日期本地化配置 */
  dateLocale: NDateLocale
  /** 语言包配置 */
  locale: typeof zhCN
}>

/**
 * 默认语言包映射
 */
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
 */
export function useNaiveTheme<T extends string>(options?: UseNaiveThemeOptions<T>) {
  const { language, darkMode, colors, globalThemeOverrides, locales, darkColors } = options ?? {}

  // 语言引用
  const languageRef = ref(toValue(language)) as Ref<T | undefined>

  // 监听语言变化，保持响应式
  watchEffect(() => languageRef.value = toValue(language) as T | undefined)

  // 暗黑模式引用
  const darkModeRef = ref(toValue(darkMode))

  // 监听暗黑模式变化，保持响应式
  watchEffect(() => darkModeRef.value = toValue(darkMode))

  // 分离全局主题覆盖的公共部分和其他部分
  const { common, ...extra } = globalThemeOverrides ?? {}

  // 颜色引用
  const colorsRef = ref<Colors>({ ...colors })

  // 计算主题颜色，根据暗黑模式状态调整
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
   * @param v 颜色配置
   */
  function setColor(v: Partial<Colors>) {
    colorsRef.value = { ...colorsRef.value, ...v }
  }

  // 计算当前主题
  const theme = computed(() => {
    return darkModeRef?.value ? darkTheme : undefined
  })

  // 计算主题覆盖配置
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

  // 合并默认语言包和自定义语言包
  const localesMerge = { ...naiveLocaleMap, ...locales } as Locales<T>

  // 计算当前语言包
  const locale = computed(() => localesMerge[languageRef.value ?? 'zh-CN' as T] ?? naiveLocaleMap['zh-CN'])

  return {
    /** 语言代码引用 */
    language: languageRef,
    /** 暗黑模式引用 */
    darkMode: darkModeRef,
    /** 当前主题 */
    theme,
    /** 颜色配置引用 */
    colors: colorsRef,
    /** 计算后的主题颜色 */
    themeColors,
    /** 主题覆盖配置 */
    themeOverrides,
    /** 合并后的语言包 */
    locales: localesMerge,
    /** 当前语言包 */
    locale,
    /** 设置主题颜色 */
    setColor,
  }
}

/**
 * useNaiveTheme 返回类型
 */
export type UseNaiveThemeReturns = ReturnType<typeof useNaiveTheme>
