# Use auto-I18n 🚀

[![NPM version](https://img.shields.io/npm/v/@oiij/auto-i18n)](https://www.npmjs.com/package/@oiij/auto-i18n)
[![MIT-license](https://img.shields.io/npm/l/@oiij/auto-i18n)](https://github.com/oiij/use/blob/main/packages/auto-i18n/LICENSE)

## 项目简介 📦

Use auto-I18n 是一个 Vue I18n 工具库，为 Vue 3 应用提供自动国际化管理、语言持久化存储等实用功能，帮助开发者更高效地管理应用国际化。

## 功能特点 ✨

### 自动国际化管理 🌍

- 🔄 自动检测浏览器语言
- 📊 支持语言持久化存储
- 🎯 提供响应式的语言环境计算属性

### 语言管理工具 �️

- 🚀 提供 `setLocale` 方法设置具体语言环境
- 🎨 提供 `setLanguage` 方法设置语言（支持 'auto' 模式）
- � 完整的 TypeScript 类型支持

### 类型安全 🔒

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- 🎯 支持泛型，可根据传入的 i18n 实例推断 locale 类型

## 安装 📥

### 使用 pnpm 🐱

```bash
pnpm add @oiij/auto-i18n
```

### 使用 npm 📦

```bash
npm install @oiij/auto-i18n
```

### 使用 yarn 🧶

```bash
yarn add @oiij/auto-i18n
```

## 快速开始 🌟

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

## 类型推断示例 🔒

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

## 插件工具函数 🛠️

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

## 在线文档 📚

[在线文档](https://oiij-use.vercel.app/auto-i18n/auto-i18n) 📖

## 贡献指南 🤝

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库 🍴
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`) 🌿
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`) 💾
4. 推送到分支 (`git push origin feature/amazing-feature`) 🚀
5. 打开一个 Pull Request 📥

## 许可证 📄

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情 📑

## 联系方式 📞

- GitHub: [https://github.com/oiij/use](https://github.com/oiij/use) 🌟
