import type { I18n } from 'vue-i18n'
import { useLocalStorage, useNavigatorLanguage } from '@vueuse/core'

import { computed, watchEffect } from 'vue'

/**
 * 从 I18n 实例中提取 locale 类型
 */
type ExtractLocale<T extends I18n> = T['global']['locale']

/**
 * 语言设置类型
 */
export type Language = 'auto' | string

/**
 * 设置自动国际化
 *
 * 提供国际化相关的工具方法和状态管理
 *
 * @param i18n - Vue I18n 实例
 * @returns 自动国际化实例，包含语言管理工具方法
 *
 * @example
 * ```ts
 * import { setupAutoI18n } from '@oiij/auto-i18n'
 * import { i18n } from './i18n'
 *
 * const autoI18n = setupAutoI18n(i18n)
 * console.log(autoI18n.locale.value) // 当前语言环境
 * console.log(autoI18n.language.value) // 当前语言设置
 * ```
 */
export function setupAutoI18n<T extends I18n>(i18n: T) {
  type Locale = ExtractLocale<T>
  const language = useLocalStorage<Language>('__LANGUAGE__PERSIST__', 'auto')
  const { language: navigatorLanguage } = useNavigatorLanguage()
  const _locale = computed(() => language.value === 'auto' ? navigatorLanguage.value : language.value)

  /**
   * 设置语言环境
   *
   * @param lang - 要设置的语言环境
   */
  function setLocale(lang: Locale) {
    i18n.global.locale = lang
  }

  /**
   * 设置语言
   *
   * @param lang - 要设置的语言，可以是 'auto' 或具体的语言环境
   */
  function setLanguage(lang: Language) {
    language.value = lang
  }
  watchEffect(() => {
    i18n.global.locale = _locale.value as Locale
  })

  return {
    language,
    navigatorLanguage,
    locale: i18n.global.locale,
    setLocale,
    setLanguage,
  }
}

/**
 * 自动国际化实例类型
 *
 * @remarks
 * 由 setupAutoI18n 函数返回的对象类型
 */
export type AutoI18nInstance<T extends I18n = I18n> = ReturnType<typeof setupAutoI18n<T>>
