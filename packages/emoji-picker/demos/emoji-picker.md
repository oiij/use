# UseEmojiPicker

## 功能描述

**UseEmojiPicker** 是一个用于集成 emoji 选择器的 Vue 组合式函数，支持多种 emoji 集、皮肤色调选择、搜索功能和自定义配置，可用于在应用中添加 emoji 选择功能。

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

## 基本使用

<demo vue="./emoji-picker.vue" title="UseEmojiPicker" />

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

## 类型定义

```ts
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type EmojiResult = {
  /**
   * 表情 ID
   */
  id: string
  /**
   * 表情名称
   */
  name: string
  /**
   * 原生表情
   */
  native: string
  /**
   * 统一编码
   */
  unified: string
  /**
   * 关键词
   */
  keywords: string[]
  /**
   * 短代码
   */
  shortcodes: string
}

export type EmojiPickerOptions = {
  /**
   * 父元素
   */
  parent?: HTMLElement
  /**
   * 表情数据
   */
  data?: object
  /**
   * 国际化配置
   */
  i18n?: object
  /**
   * 分类
   */
  categories?: ('frequent' | 'people' | 'nature' | 'food' | 'activity' | 'places' | 'objects' | 'symbols' | 'flags')[]
  /**
   * 选择表情回调
   */
  onEmojiSelect?: (emoji: EmojiResult) => void
  /**
   * 点击外部回调
   */
  onClickOutside?: () => void
  /**
   * 是否自动聚焦
   */
  autoFocus?: boolean
  /**
   * 动态宽度
   */
  dynamicWidth?: boolean
  /**
   * 表情按钮大小
   */
  emojiButtonSize?: number
  /**
   * 表情大小
   */
  emojiSize?: number
  /**
   * 表情版本
   */
  emojiVersion?: 1 | 2 | 3 | 4 | 5 | 11 | 12 | 12.1 | 13 | 13.1 | 14 | 15
  /**
   * 图标样式
   */
  icons?: 'aut' | 'outline' | 'solid'
  /**
   * 语言
   */
  locale?: 'en' | 'ar' | 'be' | 'cs' | 'de' | 'es' | 'fa' | 'fi' | 'fr' | 'hi' | 'it' | 'ja' | 'ko' | 'nl' | 'pl' | 'pt' | 'ru' | 'sa' | 'tr' | 'uk' | 'vi' | 'zh'
  /**
   * 最大常用行数
   */
  maxFrequentRows?: number
  /**
   * 导航位置
   */
  navPosition?: 'top' | 'bottom' | 'none'
  /**
   * 无国家旗帜
   */
  noCountryFlags?: boolean
  /**
   * 每行数量
   */
  perLine?: number
  /**
   * 预览位置
   */
  previewPosition?: 'top' | 'bottom' | 'none'
  /**
   * 搜索位置
   */
  searchPosition?: 'sticky' | 'static' | 'none'
  /**
   * 表情集
   */
  set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter'
  /**
   * 肤色
   */
  skin?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * 肤色位置
   */
  skinTonePosition?: 'preview' | 'search' | 'none'
  /**
   * 主题
   */
  theme?: 'auto' | 'light' | 'dark'
}

export type UseEmojiPickerOptions = {
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 语言
   */
  language?: MaybeRefOrGetter<'zh' | 'en'>
  /**
   * 表情选择器选项
   */
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

## 使用示例

### 基础用法

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

### 暗黑模式

```vue
<script setup>
import { useEmojiPicker } from '@oiij/emoji-picker'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)

const { setDarkMode } = useEmojiPicker(useTemplateRef('picker'), {
  darkMode,
  emojiPickerOptions: {
    onEmojiSelect: (emoji) => {
      console.log(emoji)
    }
  }
})
</script>

<template>
  <button @click="darkMode = !darkMode">
    切换主题
  </button>
  <div ref="picker" />
</template>
```

### 多语言支持

```vue
<script setup>
import { useEmojiPicker } from '@oiij/emoji-picker'
import { ref, useTemplateRef } from 'vue'

const language = ref<'zh' | 'en'>('zh')

const { setLanguage } = useEmojiPicker(useTemplateRef('picker'), {
  language,
  emojiPickerOptions: {
    onEmojiSelect: (emoji) => {
      console.log(emoji)
    }
  }
})
</script>

<template>
  <button @click="language = language === 'zh' ? 'en' : 'zh'">
    切换语言
  </button>
  <div ref="picker" />
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
