# UseEmojiPicker

## 功能描述

**UseEmojiPicker** 是一个用于集成 emoji 选择器的 Vue 组合式函数，支持多种 emoji 集、皮肤色调选择、搜索功能和自定义配置，可用于在应用中添加 emoji 选择功能。

## 安装

```bash
# 使用 npm
npm install @oiij/emoji-picker

# 使用 yarn
yarn add @oiij/emoji-picker

# 使用 pnpm
pnpm add @oiij/emoji-picker
```

## 基本使用

<demo vue="./emoji-picker.vue" title="UseEmojiPicker" />

## API

### 函数签名

```ts
declare function useEmojiPicker(templateRef: TemplateRef<HTMLElement>, darkMode?: ComputedRef<boolean>, language?: ComputedRef<'zh' | 'en'>, options?: EmojiPickerOptions): UseEmojiPickerReturns
```

## 类型定义

```ts
type EmojiResult = {
  id: string
  name: string
  native: string
  unified: string
  keywords: string[]
  shortcodes: string
}
type EmojiPickerOptions = {
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
export type UseEmojiPickerReturns = {
  templateRef: Readonly<ShallowRef<HTMLElement | null>>
  emojiPicker: ShallowRef<Picker | null>
  onRender: (fn: (editor: Picker) => void) => void
}
declare function useEmojiPicker(templateRef: TemplateRef<HTMLElement>, darkMode?: ComputedRef<boolean>, language?: ComputedRef<'zh' | 'en'>, options?: EmojiPickerOptions): UseEmojiPickerReturns
```
