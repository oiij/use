import type { GlobalThemeOverrides, NDateLocale } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import { colord } from 'colord'
import {
  darkTheme,
  dateEnUS,
  dateZhCN,
  enUS,
  zhCN,
} from 'naive-ui'
import { computed, ref, toValue, watchEffect } from 'vue'

interface Color {
  primary: string
  info: string
  success: string
  warning: string
  error: string
}
function getStatusColor(color = '#ff461f') {
  return {
    color,
    hover: colord(color).lighten(0.1).toHex(),
    pressed: colord(color).darken(0.1).toHex(),
    suppl: colord(color).lighten(0.1).toHex(),
  }
}
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
function getColors(color: Color) {
  const { primary, info, success, warning, error } = color
  return {
    primary: getStatusColor(primary),
    info: getStatusColor(info),
    success: getStatusColor(success),
    warning: getStatusColor(warning),
    error: getStatusColor(error),
  }
}
interface NaiveThemeOptions {
  language?: string | Ref<string>
  darkMode?: boolean | Ref<boolean>
  color?: Color
  globalThemeOverrides?: GlobalThemeOverrides
}
export function useNaiveTheme(options?: NaiveThemeOptions) {
  const { language, darkMode, color, globalThemeOverrides } = options ?? {}
  const languageRef = ref(toValue(language))
  watchEffect(() => {
    languageRef.value = toValue(language)
  })
  const darkModeRef = ref(toValue(darkMode))
  watchEffect(() => {
    darkModeRef.value = toValue(darkMode)
  })
  const { common, Dialog, ...extra } = globalThemeOverrides ?? {}
  const colorRef = ref<Color>({
    primary: '#64748B',
    info: '#06b6d4',
    success: '#10b981',
    warning: '#fbbf24',
    error: '#f43f5e',
    ...color,
  })
  function setColor(v: Color) {
    colorRef.value = v
  }
  const theme = computed(() => {
    return darkModeRef?.value ? darkTheme : undefined
  })
  const themeOverrides: ComputedRef<GlobalThemeOverrides> = computed(() => {
    const { primary, info, success, warning, error } = getColors(colorRef.value)
    return {
      common: {
        bodyColor: darkModeRef?.value ? '#1f1f1f' : '#f5f5f5',
        primaryColor: primary.color,
        primaryColorHover: primary.hover,
        primaryColorPressed: primary.pressed,
        primaryColorSuppl: primary.suppl,
        infoColor: info.color,
        infoColorHover: info.hover,
        infoColorPressed: info.pressed,
        infoColorSuppl: info.suppl,
        successColor: success.color,
        successColorHover: success.hover,
        successColorPressed: success.pressed,
        successColorSuppl: success.suppl,
        warningColor: warning.color,
        warningColorHover: warning.hover,
        warningColorPressed: warning.pressed,
        warningColorSuppl: warning.suppl,
        errorColor: error.color,
        errorColorHover: error.hover,
        errorColorPressed: error.pressed,
        errorColorSuppl: error.suppl,
        borderRadius: '6px',
        ...common,
      },
      Dialog: {
        borderRadius: '12px',
        padding: '20px',
        closeMargin: '20px 20px 0 0',
        ...Dialog,
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
