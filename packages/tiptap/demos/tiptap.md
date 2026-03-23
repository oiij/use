# TiptapEditor

基于 TipTap 的富文本编辑器组件，支持 Shadcn 风格主题和暗黑模式。

## 功能

- 富文本编辑（加粗、斜体、删除线、代码）
- 标题（H1-H6）
- 列表（有序/无序）
- 代码块、块引用
- 图片上传插入
- 撤销/重做
- 暗黑模式支持

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/tiptap

# 使用 npm
npm install @oiij/tiptap

# 使用 yarn
yarn add @oiij/tiptap
```

## 基本使用

> 需要引入样式文件 `import '@oiij/tiptap/style'`

<demo vue="./tiptap.vue" title="TiptapEditor" />

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

工具栏组件，无需传参，自动通过 provide/inject 获取编辑器实例。

内置功能按钮：

- 文本格式：加粗、斜体、删除线、代码
- 段落格式：段落、H1-H6
- 列表：无序列表、有序列表
- 块元素：代码块、块引用、水平线
- 媒体：图片上传
- 其他：清除格式、清除节点、硬换行、撤销、重做

## Composable

### `useTipTap(templateRef, options?)`

```ts
import { useTipTap } from '@oiij/tiptap'

const { value, editorInst, setContent, insertImage, onRendered, onUpdateValue } = useTipTap(
  templateRef,
  {
    value: '<p>初始内容</p>',
    tiptapOptions: { /* TipTap 配置 */ }
  }
)
```

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

| 属性            | 类型                          | 说明               |
| --------------- | ----------------------------- | ------------------ |
| `value`         | `Ref<string>`                 | 编辑器内容         |
| `editorInst`    | `ShallowRef<Editor \| null>`  | 编辑器实例         |
| `setContent`    | `(value?: string) => void`    | 设置内容           |
| `insertImage`   | `(src, alt?, title?) => void` | 插入图片           |
| `onRendered`    | `EventHookOn`                 | 编辑器渲染完成事件 |
| `onUpdateValue` | `EventHookOn`                 | 内容更新事件       |

## 暗黑模式

添加 `.dark` class 到父元素即可启用暗黑模式：

```vue
<template>
  <div class="dark">
    <TiptapEditor v-model:value="content">
      <TiptapMenu />
    </TiptapEditor>
  </div>
</template>
```

## 使用 Composable

```vue
<script setup lang="ts">
import { useTipTap } from '@oiij/tiptap'
import { useTemplateRef } from 'vue'
import '@oiij/tiptap/style'

const editorRef = useTemplateRef('editor')
const { value, insertImage, setContent } = useTipTap(editorRef, {
  value: '<p>初始内容</p>',
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
