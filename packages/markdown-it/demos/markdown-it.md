# UseMarkdownIt

## 功能描述

**UseMarkdownIt** 是一个用于 Markdown 渲染的 Vue 组合式函数，支持自定义配置、DOM 净化和手动渲染模式，可用于在应用中展示 Markdown 内容。

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

## 基本使用

<demo vue="./markdown-it.vue" title="UseMarkdownIt" />

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
  /**
   * 容器引用
   */
  templateRef?: TemplateRef<HTMLElement>
  /**
   * Markdown 内容
   */
  value: Ref<string>
  /**
   * 渲染后的 HTML
   */
  html: Ref<string>
  /**
   * MarkdownIt 实例
   */
  markdownItInst: MarkdownIt
  /**
   * 渲染方法
   */
  render: (value?: string) => string
}

export declare function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, options?: UseMarkDownItOptions): MarkdownItReturns
```

## 使用示例

### 基础用法

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

### 使用 v-html

```vue
<script setup>
import { useMarkdownIt } from '@oiij/markdown-it'
import { ref } from 'vue'

const content = ref('# Hello World\n\n**Bold** and *italic*')

const { html } = useMarkdownIt(undefined, {
  value: content
})
</script>

<template>
  <textarea v-model="content" />
  <div v-html="html" />
</template>
```

### 自定义配置

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

<template>
  <div ref="render" />
</template>
```
````
