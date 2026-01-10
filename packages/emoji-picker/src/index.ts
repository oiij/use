import type { ComputedRef, TemplateRef } from 'vue'
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'
import { onMounted, onUnmounted, shallowRef, watch } from 'vue'

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

export function useEmojiPicker(templateRef: TemplateRef<HTMLElement>, darkMode?: ComputedRef<boolean>, language?: ComputedRef<'zh' | 'en'>, options?: EmojiPickerOptions) {
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
    theme: darkMode?.value ? 'dark' : 'light',
    locale: language?.value,
    ...options,
  }
  const emojiPicker = shallowRef<Picker | null>(null)

  let onRender: ((editor: Picker) => void) | null = null

  function render() {
    if (templateRef.value && !emojiPicker.value) {
      emojiPicker.value = new Picker({
        parent: templateRef.value,
        ..._options,
      })
      if (typeof onRender === 'function') {
        onRender(emojiPicker.value)
      }
    }
  }
  function destroy() {
    if (!templateRef.value)
      return
    templateRef.value.innerHTML = ''
    emojiPicker.value = null
  }
  watch(templateRef, () => {
    render()
  })
  watch(() => darkMode?.value, (v) => {
    destroy()
    _options.theme = v ? 'dark' : 'light'
    render()
  })
  watch(() => language?.value, (v) => {
    destroy()
    _options.locale = v ?? 'zh'
    render()
  })
  onMounted(() => {
    render()
  })
  onUnmounted(() => {
    destroy()
  })
  return {
    templateRef,
    emojiPicker,
    onRender: (fn: (editor: Picker) => void) => {
      onRender = fn
    },
  }
}
export type EmojiPickerReturns = ReturnType<typeof useEmojiPicker>
