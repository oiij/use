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
  /**
   * 语言设置，持久化存储
   *
   * @remarks
   * 使用 useLocalStorage 持久化存储语言设置到本地存储
   */
  const language = useLocalStorage<Language>('__LANGUAGE__PERSIST__', 'auto')

  /**
   * 浏览器导航语言
   *
   * @remarks
   * 使用 useNavigatorLanguage 获取浏览器的语言设置
   */
  const { language: navigatorLanguage } = useNavigatorLanguage()

  /**
   * 计算当前实际使用的语言环境
   *
   * @remarks
   * 如果语言设置为 'auto'，则使用浏览器导航语言；否则使用设置的语言
   */
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
  /**
   * 监听 _locale 变化，自动更新 i18n.global.locale
   */
  watchEffect(() => {
    i18n.global.locale = _locale.value as Locale
  })

  return {
    /**
     * 语言设置，持久化存储
     *
     * @type {import('@vueuse/core').Ref<Language>}
     */
    language,

    /**
     * 浏览器导航语言
     *
     * @type {import('@vueuse/core').Ref<string>}
     */
    navigatorLanguage,

    /**
     * 当前实际使用的语言环境
     *
     * @type {import('vue').WritableComputedRef<Locale>}
     */
    locale: i18n.global.locale,

    /**
     * 设置语言环境
     *
     * @param lang - 要设置的语言环境
     * @returns {void}
     */
    setLocale,

    /**
     * 设置语言
     *
     * @param lang - 要设置的语言，可以是 'auto' 或具体的语言环境
     * @returns {void}
     */
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
