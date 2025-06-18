# UseEmojiPicker

[官方文档](https://github.com/missive/emoji-mart)

## 安装

```bash
pnpm add @oiij/emoji-picker
```

## 示例

<demo vue="./demos/emoji-picker.vue" />

## Types

```ts
interface EmojiResult {
  id: string
  name: string
  native: string
  unified: string
  keywords: string[]
  shortcodes: string
}
interface EmojiPickerOptions {
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
declare function useEmojiPicker(darkMode?: ComputedRef<boolean>, language?: ComputedRef<'zh' | 'en'>, options?: EmojiPickerOptions): {
  domRef: Ref<HTMLElement | undefined, HTMLElement | undefined>
  emojiPicker: ShallowRef<Picker | undefined, Picker | undefined>
  onRender: (fn: (editor: Picker) => void) => void
}
type EmojiPickerReturns = ReturnType<typeof useEmojiPicker>
```
