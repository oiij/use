# @oiij/tiptap

[![NPM version](https://img.shields.io/npm/v/@oiij/tiptap)](https://www.npmjs.com/package/@oiij/tiptap)
[![MIT-license](https://img.shields.io/npm/l/@oiij/tiptap)](https://github.com/oiij/use/blob/main/packages/tiptap/LICENSE)

## 简介

Use TipTap 是基于 TipTap 的 Vue 3 组件库封装，提供富文本编辑器组件和组合式 API，帮助开发者快速构建现代化的内容编辑应用。

## 特点

### ✏️ 富文本编辑

- **B** 支持加粗、斜体、删除线、代码等文本格式
- 📑 支持 H1-H6 标题
- 📋 支持有序/无序列表
- 💻 支持代码块、块引用
- 🖼️ 支持图片上传插入
- ↩️ 支持撤销/重做

### 🧩 组件化设计

- 📦 提供开箱即用的 TiptapEditor 组件
- 🛠️ 内置 TiptapMenu 工具栏组件
- 🌙 支持暗黑模式

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/tiptap

# 使用 npm
npm install @oiij/tiptap

# 使用 yarn
yarn add @oiij/tiptap
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `@tiptap/core`: ^2.0.0
- `@tiptap/starter-kit`: ^2.0.0
- `@tiptap/extension-image`: ^2.0.0
- `@tiptap/pm`: ^2.0.0

## 示例

### 基础使用

```vue
<script setup>
import { TiptapEditor, TiptapMenu } from '@oiij/tiptap'
import { ref } from 'vue'
import '@oiij/tiptap/style'

const content = ref('<p>欢迎使用 Tiptap 编辑器！</p>')
</script>

<template>
  <TiptapEditor v-model:value="content">
    <TiptapMenu />
  </TiptapEditor>
</template>
```

### 暗黑模式

```vue
<script setup>
import { TiptapEditor, TiptapMenu } from '@oiij/tiptap'
import { ref } from 'vue'
import '@oiij/tiptap/style'

const content = ref('<p>暗黑模式编辑器</p>')
</script>

<template>
  <div class="dark">
    <TiptapEditor v-model:value="content">
      <TiptapMenu />
    </TiptapEditor>
  </div>
</template>
```

### 使用 Composable

```vue
<script setup>
import { useTipTap } from '@oiij/tiptap'
import { useTemplateRef } from 'vue'
import '@oiij/tiptap/style'

const { value, setContent, insertImage } = useTipTap(useTemplateRef('editor'), {
  value: '<p>初始内容</p>'
})

function handleInsertImage() {
  insertImage('https://example.com/image.png', '图片描述')
}
</script>

<template>
  <div ref="editor" />
  <button @click="handleInsertImage">
    插入图片
  </button>
</template>
```

## 组件

### TiptapEditor

编辑器组件。

#### Props

| 属性      | 类型                     | 说明                     |
| --------- | ------------------------ | ------------------------ |
| `value`   | `string`                 | 编辑器内容，支持 v-model |
| `options` | `Partial<EditorOptions>` | TipTap 编辑器配置        |

#### Events

| 事件           | 参数              | 说明           |
| -------------- | ----------------- | -------------- |
| `update:value` | `(value: string)` | 内容更新时触发 |

### TiptapMenu

工具栏组件，自动通过 provide/inject 获取编辑器实例。

内置功能按钮：

- 文本格式：加粗、斜体、删除线、代码
- 段落格式：段落、H1-H6
- 列表：无序列表、有序列表
- 块元素：代码块、块引用、水平线
- 媒体：图片上传
- 其他：清除格式、清除节点、硬换行、撤销、重做

## API

### `useTipTap(templateRef, options?)`

使用 TipTap 编辑器。

#### 参数

| 参数          | 类型                       | 说明                 |
| ------------- | -------------------------- | -------------------- |
| `templateRef` | `TemplateRef<HTMLElement>` | 编辑器容器的模板引用 |
| `options`     | `UseTipTapOptions`         | 配置选项             |

#### UseTipTapOptions

| 选项            | 类型                       | 默认值 | 说明            |
| --------------- | -------------------------- | ------ | --------------- |
| `value`         | `MaybeRefOrGetter<string>` | -      | 编辑器内容      |
| `tiptapOptions` | `Partial<EditorOptions>`   | -      | TipTap 配置选项 |

#### 返回值

| 属性                             | 类型                         | 说明           |
| -------------------------------- | ---------------------------- | -------------- |
| `templateRef`                    | `TemplateRef<HTMLElement>`   | 容器引用       |
| `value`                          | `Ref<string>`                | 编辑器内容     |
| `editorInst`                     | `ShallowRef<Editor \| null>` | 编辑器实例     |
| `setContent(value?)`             | `Function`                   | 设置编辑器内容 |
| `insertImage(src, alt?, title?)` | `Function`                   | 插入图片       |
| `onRendered(callback)`           | `Function`                   | 渲染完成事件   |
| `onUpdateValue(callback)`        | `Function`                   | 内容更新事件   |

## 类型定义

```ts
import type { EditorOptions } from '@tiptap/core'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type UseTipTapOptions = {
  value?: MaybeRefOrGetter<string>
  tiptapOptions?: Partial<EditorOptions>
}

export type UseTipTapReturns = {
  templateRef: TemplateRef<HTMLElement>
  value: Ref<string>
  editorInst: ShallowRef<Editor | null>
  setContent: (value?: string) => void
  insertImage: (src: string, alt?: string, title?: string) => void
  onRendered: (callback: (editor: Editor) => void) => void
  onUpdateValue: (callback: (value: string) => void) => void
}

export declare function useTipTap(templateRef: TemplateRef<HTMLElement>, options?: UseTipTapOptions): UseTipTapReturns
export declare const TiptapEditor: Component
export declare const TiptapMenu: Component
```

## 样式自定义

组件使用 CSS 变量实现主题，可覆盖以下变量：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --border: 240 5.9% 90%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
}
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/tiptap/tiptap)
