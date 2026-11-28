import type { Colors } from './_helper'
import type { Locales } from './use-naive-theme'
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { getDarkColors } from './_helper'
import { useNaiveTheme } from './use-naive-theme'

describe('useNaiveTheme', () => {
  it('默认语言为中文且暗黑模式关闭', () => {
    const { language, darkMode, locale, theme, themeOverrides } = useNaiveTheme()

    expect(language.value).toBe('zh-CN')
    expect(darkMode.value).toBe(false)
    expect(locale.value.locale).toBe(zhCN)
    expect(locale.value.dateLocale).toBe(dateZhCN)
    expect(theme.value).toBeUndefined()
    expect(themeOverrides.value.common).not.toHaveProperty('primaryColor')
  })

  it('传入 ref 时复用同一引用并可切换主题', () => {
    const dark = ref(false)
    const { darkMode, theme } = useNaiveTheme({ darkMode: dark })

    expect(darkMode).toBe(dark)

    dark.value = true

    expect(darkMode.value).toBe(true)
    expect(theme.value).toBe(darkTheme)
  })

  it('传入 getter 时随依赖变化同步', async () => {
    const dark = ref(false)
    const { darkMode } = useNaiveTheme({ darkMode: () => dark.value })

    dark.value = true
    await nextTick()

    expect(darkMode.value).toBe(true)
  })

  it('暗黑模式默认使用 getDarkColors 生成颜色', () => {
    const { themeColors } = useNaiveTheme({ darkMode: true, colors: { primary: '#000000' } })

    expect(themeColors.value.primary).toBe(getDarkColors({ primary: '#000000' }).primary)
  })

  it('darkColors 对象覆盖在暗色基础色之上', () => {
    const { themeColors } = useNaiveTheme({
      darkMode: true,
      colors: { primary: '#000000' },
      darkColors: { info: '#123456' },
    })

    expect(themeColors.value.primary).toBe(getDarkColors({ primary: '#000000' }).primary)
    expect(themeColors.value.info).toBe('#123456')
  })

  it('darkColors 函数入参为暗色基础色，undefined 不会覆盖有效颜色', () => {
    let received: Colors | undefined
    const { themeColors } = useNaiveTheme({
      darkMode: true,
      colors: { primary: '#ff0000' },
      darkColors: (base) => {
        received = base
        return { primary: undefined }
      },
    })

    expect(themeColors.value.primary).toBe(getDarkColors({ primary: '#ff0000' }).primary)
    expect(received?.primary).toBe(getDarkColors({ primary: '#ff0000' }).primary)
  })

  it('用户自定义语言包优先于内置语言包', () => {
    const customZh: Locales['zh-CN'] = { name: '自定义中文', locale: zhCN, dateLocale: dateZhCN }
    const { locale } = useNaiveTheme({ locales: { 'zh-CN': customZh } })

    expect(locale.value.name).toBe('自定义中文')
  })

  it('未知语言回退到自定义 zh-CN 语言包', () => {
    const customZh: Locales['zh-CN'] = { name: '自定义中文', locale: zhCN, dateLocale: dateZhCN }
    const { locale } = useNaiveTheme<'zh-CN' | 'fr-FR'>({
      language: 'fr-FR',
      locales: { 'zh-CN': customZh },
    })

    expect(locale.value.name).toBe('自定义中文')
  })

  it('setColor 更新主题覆盖颜色', () => {
    const { setColor, themeOverrides } = useNaiveTheme({ colors: { primary: '#ff0000' } })

    expect(themeOverrides.value.common?.primaryColor).toBe('#ff0000')

    setColor({ primary: '#00ff00' })

    expect(themeOverrides.value.common?.primaryColor).toBe('#00ff00')
  })

  it('globalThemeOverrides 的 common 优先于 colors 派生颜色', () => {
    const { themeOverrides } = useNaiveTheme({
      colors: { primary: '#ff0000' },
      globalThemeOverrides: { common: { primaryColor: '#000000' } },
    })

    expect(themeOverrides.value.common?.primaryColor).toBe('#000000')
  })

  it('未配置的颜色不会产生 undefined 键', () => {
    const { themeOverrides } = useNaiveTheme({ colors: { primary: '#ff0000' } })

    expect(themeOverrides.value.common).not.toHaveProperty('infoColor')
  })
})
