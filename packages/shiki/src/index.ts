import type { BundledLanguage, BundledTheme, CodeToHastOptions } from 'shiki'
import type { ComputedRef, MaybeRefOrGetter, TemplateRef } from 'vue'
import { codeToHtml } from 'shiki'
import { onMounted, onUnmounted, readonly, ref } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

export type {
  BundledLanguage,
  BundledTheme,
  CodeToHastOptions,
}

/**
 * 使用 Shiki 选项类型
 */
export type UseShikiOptions = {
  /**
   * 代码内容
   */
  value?: MaybeRefOrGetter<string>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: ComputedRef<boolean>
  /**
   * 代码语言
   */
  lang?: MaybeRefOrGetter<BundledLanguage>
  /**
   * 是否手动渲染
   * @default false
   */
  manual?: boolean
  /**
   * Shiki 选项
   */
  shikiOptions?: CodeToHastOptions<BundledLanguage, BundledTheme>
}

/**
 * 使用 Shiki
 *
 * @param templateRef - 渲染容器的模板引用
 * @param options - Shiki 选项
 * @returns Shiki 实例和工具方法
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue'
 * import { useShiki } from '@oiij/shiki'
 *
 * const code = ref('const hello = "world"')
 * const { html, format } = useShiki({
 *   value: code,
 *   lang: 'javascript'
 * })
 * </script>
 *
 * <template>
 *   <pre v-html="html"></pre>
 * </template>
 * ```
 */
export function useShiki(templateRef?: TemplateRef<HTMLElement>, options?: UseShikiOptions) {
  const { value, darkMode, lang, manual, shikiOptions } = options ?? {}

  const valueRef = watchRefOrGetter(value, format)
  const darkModeRef = watchRefOrGetter(darkMode, updateTheme)
  const langRef = watchRefOrGetter(lang, updateLang)

  const htmlRef = ref('')

  /**
   * 更新主题
   *
   * @param darkMode - 是否开启暗黑模式
   */
  function updateTheme(darkMode?: boolean) {
    if (darkMode !== undefined && darkMode !== darkModeRef.value) {
      darkModeRef.value = darkMode
    }
    format()
  }

  /**
   * 更新语言
   *
   * @param lang - 代码语言
   */
  function updateLang(lang?: BundledLanguage) {
    if (lang !== undefined && lang !== langRef.value) {
      langRef.value = lang
    }
    format()
  }

  /**
   * 格式化代码
   *
   * @param value - 代码内容
   *
   * @example
   * ```ts
   * import { useShiki } from '@oiij/shiki'
   *
   * const { format, html } = useShiki()
   * await format('const hello = "world"')
   * console.log(html.value) // 渲染后的 HTML
   * ```
   */
  async function format(value?: string) {
    if (value !== undefined && value !== valueRef.value) {
      valueRef.value = value
    }
    const lang = langRef.value ?? 'javascript'
    const theme = `vitesse-${darkModeRef.value ? 'dark' : 'light'}`
    const result = await codeToHtml(valueRef.value ?? '', { lang, theme, ...shikiOptions })
    htmlRef.value = result
    if (templateRef?.value) {
      templateRef.value.innerHTML = htmlRef.value
    }
  }

  onMounted(() => {
    if (!manual) {
      format()
    }
  })

  onUnmounted(() => {
    if (templateRef?.value) {
      templateRef.value.innerHTML = ''
    }
  })

  return {
    templateRef,
    value: valueRef,
    html: readonly(htmlRef),
    updateTheme,
    updateLang,
    format,
  }
}

/**
 * 使用 Shiki 返回值类型
 */
export type UseShikiReturns = ReturnType<typeof useShiki>
