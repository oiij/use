import type { GlobalThemeOverrides, NDateLocale } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import type { Colors } from './_helper'
import {
  darkTheme,
  dateEnUS,
  dateZhCN,
  enUS,
  zhCN,
} from 'naive-ui'
import { computed, ref, toValue, watchEffect } from 'vue'
import { getColors } from './_helper'

const naiveLocaleMap: {
  [key: string]: {
    name: string
    dateLocale: NDateLocale
    locale: typeof zhCN
  }
} = {
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

type NaiveThemeOptions = {
  language?: string | Ref<string>
  darkMode?: boolean | Ref<boolean>
  colors?: Colors
  globalThemeOverrides?: GlobalThemeOverrides
}
export function useNaiveTheme(options?: NaiveThemeOptions) {
  const { language, darkMode, colors, globalThemeOverrides } = options ?? {}
  const languageRef = ref(toValue(language))
  watchEffect(() => {
    languageRef.value = toValue(language)
  })
  const darkModeRef = ref(toValue(darkMode))
  watchEffect(() => {
    darkModeRef.value = toValue(darkMode)
  })
  const { common, ...extra } = globalThemeOverrides ?? {}
  const colorRef = ref<Colors>({ ...colors })
  function setColor(v: Partial<Colors>) {
    colorRef.value = { ...colorRef.value, ...v }
  }
  const theme = computed(() => {
    return darkModeRef?.value ? darkTheme : undefined
  })
  const themeOverrides: ComputedRef<GlobalThemeOverrides> = computed(() => {
    const { primary, info, success, warning, error } = getColors(colorRef.value)
    return {
      common: {
        bodyColor: darkModeRef?.value ? '#1f1f1f' : '#f5f5f5',
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
        ...common,
      },
      ...extra,
    }
  })
  const locale = computed(() => {
    if (!languageRef?.value || !naiveLocaleMap[languageRef.value])
      return naiveLocaleMap['zh-CN'].locale
    return naiveLocaleMap[languageRef.value].locale
  })
  const dateLocale = computed(() => {
    if (!languageRef?.value || !naiveLocaleMap[languageRef.value])
      return naiveLocaleMap['zh-CN'].dateLocale
    return naiveLocaleMap[languageRef.value].dateLocale
  })

  return {
    language: languageRef,
    darkMode: darkModeRef,
    theme,
    themeOverrides,
    locale,
    dateLocale,
    color: colorRef,
    setColor,
  }
}
export type NaiveThemeReturns = ReturnType<typeof useNaiveTheme>
