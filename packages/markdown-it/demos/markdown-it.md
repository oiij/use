# UseMarkdownIt

## 功能描述

**UseMarkdownIt** 是一个用于 Markdown 渲染的 Vue 组合式函数，支持自定义配置、DOM 净化和手动渲染模式，可用于在应用中展示 Markdown 内容。

## 安装

```bash
# 使用 npm
npm install @oiij/markdown-it

# 使用 yarn
yarn add @oiij/markdown-it

# 使用 pnpm
pnpm add @oiij/markdown-it
```

## 基本使用

<demo vue="./markdown-it.vue" title="UseMarkdownIt" />

## API

### 函数签名

```ts
declare function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, options?: MarkDownItOptions): UseMarkdownItReturns
```

## 类型定义

```ts
type MarkDownItOptions = Options & {
  manual?: boolean
  domPurify?: boolean
}
export type UseMarkdownItReturns = {
  value: Ref<string | undefined>
  html: Ref<string>
  templateRef: Readonly<ShallowRef<HTMLElement | null>> | undefined
  md: markdownIt
  render: (value: string) => string
}
declare function useMarkdownIt(templateRef?: TemplateRef<HTMLElement>, defaultValue?: Ref<string> | string, options?: MarkDownItOptions): UseMarkdownItReturns
```
