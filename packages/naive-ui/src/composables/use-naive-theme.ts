import type { GlobalThemeOverrides, NDateLocale } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
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

export type NaiveThemeOptions<T extends string> = {
  language?: T | Ref<T>
  darkMode?: boolean | Ref<boolean>
  colors?: Colors
  globalThemeOverrides?: GlobalThemeOverrides
  locales?: Partial<Locales<T>>
  darkColors?: Colors | ((colors: Colors) => Colors)
}
export function useNaiveTheme<T extends string>(options?: NaiveThemeOptions<T>) {
  const { language = 'zh-CN', darkMode, colors, globalThemeOverrides, locales, darkColors } = options ?? {}
  const languageRef = ref(toValue(language)) as Ref<T>
  watchEffect(() => {
    languageRef.value = toValue(language) as T
  })
  const darkModeRef = ref(toValue(darkMode))
  watchEffect(() => {
    darkModeRef.value = toValue(darkMode)
  })
  const { common, ...extra } = globalThemeOverrides ?? {}
  const colorsRef = ref<Colors>({ ...colors })
  const themeColorsRef = computed(() => {
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
  function setColor(v: Partial<Colors>) {
    colorsRef.value = { ...colorsRef.value, ...v }
  }
  const theme = computed(() => {
    return darkModeRef?.value ? darkTheme : undefined
  })
  const themeOverrides: ComputedRef<GlobalThemeOverrides> = computed(() => {
    const { primary, info, success, warning, error } = getColors(themeColorsRef.value)

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
  const _locales = { ...naiveLocaleMap, ...locales } as Locales<T>
  const locale = computed(() => _locales[languageRef.value] ?? naiveLocaleMap['zh-CN'])

  return {
    language: languageRef,
    darkMode: darkModeRef,
    theme,
    colors: colorsRef,
    themeColors: themeColorsRef,
    themeOverrides,
    locales: _locales,
    locale,
    setColor,
  }
}
export type NaiveThemeReturns = ReturnType<typeof useNaiveTheme>
