# @oiij/shiki

[![NPM version](https://img.shields.io/npm/v/@oiij/shiki)](https://www.npmjs.com/package/@oiij/shiki)
[![MIT-license](https://img.shields.io/npm/l/@oiij/shiki)](https://github.com/oiij/use/blob/main/packages/shiki/LICENSE)

## 简介

Use Shiki 是基于 Shiki 的 Vue 3 组合式函数封装，提供便捷的代码语法高亮功能，帮助开发者在应用中实现精美的代码高亮效果。

## 特点

### 💻 代码高亮

- 🔤 支持 100+ 编程语言
- 🎨 支持多种主题（亮色/暗色）
- ⚡ 高性能语法高亮引擎

### 🔄 响应式设计

- 🔁 支持响应式代码内容
- 🔀 支持动态切换语言和主题
- 🖐️ 支持手动渲染模式

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/shiki

# 使用 npm
npm install @oiij/shiki

# 使用 yarn
yarn add @oiij/shiki
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `shiki`: ^1.0.0

## 示例

### 基础使用

```vue
<script setup>
import { useShiki } from '@oiij/shiki'
import { useTemplateRef } from 'vue'

const { html } = useShiki(useTemplateRef('code'), {
  value: 'const hello = "world"',
  lang: 'javascript'
})
</script>

<template>
  <div ref="code" />
</template>
```

### 响应式内容

```vue
<script setup>
import { useShiki } from '@oiij/shiki'
import { ref, useTemplateRef } from 'vue'

const code = ref('const hello = "world"')

const { value, html } = useShiki(useTemplateRef('render'), {
  value: code,
  lang: 'typescript'
})
</script>

<template>
  <textarea v-model="code" />
  <div ref="render" />
</template>
```

### 动态切换主题

```vue
<script setup>
import { useShiki } from '@oiij/shiki'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)

const { setDarkMode } = useShiki(useTemplateRef('code'), {
  value: 'console.log("Hello")',
  lang: 'javascript',
  darkMode
})
</script>

<template>
  <button @click="darkMode = !darkMode">
    切换主题
  </button>
  <div ref="code" />
</template>
```

### 动态切换语言

```vue
<script setup>
import { useShiki } from '@oiij/shiki'
import { ref, useTemplateRef } from 'vue'

const code = ref('const x = 1')
const lang = ref('javascript')

const { setLanguage } = useShiki(useTemplateRef('render'), {
  value: code,
  lang
})
</script>

<template>
  <select v-model="lang">
    <option value="javascript">
      JavaScript
    </option>
    <option value="typescript">
      TypeScript
    </option>
    <option value="python">
      Python
    </option>
  </select>
  <div ref="render" />
</template>
```

### 使用 v-html

```vue
<script setup>
import { useShiki } from '@oiij/shiki'
import { ref } from 'vue'

const code = ref('const x = 1')

const { html } = useShiki(undefined, {
  value: code,
  lang: 'javascript'
})
</script>

<template>
  <div v-html="html" />
</template>
```

### 手动渲染

```vue
<script setup>
import { useShiki } from '@oiij/shiki'
import { ref, useTemplateRef } from 'vue'

const code = ref('const x = 1')

const { format, html } = useShiki(useTemplateRef('render'), {
  value: code,
  lang: 'javascript',
  manual: true
})

function handleRender() {
  format()
}
</script>

<template>
  <button @click="handleRender">
    渲染
  </button>
  <div ref="render" />
</template>
```

## API

### `useShiki(templateRef?, options?)`

使用 Shiki 进行代码高亮。

#### 参数

| 参数          | 类型                       | 说明                       |
| ------------- | -------------------------- | -------------------------- |
| `templateRef` | `TemplateRef<HTMLElement>` | 渲染容器的模板引用（可选） |
| `options`     | `UseShikiOptions`          | 配置选项                   |

#### UseShikiOptions

| 选项           | 类型                                | 默认值         | 说明             |
| -------------- | ----------------------------------- | -------------- | ---------------- |
| `value`        | `MaybeRefOrGetter<string>`          | -              | 代码内容         |
| `lang`         | `MaybeRefOrGetter<BundledLanguage>` | `'javascript'` | 代码语言         |
| `darkMode`     | `ComputedRef<boolean>`              | `false`        | 是否开启暗黑模式 |
| `manual`       | `boolean`                           | `false`        | 是否手动渲染     |
| `shikiOptions` | `CodeToHastOptions`                 | -              | Shiki 配置选项   |

#### 返回值

| 属性                     | 类型                       | 说明          |
| ------------------------ | -------------------------- | ------------- |
| `templateRef`            | `TemplateRef<HTMLElement>` | 容器引用      |
| `value`                  | `Ref<string>`              | 代码内容      |
| `html`                   | `Readonly<Ref<string>>`    | 渲染后的 HTML |
| `setDarkMode(darkMode?)` | `Function`                 | 设置暗黑模式  |
| `setLanguage(lang?)`     | `Function`                 | 设置语言      |
| `format(value?)`         | `Function`                 | 格式化代码    |

## 支持的语言

Shiki 支持 100+ 种编程语言，包括但不限于：

- JavaScript / TypeScript
- Python
- Java
- C / C++ / C#
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- HTML / CSS / SCSS / Less
- JSON / YAML / TOML
- Markdown
- SQL
- Shell / Bash
- Vue / JSX / TSX

## 类型定义

```ts
import type { BundledLanguage, BundledTheme, CodeToHastOptions } from 'shiki'
import type { ComputedRef, MaybeRefOrGetter, TemplateRef } from 'vue'

export type UseShikiOptions = {
  /**
   * 代码内容
   */
  value?: MaybeRefOrGetter<string>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: ComputedRef<boolean>
  /**
   * 代码语言
   */
  lang?: MaybeRefOrGetter<BundledLanguage>
  /**
   * 是否手动渲染
   * @default false
   */
  manual?: boolean
  /**
   * Shiki 选项
   */
  shikiOptions?: CodeToHastOptions<BundledLanguage, BundledTheme>
}

export type UseShikiReturns = {
  templateRef?: TemplateRef<HTMLElement>
  value: Ref<string>
  html: Readonly<Ref<string>>
  setDarkMode: (darkMode?: boolean) => void
  setLanguage: (lang?: BundledLanguage) => void
  format: (value?: string) => Promise<void>
}

export declare function useShiki(templateRef?: TemplateRef<HTMLElement>, options?: UseShikiOptions): UseShikiReturns
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/shiki/shiki)
