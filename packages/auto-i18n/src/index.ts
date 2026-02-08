import type { App } from 'vue'
import type { I18n } from 'vue-i18n'
import type { AutoI18nInstance } from './setup-auto-i18n'
import { inject } from 'vue'
import { setupAutoI18n } from './setup-auto-i18n'

const __INJECTION_KEY__ = Symbol('auto-i18n')

/**
 * 获取自动国际化实例
 *
 * @returns 自动国际化实例，包含语言管理工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { useAutoI18n } from '@oiij/auto-i18n'
 *
 * const { language, navigatorLanguage, setLocale, setLanguage } = useAutoI18n()
 * </script>
 * ```
 */
export function useAutoI18n<T extends I18n = I18n>() {
  const i18n = inject<AutoI18nInstance<T>>(__INJECTION_KEY__)
  if (!i18n) {
    throw new Error('Auto i18n is not provided. Make sure to install createAutoI18n plugin.')
  }
  return i18n
}

/**
 * 创建自动国际化插件
 *
 * 必须在 Vue I18n 之后安装
 *
 * @param i18n Vue I18n 实例
 * @returns Vue 插件对象
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createI18n } from 'vue-i18n'
 * import messages from '@intlify/unplugin-vue-i18n/messages'
 *
 * import { createAutoI18n } from '@oiij/auto-i18n'
 *
 * const app = createApp(App)
 * const i18n = createI18n({
 *   locale: 'zh-CN',
 *   legacy: false,
 *   fallbackLocale: 'zh-CN',
 *   messages
 * })
 *
 * app.use(i18n)
 * app.use(createAutoI18n(i18n))
 * app.mount('#app')
 * ```
 */
export function createAutoI18n<T extends I18n>(i18n: T) {
  const autoI18n = setupAutoI18n(i18n)
  return {
    install(app: App) {
      app.config.globalProperties.$autoI18n = autoI18n
      app.provide(__INJECTION_KEY__, autoI18n)
    },
    ...autoI18n,
  }
}

// 导出类型
export type { AutoI18nInstance, Language } from './setup-auto-i18n'
