# @oiij/emoji-picker

[![NPM version](https://img.shields.io/npm/v/@oiij/emoji-picker)](https://www.npmjs.com/package/@oiij/emoji-picker)
[![MIT-license](https://img.shields.io/npm/l/@oiij/emoji-picker)](https://github.com/oiij/use/blob/main/packages/emoji-picker/LICENSE)

## 简介

Use EmojiPicker 是基于 emoji-mart 的 Vue 3 组合式函数封装，提供便捷的表情选择器功能，帮助开发者在应用中轻松集成表情选择功能。

## 特点

### 😊 表情丰富

- 🍎 支持多种表情集（Apple、Google、Twitter 等）
- 🔍 支持搜索和分类
- 🎨 支持肤色选择

### 🌍 多语言支持

- 🗣️ 支持 20+ 种语言
- 🇨🇳 中文、英文等多种界面语言

### 🌙 暗黑模式

- 🌓 支持暗黑模式切换
- 🔄 自动重建选择器应用主题

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/emoji-picker

# 使用 npm
npm install @oiij/emoji-picker

# 使用 yarn
yarn add @oiij/emoji-picker
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `emoji-mart`: ^5.0.0
- `@emoji-mart/data`: ^1.0.0

## 示例

### 基础使用

```vue
<script setup>
import { useEmojiPicker } from '@oiij/emoji-picker'
import { useTemplateRef } from 'vue'

const { onRendered } = useEmojiPicker(useTemplateRef('picker'), {
  emojiPickerOptions: {
    onEmojiSelect: (emoji) => {
      console.log('选择了表情', emoji.native)
    }
  }
})
</script>

<template>
  <div ref="picker" />
</template>
```

### 响应式配置

```vue
<script setup>
import { useEmojiPicker } from '@oiij/emoji-picker'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)
const language = ref<'zh' | 'en'>('zh')
const selectedEmoji = ref('')

const { setDarkMode, setLanguage } = useEmojiPicker(useTemplateRef('picker'), {
  darkMode,
  language,
  emojiPickerOptions: {
    onEmojiSelect: (emoji) => {
      selectedEmoji.value = emoji.native
    }
  }
})
</script>

<template>
  <button @click="darkMode = !darkMode">
    切换主题
  </button>
  <button @click="language = language === 'zh' ? 'en' : 'zh'">
    切换语言
  </button>
  <div ref="picker" />
  <p>已选择: {{ selectedEmoji }}</p>
</template>
```

### 自定义配置

```vue
<script setup>
import { useEmojiPicker } from '@oiij/emoji-picker'
import { useTemplateRef } from 'vue'

const { onRendered } = useEmojiPicker(useTemplateRef('picker'), {
  emojiPickerOptions: {
    theme: 'light',
    set: 'apple',
    skin: 1,
    perLine: 8,
    maxFrequentRows: 2,
    previewPosition: 'none',
    searchPosition: 'sticky',
    navPosition: 'top',
    onEmojiSelect: (emoji) => {
      console.log(emoji)
    }
  }
})
</script>

<template>
  <div ref="picker" />
</template>
```

## API

### `useEmojiPicker(templateRef, options?)`

使用表情选择器。

#### 参数

| 参数          | 类型                       | 说明                     |
| ------------- | -------------------------- | ------------------------ |
| `templateRef` | `TemplateRef<HTMLElement>` | 表情选择器容器的模板引用 |
| `options`     | `UseEmojiPickerOptions`    | 表情选择器配置选项       |

#### UseEmojiPickerOptions

| 选项                 | 类型                             | 默认值  | 说明                |
| -------------------- | -------------------------------- | ------- | ------------------- |
| `darkMode`           | `MaybeRefOrGetter<boolean>`      | `false` | 是否开启暗黑模式    |
| `language`           | `MaybeRefOrGetter<'zh' \| 'en'>` | `'zh'`  | 界面语言            |
| `emojiPickerOptions` | `EmojiPickerOptions`             | -       | emoji-mart 配置选项 |

#### 返回值

| 属性                     | 类型                         | 说明         |
| ------------------------ | ---------------------------- | ------------ |
| `templateRef`            | `TemplateRef<HTMLElement>`   | 容器引用     |
| `darkMode`               | `Ref<boolean>`               | 暗黑模式状态 |
| `language`               | `Ref<'zh' \| 'en'>`          | 当前语言     |
| `emojiPickerInst`        | `ShallowRef<Picker \| null>` | Picker 实例  |
| `setDarkMode(darkMode?)` | `Function`                   | 设置暗黑模式 |
| `setLanguage(language?)` | `Function`                   | 设置语言     |
| `onRendered(callback)`   | `Function`                   | 渲染完成事件 |

## EmojiPickerOptions 配置

| 选项              | 类型                                                         | 说明         |
| ----------------- | ------------------------------------------------------------ | ------------ |
| `onEmojiSelect`   | `(emoji: EmojiResult) => void`                               | 选择表情回调 |
| `onClickOutside`  | `() => void`                                                 | 点击外部回调 |
| `theme`           | `'auto' \| 'light' \| 'dark'`                                | 主题         |
| `set`             | `'native' \| 'apple' \| 'facebook' \| 'google' \| 'twitter'` | 表情集       |
| `skin`            | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                                 | 肤色         |
| `locale`          | `string`                                                     | 语言         |
| `perLine`         | `number`                                                     | 每行数量     |
| `maxFrequentRows` | `number`                                                     | 最大常用行数 |
| `previewPosition` | `'top' \| 'bottom' \| 'none'`                                | 预览位置     |
| `searchPosition`  | `'sticky' \| 'static' \| 'none'`                             | 搜索位置     |
| `navPosition`     | `'top' \| 'bottom' \| 'none'`                                | 导航位置     |

## 类型定义

```ts
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

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
  onEmojiSelect?: (emoji: EmojiResult) => void
  onClickOutside?: () => void
  autoFocus?: boolean
  dynamicWidth?: boolean
  emojiButtonSize?: number
  emojiSize?: number
  emojiVersion?: 1 | 2 | 3 | 4 | 5 | 11 | 12 | 12.1 | 13 | 13.1 | 14 | 15
  icons?: 'aut' | 'outline' | 'solid'
  locale?: 'en' | 'ar' | 'be' | 'cs' | 'de' | 'es' | 'fa' | 'fi' | 'fr' | 'hi' | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt' | 'ru' | 'sa' | 'tr' | 'uk' | 'vi' | 'zh'
  maxFrequentRows?: number
  navPosition?: 'top' | 'bottom' | 'none'
  noCountryFlags?: boolean
  perLine?: number
  previewPosition?: 'top' | 'bottom' | 'none'
  searchPosition?: 'sticky' | 'static' | 'none'
  set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter'
  skin?: 1 | 2 | 3 | 4 | 5 | 6
  skinTonePosition?: 'preview' | 'search' | 'none'
  theme?: 'auto' | 'light' | 'dark'
}

export type UseEmojiPickerOptions = {
  darkMode?: MaybeRefOrGetter<boolean>
  language?: MaybeRefOrGetter<'zh' | 'en'>
  emojiPickerOptions?: EmojiPickerOptions
}

export type UseEmojiPickerReturns = {
  templateRef: TemplateRef<HTMLElement>
  darkMode: Ref<boolean>
  language: Ref<'zh' | 'en'>
  emojiPickerInst: ShallowRef<Picker | null>
  setDarkMode: (darkMode?: boolean) => void
  setLanguage: (language?: 'zh' | 'en') => void
  onRendered: (callback: (instance: Picker) => void) => void
}

export declare function useEmojiPicker(templateRef: TemplateRef<HTMLElement>, options?: UseEmojiPickerOptions): UseEmojiPickerReturns
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/emoji-picker/emoji-picker)
