# UseTiptap

## 功能描述

**UseTiptap** 是一个基于 Tiptap 的富文本编辑器 Vue 组合式函数，提供了完整的编辑器功能，包括文本格式化、多媒体插入、协同编辑等特性，支持自定义扩展和主题。

## 安装

```bash
# 使用 npm
npm install @oiij/tiptap

# 使用 yarn
yarn add @oiij/tiptap

# 使用 pnpm
pnpm add @oiij/tiptap
```

## 基本使用

<demo vue="./tiptap.vue" />

## API

### 函数签名

```ts
declare function useTipTap(templateRef: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, options?: Partial<EditorOptions>): UseTipTapReturns
```

## 类型定义

```ts
type UseTipTapReturns = {
  value: Ref<string | undefined, string | undefined>
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  editor: vue0.ShallowRef<Editor | null, Editor | null>
  onRender: _vueuse_core0.EventHookOn<[Editor]>
}
```
