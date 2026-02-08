# useAutoI18n

## 功能描述

**useAutoI18n** 是一个 Vue I18n 工具库，为 Vue 3 应用提供自动国际化管理、语言持久化存储等实用功能，帮助开发者更高效地管理应用国际化。

## 安装

```bash
# 使用 npm
npm install @oiij/auto-i18n

# 使用 yarn
yarn add @oiij/auto-i18n

# 使用 pnpm
pnpm add @oiij/auto-i18n
```

## 基本使用

### 1. 安装插件

在 Vue 应用中安装 `createAutoI18n` 插件：

```ts
import messages from '@intlify/unplugin-vue-i18n/messages'
import { createAutoI18n } from '@oiij/auto-i18n'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'

const app = createApp(App)
const i18n = createI18n({
  locale: 'zh-CN',
  legacy: false,
  fallbackLocale: 'zh-CN',
  messages
})

// 必须先安装 Vue I18n
app.use(i18n)
// 然后安装自动国际化插件
app.use(createAutoI18n(i18n))

app.mount('#app')
```

### 2. 在组件中使用

在 Vue 组件中使用 `useAutoI18n` 获取国际化实例：

```vue
<script setup>
import { useAutoI18n } from '@oiij/auto-i18n'

const { language, navigatorLanguage, _locale, setLocale, setLanguage } = useAutoI18n()
</script>

<template>
  <div>
    <div>
      <h2>当前语言设置: {{ language.value }}</h2>
      <h3>浏览器语言: {{ navigatorLanguage.value }}</h3>
      <h3>实际使用的语言: {{ _locale.value }}</h3>
    </div>

    <div>
      <button @click="setLanguage('auto')">
        自动（浏览器语言）
      </button>
      <button @click="setLanguage('zh-CN')">
        中文
      </button>
      <button @click="setLanguage('en-US')">
        English
      </button>
    </div>
  </div>
</template>
```

## 类型推断示例

auto-I18n 支持泛型，可以根据传入的 i18n 实例推断出正确的 locale 类型：

```ts
import { createAutoI18n } from '@oiij/auto-i18n'
import { createI18n } from 'vue-i18n'

// 定义具体的 messages 类型
const messages = {
  'zh-CN': {
    hello: '你好'
  },
  'en-US': {
    hello: 'Hello'
  }
} as const

// 创建 i18n 实例
const i18n = createI18n({
  locale: 'zh-CN',
  legacy: false,
  fallbackLocale: 'zh-CN',
  messages
})

// 创建 auto-i18n 实例
const autoI18n = createAutoI18n(i18n)

// TypeScript 会自动推断出 locale 的类型为 'zh-CN' | 'en-US'
autoI18n.setLocale('zh-CN') // ✅ 正确
autoI18n.setLocale('en-US') // ✅ 正确
autoI18n.setLocale('fr-FR') // ❌ 类型错误
```

## 插件工具函数

auto-I18n 还提供了一些实用的插件工具函数：

### 检测浏览器语言

```ts
import { detectBrowserLanguage } from '@oiij/auto-i18n/plugin'

const locale = detectBrowserLanguage()
console.log(locale) // 例如: 'zh-CN' 或 'en-US'
```

### 格式化语言名称

```ts
import { formatLanguageName } from '@oiij/auto-i18n/plugin'

console.log(formatLanguageName('zh-CN')) // '中文'
console.log(formatLanguageName('en-US')) // 'English'
```

## API

### 函数签名

```ts
/**
 * 获取自动国际化实例
 *
 * @returns 自动国际化实例，包含语言管理工具方法
 */
declare function useAutoI18n<T extends I18n = I18n>(): AutoI18nInstance<T>

/**
 * 创建自动国际化插件
 *
 * 必须在 Vue I18n 之后安装
 *
 * @param i18n Vue I18n 实例
 * @returns Vue 插件对象
 */
declare function createAutoI18n<T extends I18n>(i18n: T): Plugin

/**
 * 设置自动国际化
 *
 * 提供国际化相关的工具方法和状态管理
 *
 * @param i18n Vue I18n 实例
 * @returns 自动国际化实例，包含语言管理工具方法
 */
declare function setupAutoI18n<T extends I18n>(i18n: T): AutoI18nInstance<T>
```

## 类型定义

```ts
/**
 * 从 I18n 实例中提取 locale 类型
 */
type ExtractLocale<T extends I18n> = T['global']['locale']

/**
 * 语言设置类型
 */
type Language = 'auto' | string

/**
 * 自动国际化实例类型
 *
 * 由 setupAutoI18n 函数返回的对象类型
 */
type AutoI18nInstance<T extends I18n = I18n> = {
  /**
   * 语言设置，持久化存储
   *
   * 使用 useLocalStorage 持久化存储语言设置到本地存储
   */
  language: Ref<Language>

  /**
   * 浏览器导航语言
   *
   * 使用 useNavigatorLanguage 获取浏览器的语言设置
   */
  navigatorLanguage: Ref<string>

  /**
   * 计算当前实际使用的语言环境
   *
   * 如果语言设置为 'auto'，则使用浏览器导航语言；否则使用设置的语言
   */
  _locale: ComputedRef<string>

  /**
   * 设置语言环境
   *
   * @param lang - 要设置的语言环境
   */
  setLocale: (lang: ExtractLocale<T>) => void

  /**
   * 设置语言
   *
   * @param lang - 要设置的语言，可以是 'auto' 或具体的语言环境
   */
  setLanguage: (lang: Language) => void
}
```
