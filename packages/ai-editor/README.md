# @oiij/ai-editor

[![NPM version](https://img.shields.io/npm/v/@oiij/ai-editor)](https://www.npmjs.com/package/@oiij/ai-editor)
[![MIT-license](https://img.shields.io/npm/l/@oiij/ai-editor)](https://github.com/oiij/use/blob/main/packages/ai-editor/LICENSE)

## 简介

Use AiEditor 是一个功能强大的 AI 编辑器组件，为 Vue 3 应用提供智能编辑能力，帮助开发者构建具有 AI 辅助功能的编辑器应用。

## 特点

### 🤖 AI 集成

- 🧠 内置 AI 辅助功能，智能辅助内容创作
- 💬 支持多轮对话交互
- ⚡ 实时响应，流畅的用户体验

### 🧩 模块化设计

- 🏗️ 采用模块化架构，组件独立封装
- 📦 支持按需导入，减小打包体积
- 📁 清晰的文件结构，易于维护和扩展

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

### 🚀 轻量高效

- 🪶 核心代码精简，无额外依赖
- ⚡ 优化的性能表现，最小化运行时开销
- 📉 支持 Tree Shaking，进一步减小打包体积

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/ai-editor

# 使用 npm
npm install @oiij/ai-editor

# 使用 yarn
yarn add @oiij/ai-editor
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0
- `aieditor`: ^1.0.0

## 示例

### 基础使用

```vue
<script setup>
import { useAiEditor } from '@oiij/ai-editor'
import { useTemplateRef } from 'vue'

const { value, aiEditorInst } = useAiEditor(useTemplateRef('editor'), {
  value: '<p>Hello World</p>',
})
</script>

<template>
  <div ref="editor" />
</template>
```

### 完整配置

```vue
<script setup>
import { useAiEditor } from '@oiij/ai-editor'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)
const language = ref<'zh' | 'en'>('zh')
const valueRef = ref('<p>初始内容</p>')

const { value, setContent, setDarkMode, setLanguage, onUpdateValue } = useAiEditor(
  useTemplateRef('editor'),
  {
    value: valueRef,
    darkMode,
    language,
    readonly: false,
  }
)

onUpdateValue((newValue) => {
  console.log('内容更新:', newValue)
})
</script>

<template>
  <div>
    <button @click="setDarkMode(!darkMode)">
      切换主题
    </button>
    <button @click="setLanguage(language === 'zh' ? 'en' : 'zh')">
      切换语言
    </button>
    <div ref="editor" />
  </div>
</template>
```

## API

### `useAiEditor(templateRef, options?)`

#### 参数

| 参数          | 类型                       | 说明                 |
| ------------- | -------------------------- | -------------------- |
| `templateRef` | `TemplateRef<HTMLElement>` | 编辑器容器的模板引用 |
| `options`     | `UseAiEditorOptions`       | 编辑器配置选项       |

#### Options

| 选项              | 类型                               | 默认值      | 说明                  |
| ----------------- | ---------------------------------- | ----------- | --------------------- |
| `value`           | `MaybeRefOrGetter<string>`         | `undefined` | 编辑器内容            |
| `darkMode`        | `MaybeRefOrGetter<boolean>`        | `false`     | 是否开启暗黑模式      |
| `language`        | `MaybeRefOrGetter<'zh' \| 'en'>`   | `'zh'`      | 编辑器语言            |
| `readonly`        | `MaybeRefOrGetter<boolean>`        | `false`     | 是否只读              |
| `aiEditorOptions` | `Omit<AiEditorOptions, 'element'>` | `{}`        | AiEditor 原生配置选项 |

#### 返回值

| 属性                      | 类型                           | 说明               |
| ------------------------- | ------------------------------ | ------------------ |
| `templateRef`             | `TemplateRef<HTMLElement>`     | 编辑器容器引用     |
| `value`                   | `Ref<string>`                  | 编辑器内容         |
| `darkMode`                | `Ref<boolean>`                 | 暗黑模式状态       |
| `language`                | `Ref<'zh' \| 'en'>`            | 当前语言           |
| `readonly`                | `Ref<boolean>`                 | 只读状态           |
| `aiEditorInst`            | `ShallowRef<AiEditor \| null>` | AiEditor 实例      |
| `setContent(value?)`      | `Function`                     | 设置编辑器内容     |
| `setDarkMode(darkMode?)`  | `Function`                     | 设置暗黑模式       |
| `setLanguage(language?)`  | `Function`                     | 设置语言           |
| `setReadonly(readonly?)`  | `Function`                     | 设置只读状态       |
| `onRendered(callback)`    | `Function`                     | 编辑器渲染完成事件 |
| `onUpdateValue(callback)` | `Function`                     | 内容更新事件       |

## 类型定义

```ts
import type { AiEditorOptions } from 'aieditor'
import type { MaybeRefOrGetter, TemplateRef } from 'vue'

export type UseAiEditorOptions = {
  value?: MaybeRefOrGetter<string>
  darkMode?: MaybeRefOrGetter<boolean>
  language?: MaybeRefOrGetter<'zh' | 'en'>
  readonly?: MaybeRefOrGetter<boolean>
  aiEditorOptions?: Omit<AiEditorOptions, 'element'>
}

export type UseAiEditorReturns = ReturnType<typeof useAiEditor>
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/ai-editor/ai-editor)
