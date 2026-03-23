# useAutoI18n

## 功能描述

**useAutoI18n** 是一个 Vue I18n 工具库，为 Vue 3 应用提供自动国际化管理、语言持久化存储等实用功能，帮助开发者更高效地管理应用国际化。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/auto-i18n

# 使用 npm
npm install @oiij/auto-i18n

# 使用 yarn
yarn add @oiij/auto-i18n
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `vue-i18n`: ^9.0.0

## 基本使用

### 1. 安装插件

在 Vue 应用中安装 `createAutoI18n` 插件，必须在 Vue I18n 之后安装：

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

<demo vue="./auto-i18n.vue" title="useAutoI18n" />

## API

### `createAutoI18n(i18n, options?)`

创建自动国际化插件，必须在 Vue I18n 之后安装。

#### 参数

| 参数      | 类型                 | 说明           |
| --------- | -------------------- | -------------- |
| `i18n`    | `I18n<T>`            | Vue I18n 实例  |
| `options` | `AutoI18nOptions<T>` | 自动国际化选项 |

#### Options

| 选项                          | 类型                 | 默认值                        | 说明                           |
| ----------------------------- | -------------------- | ----------------------------- | ------------------------------ |
| `storageKey`                  | `string`             | `'__LANGUAGE_MODE_PERSIST__'` | 存储语言的键名                 |
| `useStorageOptions`           | `UseStorageOptions`  | `{}`                          | 配置 useLocalStorage 选项      |
| `useNavigatorLanguageOptions` | `ConfigurableWindow` | `{}`                          | 配置 useNavigatorLanguage 选项 |

### `useAutoI18n()`

获取自动国际化实例。

#### 返回值

| 属性                | 类型                     | 说明                       |
| ------------------- | ------------------------ | -------------------------- |
| `language`          | `Ref<keyof T \| 'auto'>` | 语言设置，持久化存储       |
| `navigatorLanguage` | `Ref<string>`            | 浏览器导航语言             |
| `locale`            | `ComputedRef<keyof T>`   | 计算当前实际使用的语言环境 |
| `setLocale(lang)`   | `Function`               | 设置语言环境               |
| `setLanguage(lang)` | `Function`               | 设置语言（支持 'auto'）    |

### `setupAutoI18n(i18n, options?)`

设置自动国际化，提供国际化相关的工具方法和状态管理。

## 类型定义

```ts
import type { ConfigurableWindow, UseStorageOptions } from '@vueuse/core'
import type { I18n } from 'vue-i18n'

export type AutoI18nOptions<T extends Record<string, unknown>> = {
  /**
   * 存储语言的键名
   * @default '__LANGUAGE_MODE_PERSIST__'
   */
  storageKey?: string
  /**
   * 配置 useLocalStorage 选项
   */
  useStorageOptions?: UseStorageOptions<keyof T | 'auto'>
  /**
   * 配置 useNavigatorLanguage 选项
   */
  useNavigatorLanguageOptions?: ConfigurableWindow
}

export type AutoI18nInstance<T extends Record<string, unknown>> = {
  /**
   * 语言设置，持久化存储
   */
  language: Ref<keyof T | 'auto'>
  /**
   * 浏览器导航语言
   */
  navigatorLanguage: Ref<string | undefined>
  /**
   * 计算当前实际使用的语言环境
   */
  locale: ComputedRef<keyof T>
  /**
   * 设置语言环境
   */
  setLocale: (lang: keyof T) => void
  /**
   * 设置语言
   */
  setLanguage: (lang: keyof T | 'auto') => void
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useAutoI18n } from '@oiij/auto-i18n'

const { language, navigatorLanguage, locale, setLanguage } = useAutoI18n()
</script>

<template>
  <div>
    <p>当前语言: {{ language }}</p>
    <p>浏览器语言: {{ navigatorLanguage }}</p>
    <p>实际语言: {{ locale }}</p>
    <button @click="setLanguage('zh-CN')">
      中文
    </button>
    <button @click="setLanguage('en-US')">
      English
    </button>
    <button @click="setLanguage('auto')">
      自动
    </button>
  </div>
</template>
```

### 自定义存储键名

```ts
import { createAutoI18n } from '@oiij/auto-i18n'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'zh-CN',
  legacy: false,
  messages: {}
})

const autoI18n = createAutoI18n(i18n, {
  storageKey: 'my-app-language'
})
```

### 类型推断

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
