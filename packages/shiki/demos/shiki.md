# UseShiki

## 功能描述

**UseShiki** 是一个用于代码语法高亮的 Vue 组合式函数，基于 Shiki 实现，支持多种编程语言和主题，提供实时的代码高亮渲染功能。

## 安装

```bash
# 使用 npm
npm install @oiij/shiki

# 使用 yarn
yarn add @oiij/shiki

# 使用 pnpm
pnpm add @oiij/shiki
```

## 基本使用

<demo vue="./shiki.vue" />

## API

### 函数签名

```ts
declare function useShiki(templateRef: TemplateRef<HTMLElement>, defaultValue?: string | Ref<string>, darkMode?: ComputedRef<boolean>, options?: CodeToHastOptions<BundledLanguage, BundledTheme>): UseShikiReturns
```

## 类型定义

```ts
type UseShikiReturns = {
  value: Ref<string | undefined, string | undefined>
  html: Ref<string, string>
  templateRef: Readonly<vue0.ShallowRef<HTMLElement | null>>
  format: (value: string, options?: CodeToHastOptions<BundledLanguage, BundledTheme>) => {
    promise: () => Promise<string>
    cancel: () => void
  }
}
```
