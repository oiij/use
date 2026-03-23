# @oiij/auto-i18n

[![NPM version](https://img.shields.io/npm/v/@oiij/auto-i18n)](https://www.npmjs.com/package/@oiij/auto-i18n)
[![MIT-license](https://img.shields.io/npm/l/@oiij/auto-i18n)](https://github.com/oiij/use/blob/main/packages/auto-i18n/LICENSE)

## 简介

Use auto-I18n 是一个 Vue I18n 工具库，为 Vue 3 应用提供自动国际化管理、语言持久化存储等实用功能，帮助开发者更高效地管理应用国际化。

## 特点

### 🌍 自动国际化管理

- 🔍 自动检测浏览器语言
- 💾 支持语言持久化存储
- 🔄 提供响应式的语言环境计算属性

### 🛠️ 语言管理工具

- 🎯 提供 `setLocale` 方法设置具体语言环境
- 🔄 提供 `setLanguage` 方法设置语言（支持 'auto' 模式）
- 📝 完整的 TypeScript 类型支持

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- 🎯 支持泛型，可根据传入的 i18n 实例推断 locale 类型

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

## 示例

### 安装插件

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

### 在组件中使用

```vue
<script setup>
import { useAutoI18n } from '@oiij/auto-i18n'

const { language, navigatorLanguage, locale, setLocale, setLanguage } = useAutoI18n()
</script>

<template>
  <div>
    <div>
      <h2>当前语言设置: {{ language }}</h2>
      <h3>浏览器语言: {{ navigatorLanguage }}</h3>
      <h3>实际使用的语言: {{ locale }}</h3>
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
  storageKey?: string
  useStorageOptions?: UseStorageOptions<keyof T | 'auto'>
  useNavigatorLanguageOptions?: ConfigurableWindow
}

export type AutoI18nInstance<T extends Record<string, unknown>> = {
  language: Ref<keyof T | 'auto'>
  navigatorLanguage: Ref<string | undefined>
  locale: ComputedRef<keyof T>
  setLocale: (lang: keyof T) => void
  setLanguage: (lang: keyof T | 'auto') => void
}
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/auto-i18n/auto-i18n)
