# UseShiki

## 功能描述

**UseShiki** 是一个用于代码语法高亮的 Vue 组合式函数，基于 Shiki 实现，支持多种编程语言和主题，提供实时的代码高亮渲染功能。

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

## 基本使用

<demo vue="./shiki.vue" title="UseShiki" />

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
  /**
   * 容器引用
   */
  templateRef?: TemplateRef<HTMLElement>
  /**
   * 代码内容
   */
  value: Ref<string>
  /**
   * 渲染后的 HTML
   */
  html: Readonly<Ref<string>>
  /**
   * 设置暗黑模式
   */
  setDarkMode: (darkMode?: boolean) => void
  /**
   * 设置语言
   */
  setLanguage: (lang?: BundledLanguage) => void
  /**
   * 格式化代码
   */
  format: (value?: string) => Promise<void>
}

export declare function useShiki(templateRef?: TemplateRef<HTMLElement>, options?: UseShikiOptions): UseShikiReturns
```

## 使用示例

### 基础用法

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
