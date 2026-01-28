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
export type UseShikiOptions = {
  value?: MaybeRefOrGetter<string>
  darkMode?: ComputedRef<boolean>
  lang?: MaybeRefOrGetter<BundledLanguage>
  manual?: boolean
  shikiOptions?: CodeToHastOptions<BundledLanguage, BundledTheme>
}
export function useShiki(templateRef?: TemplateRef<HTMLElement>, options?: UseShikiOptions) {
  const { value, darkMode, lang, manual, shikiOptions } = options ?? {}

  const valueRef = watchRefOrGetter(value, format)
  const darkModeRef = watchRefOrGetter(darkMode, updateTheme)
  const langRef = watchRefOrGetter(lang, updateLang)

  const htmlRef = ref('')

  function updateTheme(darkMode?: boolean) {
    if (darkMode) {
      darkModeRef.value = true
    }
    format()
  }
  function updateLang(lang?: BundledLanguage) {
    if (lang) {
      langRef.value = lang
    }
    format()
  }
  async function format(value?: string) {
    if (value) {
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
    valueRef,
    htmlRef: readonly(htmlRef),
    updateTheme,
    updateLang,
    format,
  }
}

export type UseShikiReturns = ReturnType<typeof useShiki>
