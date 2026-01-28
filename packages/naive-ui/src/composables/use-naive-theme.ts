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

export type UseNaiveThemeOptions<T extends string> = {
  language?: MaybeRefOrGetter<T>
  darkMode?: MaybeRefOrGetter<boolean>
  colors?: Colors
  globalThemeOverrides?: GlobalThemeOverrides
  locales?: Partial<Locales<T>>
  darkColors?: Colors | ((colors: Colors) => Colors)
}
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
    languageRef,
    darkModeRef,
    theme,
    colorsRef,
    themeColors,
    themeOverrides,
    locales: localesMerge,
    locale,
    setColor,
  }
}
export type UseNaiveThemeReturns = ReturnType<typeof useNaiveTheme>
