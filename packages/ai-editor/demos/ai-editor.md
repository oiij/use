# UseAiEditor

## 功能描述

**UseAiEditor** 是一个用于集成 AI 编辑器的 Vue 组合式函数，支持默认值设置、暗黑模式切换、语言设置和自定义配置选项，可用于创建具有 AI 辅助编辑功能的富文本编辑器。

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

## 基本使用

<demo vue="./ai-editor.vue" title="UseAiEditor" />

## API

### 函数签名

```ts
function useAiEditor(
  templateRef: TemplateRef<HTMLElement>,
  options?: UseAiEditorOptions
): UseAiEditorReturns
```

### 参数说明

#### templateRef

- **类型**: `TemplateRef<HTMLElement>`
- **说明**: 编辑器容器的模板引用

#### options

- **类型**: `UseAiEditorOptions`
- **说明**: 编辑器配置选项

### Options 配置

| 选项              | 类型                               | 默认值      | 说明                  |
| ----------------- | ---------------------------------- | ----------- | --------------------- |
| `value`           | `MaybeRefOrGetter<string>`         | `undefined` | 编辑器内容            |
| `darkMode`        | `MaybeRefOrGetter<boolean>`        | `false`     | 是否开启暗黑模式      |
| `language`        | `MaybeRefOrGetter<'zh' \| 'en'>`   | `'zh'`      | 编辑器语言            |
| `readonly`        | `MaybeRefOrGetter<boolean>`        | `false`     | 是否只读              |
| `aiEditorOptions` | `Omit<AiEditorOptions, 'element'>` | `{}`        | AiEditor 原生配置选项 |

### 返回值

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
  /**
   * 编辑器内容
   */
  value?: MaybeRefOrGetter<string>
  /**
   * 是否开启暗黑模式
   */
  darkMode?: MaybeRefOrGetter<boolean>
  /**
   * 编辑器语言
   */
  language?: MaybeRefOrGetter<'zh' | 'en'>
  /**
   * 是否只读
   */
  readonly?: MaybeRefOrGetter<boolean>
  /**
   * AI 编辑器选项
   */
  aiEditorOptions?: Omit<AiEditorOptions, 'element'>
}

export type UseAiEditorReturns = ReturnType<typeof useAiEditor>
```

## 使用示例

### 基础用法

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

### 响应式配置

```vue
<script setup>
import { useAiEditor } from '@oiij/ai-editor'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)
const language = ref<'zh' | 'en'>('zh')
const valueRef = ref('<p>初始内容</p>')

const { value, setDarkMode, setLanguage } = useAiEditor(
  useTemplateRef('editor'),
  {
    value: valueRef,
    darkMode,
    language,
  }
)
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

### 监听内容变化

```vue
<script setup>
import { useAiEditor } from '@oiij/ai-editor'
import { useTemplateRef } from 'vue'

const { value, onUpdateValue } = useAiEditor(useTemplateRef('editor'), {
  value: '<p>Hello World</p>',
})

onUpdateValue((newValue) => {
  console.log('内容更新:', newValue)
})
</script>

<template>
  <div ref="editor" />
</template>
```

### 只读模式

```vue
<script setup>
import { useAiEditor } from '@oiij/ai-editor'
import { ref, useTemplateRef } from 'vue'

const readonly = ref(true)

const { value, setReadonly } = useAiEditor(useTemplateRef('editor'), {
  value: '<p>只读内容</p>',
  readonly,
})
</script>

<template>
  <div>
    <button @click="setReadonly(!readonly)">
      {{ readonly ? '编辑' : '只读' }}
    </button>
    <div ref="editor" />
  </div>
</template>
```
