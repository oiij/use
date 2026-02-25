import type { I18n } from 'vue-i18n'
import type { AutoI18nOptions } from './index'

import { useLocalStorage, useNavigatorLanguage } from '@vueuse/core'
import { computed, watch, watchEffect } from 'vue'

/**
 * 设置自动国际化
 *
 * 提供国际化相关的工具方法和状态管理
 *
 * @param i18n - Vue I18n 实例
 * @param options - 自动国际化选项
 * @returns 自动国际化实例，包含语言管理工具方法
 *
 * @example
 * ```ts
 * import { setupAutoI18n } from '@oiij/auto-i18n'
 * import { i18n } from './i18n'
 *
 * const autoI18n = setupAutoI18n(i18n, {
 *   storageKey: '__LANGUAGE_MODE_PERSIST__'
 * })
 * console.log(autoI18n.locale.value) // 当前语言环境
 * console.log(autoI18n.language.value) // 当前语言设置
 * ```
 */
export function setupAutoI18n<T extends Record<string, unknown>>(i18n: I18n<T, any, any, string, false>, options?: AutoI18nOptions<T>) {
  const { storageKey = '__LANGUAGE_MODE_PERSIST__', useStorageOptions, useNavigatorLanguageOptions } = options ?? {}
  const language = useLocalStorage<keyof T | 'auto'>(storageKey, 'auto', useStorageOptions)
  const { language: navigatorLanguage } = useNavigatorLanguage(useNavigatorLanguageOptions)
  const computedLocale = computed(() => language.value === 'auto' ? navigatorLanguage.value : language.value)
  const { locale } = i18n.global
  let expectedLocale: any = null

  /**
   * 设置语言环境
   *
   * @param lang - 要设置的语言环境
   */
  function setLocale(lang: keyof T) {
    language.value = lang
  }

  /**
   * 设置语言
   *
   * @param lang - 要设置的语言，可以是 'auto' 或具体的语言环境
   */
  function setLanguage(lang: keyof T | 'auto') {
    language.value = lang
  }
  watchEffect(() => {
    expectedLocale = computedLocale.value
    locale.value = computedLocale.value as any
  })
  watch(locale, (newLocale) => {
    if (newLocale !== expectedLocale) {
      language.value = newLocale
    }
    expectedLocale = null
  })
  return {
    language,
    navigatorLanguage,
    locale: locale as unknown as keyof T,
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
export type AutoI18nInstance<T extends Record<string, unknown>> = ReturnType<typeof setupAutoI18n<T>>
