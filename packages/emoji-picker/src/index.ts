import type { MaybeRefOrGetter, TemplateRef } from 'vue'
import data from '@emoji-mart/data'
import { createEventHook, watchOnce } from '@vueuse/core'
import { Picker } from 'emoji-mart'
import { onUnmounted, shallowRef } from 'vue'
import { watchRefOrGetter } from '../../_utils/custom-watch'

export type EmojiResult = {
  id: string
  name: string
  native: string
  unified: string
  keywords: string[]
  shortcodes: string
}
export type EmojiPickerOptions = {
  parent?: HTMLElement
  data?: object
  i18n?: object
  categories?: ('frequent' | 'people' | 'nature' | 'food' | 'activity' | 'places' | 'objects' | 'symbols' | 'flags')[]
  custom?: []
  onEmojiSelect?: (emoji: EmojiResult) => void
  onClickOutside?: () => void
  onAddCustomEmoji?: (emoji: EmojiResult) => void
  autoFocus?: boolean
  categoryIcons?: object
  dynamicWidth?: boolean
  emojiButtonColors?: string[]
  emojiButtonRadius?: string
  emojiButtonSize?: number
  emojiSize?: number
  emojiVersion?: 1 | 2 | 3 | 4 | 5 | 11 | 12 | 12.1 | 13 | 13.1 | 14 | 15
  exceptEmojis?: []
  icons?: 'aut' | 'outline' | 'solid'
  locale?: 'en' | 'ar' | 'be' | 'cs' | 'de' | 'es' | 'fa' | 'fi' | 'fr' | 'hi' | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt' | 'ru' | 'sa' | 'tr' | 'uk' | 'vi' | 'zh'
  maxFrequentRows?: number
  navPosition?: 'top' | 'bottom' | 'none'
  noCountryFlags?: boolean
  noResultsEmoji?: string
  perLine?: number
  previewEmoji?: 'point_up' | 'point_down'
  previewPosition?: 'top' | 'bottom' | 'none'
  searchPosition?: 'sticky' | 'static' | 'none'
  set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter'
  skin?: 1 | 2 | 3 | 4 | 5 | 6
  skinTonePosition?: 'preview' | 'search' | 'none'
  theme?: 'auto' | 'light' | 'dark'
  getSpritesheetURL?: string
}
export type UseEmojiPickerOptions = {
  darkMode?: MaybeRefOrGetter<boolean>
  language?: MaybeRefOrGetter<'zh' | 'en'>
  emojiPickerOptions?: EmojiPickerOptions
}
export function useEmojiPicker(templateRef: TemplateRef<HTMLElement>, options?: UseEmojiPickerOptions) {
  const { darkMode, language, emojiPickerOptions } = options ?? {}

  const darkModeRef = watchRefOrGetter(darkMode, updateTheme)

  const languageRef = watchRefOrGetter(language, updateLanguage)

  const _options: EmojiPickerOptions = {
    data,
    emojiButtonRadius: '6px',
    emojiButtonColors: [
      'rgba(155,223,88,.7)',
      'rgba(149,211,254,.7)',
      'rgba(247,233,34,.7)',
      'rgba(238,166,252,.7)',
      'rgba(255,213,143,.7)',
      'rgba(211,209,255,.7)',
    ],
    theme: darkModeRef.value ? 'dark' : 'light',
    locale: languageRef.value,
    ...emojiPickerOptions,
  }
  const emojiPickerInst = shallowRef<Picker | null>(null)

  const onRenderEvent = createEventHook<[Picker]>()

  function updateTheme(darkMode?: boolean) {
    if (darkMode) {
      darkModeRef.value = darkMode
    }
    const theme = darkModeRef.value ? 'dark' : 'light'
    _options.theme = theme
    destroy()
    render()
  }
  function updateLanguage(language?: 'zh' | 'en') {
    if (language) {
      languageRef.value = language
    }
    _options.locale = languageRef.value ?? 'zh'
    destroy()
    render()
  }
  function render() {
    if (templateRef.value) {
      if (!emojiPickerInst.value) {
        emojiPickerInst.value = new Picker({
          parent: templateRef.value,
          ..._options,
        })
        onRenderEvent.trigger(emojiPickerInst.value)
      }
    }
  }
  function destroy() {
    emojiPickerInst.value = null
    if (templateRef.value) {
      templateRef.value.innerHTML = ''
    }
  }
  watchOnce(templateRef, render)

  onUnmounted(() => {
    destroy()
  })
  return {
    templateRef,
    darkMode: darkModeRef,
    language: languageRef,
    emojiPickerInst,
    updateTheme,
    updateLanguage,
    onRender: onRenderEvent.on,
  }
}
export type UseEmojiPickerReturns = ReturnType<typeof useEmojiPicker>
