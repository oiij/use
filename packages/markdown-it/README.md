# @oiij/markdown-it

[![NPM version](https://img.shields.io/npm/v/@oiij/markdown-it)](https://www.npmjs.com/package/@oiij/markdown-it)
[![MIT-license](https://img.shields.io/npm/l/@oiij/markdown-it)](https://github.com/oiij/use/blob/main/packages/markdown-it/LICENSE)

## 简介

Use Markdown-it 是基于 markdown-it 的 Vue 3 组合式函数封装，提供便捷的 Markdown 渲染功能，帮助开发者在应用中快速渲染 Markdown 内容。

## 特点

### 📝 Markdown 渲染

- ✅ 支持 CommonMark 和 GitHub Flavored Markdown
- 🛡️ 支持 DOM 净化（XSS 防护）
- ⚡ 高性能渲染引擎

### 🔄 响应式设计

- 🔁 支持响应式内容更新
- 🖐️ 支持手动渲染模式
- 🔗 自动同步 HTML 内容

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/markdown-it

# 使用 npm
npm install @oiij/markdown-it

# 使用 yarn
yarn add @oiij/markdown-it
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `markdown-it`: ^14.0.0
- `dompurify`: ^3.0.0

## 示例

### 基础使用

```vue
<script setup>
import { useMarkdownIt } from '@oiij/markdown-it'
import { useTemplateRef } from 'vue'

const { html } = useMarkdownIt(useTemplateRef('content'), {
  value: '# Hello World\n\n这是一段 **Markdown** 内容'
})
</script>

<template>
  <div ref="content" />
</template>
```

### 响应式内容

```vue
<script setup>
import { useMarkdownIt } from '@oiij/markdown-it'
import { ref, useTemplateRef } from 'vue'

const content = ref('# 标题\n\n这是一段内容')

const { value, html } = useMarkdownIt(useTemplateRef('render'), {
  value: content
})
</script>

<template>
  <textarea v-model="content" />
  <div ref="render" />
  <p>渲染的 HTML: {{ html }}</p>
</template>
```

### 手动渲染

```vue
<script setup>
import { useMarkdownIt } from '@oiij/markdown-it'
import { ref, useTemplateRef } from 'vue'

const content = ref('# 标题')

const { html, render } = useMarkdownIt(useTemplateRef('render'), {
  value: content,
  manual: true
})

function handleRender() {
  render()
}
</script>

<template>
  <textarea v-model="content" />
  <button @click="handleRender">
    渲染
  </button>
  <div ref="render" />
</template>
```

### 禁用 DOM 净化

```vue
<script setup>
import { useMarkdownIt } from '@oiij/markdown-it'
import { useTemplateRef } from 'vue'

const { html } = useMarkdownIt(useTemplateRef('render'), {
  value: '<script>alert("xss")<\/script>',
  domPurify: false // 禁用 DOM 净化（不推荐）
})
</script>
```

### 自定义 MarkdownIt 配置

````vue
<script setup>
import { useMarkdownIt } from '@oiij/markdown-it'
import { useTemplateRef } from 'vue'

const { html } = useMarkdownIt(useTemplateRef('render'), {
  value: '# Hello\n\n```js\nconsole.log("code")\n```',
  markdownItOptions: {
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  }
})
</script>
````

## API

### `useMarkdownIt(templateRef?, options?)`

使用 MarkdownIt 渲染 Markdown 内容。

#### 参数

| 参数          | 类型                       | 说明                       |
| ------------- | -------------------------- | -------------------------- |
| `templateRef` | `TemplateRef<HTMLElement>` | 渲染容器的模板引用（可选） |
| `options`     | `UseMarkDownItOptions`     | 配置选项                   |

#### UseMarkDownItOptions

| 选项                | 类型                       | 默认值  | 说明                |
| ------------------- | -------------------------- | ------- | ------------------- |
| `value`             | `MaybeRefOrGetter<string>` | -       | Markdown 内容       |
| `manual`            | `boolean`                  | `false` | 是否手动渲染        |
| `domPurify`         | `boolean`                  | `true`  | 是否使用 DOM 净化   |
| `markdownItOptions` | `Options`                  | -       | MarkdownIt 配置选项 |

#### 返回值

| 属性             | 类型                       | 说明            |
| ---------------- | -------------------------- | --------------- |
| `templateRef`    | `TemplateRef<HTMLElement>` | 容器引用        |
| `value`          | `Ref<string>`              | Markdown 内容   |
| `html`           | `Ref<string>`              | 渲染后的 HTML   |
| `markdownItInst` | `MarkdownIt`               | MarkdownIt 实例 |
| `render(value?)` | `Function`                 | 渲染方法        |

### `render(value?)`

手动渲染 Markdown 内容。

#### 参数

| 参数    | 类型     | 说明                           |
| ------- | -------- | ------------------------------ |
| `value` | `string` | 要渲染的 Markdown 内容（可选） |

#### 返回值

| 类型     | 说明               |
| -------- | ------------------ |
| `string` | 渲染后的 HTML 内容 |

## 类型定义

```ts
import type { Options } from 'markdown-it'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type UseMarkDownItOptions = {
  /**
   * Markdown 内容
   */
  value?: MaybeRefOrGetter<string>
  /**
   * 是否手动渲染
   * @default false
   */
  manual?: boolean
  /**
   * 是否使用 DOM 净化
   * @default true
   */
  domPurify?: boolean
  /**
   * MarkdownIt 选项
   */
  markdownItOptions?: Options
}

export type MarkdownItReturns = {
  templateRef?: TemplateRef<HTMLElement>
  value: Ref<string>
  html: Ref<string>
  markdownItInst: MarkdownIt
  render: (value?: string) => string
}

export declare function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, options?: UseMarkDownItOptions): MarkdownItReturns
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/markdown-it/markdown-it)
