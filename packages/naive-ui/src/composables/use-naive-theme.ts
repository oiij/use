/**
 * 用于处理 Naive UI 主题的组合式 API
 * 提供主题切换、语言设置、颜色管理等功能
 */
import type { GlobalThemeOverrides, NDateLocale } from 'naive-ui'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { Colors } from './_helper'
import { darkTheme, dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { computed, isRef, ref, toValue, watch } from 'vue'
import { getColors, getDarkColors } from './_helper'

/**
 * 多语言配置映射类型
 * @template T 语言代码类型
 */
export type Locales<T extends string = string> = Record<T, {
  /**
   * 语言显示名称
   */
  name: string
  /**
   * Naive UI 日期语言包
   */
  dateLocale: NDateLocale
  /**
   * Naive UI 组件语言包
   */
  locale: typeof zhCN
}>

const naiveLocaleMap: Locales<'zh-CN' | 'en-US'> = {
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
}

/**
 * 主题配置选项
 * @template T 语言代码类型
 */
export type UseNaiveThemeOptions<T extends string> = {
  /**
   * 语言代码，支持响应式引用或普通值
   * @default 'zh-CN'
   */
  language?: MaybeRefOrGetter<T>
  /**
   * 暗黑模式开关，支持响应式引用或普通值
   * @default false
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 主题颜色配置
   * @default undefined
   */
  colors?: Colors
  /**
   * 全局主题覆盖，`common` 中的配置优先于由 `colors` 派生的颜色
   * @default undefined
   */
  globalThemeOverrides?: GlobalThemeOverrides
  /**
   * 自定义语言包，会覆盖内置的 `zh-CN` / `en-US`
   * @default undefined
   */
  locales?: Partial<Locales<T>>
  /**
   * 暗黑模式颜色配置，函数入参为已按内置规则生成的暗色基础色
   * @default undefined，使用内置 getDarkColors 生成
   */
  darkColors?: Colors | ((colors: Colors) => Colors)
}

function omitUndefined<T extends object>(value: T): T {
  const result: Record<string, unknown> = {}
  for (const key in value) {
    const item = (value as Record<string, unknown>)[key]
    if (item !== undefined)
      result[key] = item
  }
  return result as T
}

function createWritableRef<T>(source: MaybeRefOrGetter<T> | undefined, fallback: T): Ref<T> {
  if (isRef(source))
    return source as Ref<T>

  if (typeof source === 'function') {
    const state = ref(fallback) as unknown as Ref<T>
    watch(
      () => toValue(source),
      value => state.value = (value ?? fallback) as T,
      { immediate: true },
    )
    return state
  }

  return ref(source ?? fallback) as unknown as Ref<T>
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

  const languageRef = createWritableRef<T>(language, 'zh-CN' as T)

  const darkModeRef = createWritableRef<boolean>(darkMode, false)

  const { common, ...extra } = globalThemeOverrides ?? {}

  const colorsRef = ref<Colors>({ ...colors }) as Ref<Colors>

  const themeColors = computed<Colors>(() => {
    if (!darkModeRef.value)
      return colorsRef.value

    const base = omitUndefined({ ...colorsRef.value, ...getDarkColors(colorsRef.value) })
    const override = typeof darkColors === 'function' ? darkColors(base) : darkColors
    return { ...base, ...omitUndefined(override ?? {}) }
  })

  /**
   * 设置主题颜色
   * @param v 颜色配置
   * @example
   * ```ts
   * setColor({ primary: '#1890ff' })
   * ```
   */
  function setColor(v: Partial<Colors>) {
    colorsRef.value = { ...colorsRef.value, ...v }
  }

  const theme = computed(() => {
    return darkModeRef.value ? darkTheme : undefined
  })

  const themeOverrides: ComputedRef<GlobalThemeOverrides> = computed(() => {
    const { primary, info, success, warning, error } = getColors(themeColors.value)

    const commonColors = omitUndefined({
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
    })

    return {
      common: { ...commonColors, ...common },
      ...extra,
    }
  })

  const localesMerge = { ...naiveLocaleMap, ...locales } as Locales<T>

  const localeMap = localesMerge as LoadableLocales

  const locale = computed(() => {
    return localeMap[languageRef.value] ?? localeMap['zh-CN'] ?? naiveLocaleMap['zh-CN']
  })

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

type LoadableLocales = Record<string, Locales[string]>

/**
 * useNaiveTheme 返回类型
 */
export type UseNaiveThemeReturns = ReturnType<typeof useNaiveTheme>
