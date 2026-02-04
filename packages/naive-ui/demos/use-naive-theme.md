# UseNaiveTheme

## 功能描述

**UseNaiveTheme** 是一个功能强大的 Naive UI 主题管理工具，提供了完整的主题控制能力，包括暗黑模式切换、多语言支持、颜色定制、主题覆盖等特性。它基于 Naive UI 实现，为 Vue 应用提供了统一的主题管理体验。

## 安装

```bash
# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui

# 使用 pnpm
pnpm add @oiij/naive-ui
```

## 基本使用

<demo vue="./use-naive-theme.vue" title="UseNaiveTheme" />

## API

### 函数签名

```ts
declare function useNaiveTheme<T extends string>(options?: NaiveThemeOptions<T>): NaiveThemeReturns
```

## 类型定义

```ts
export type Locales<T extends string = string> = Record<T, {
  name: string
  dateLocale: NDateLocale
  locale: typeof zhCN
}>

export type NaiveThemeOptions<T extends string> = {
  language?: T | Ref<T>
  darkMode?: boolean | Ref<boolean>
  colors?: Colors
  globalThemeOverrides?: GlobalThemeOverrides
  locales?: Partial<Locales<T>>
}

export type NaiveThemeReturns = {
  language: Ref<T, T>
  darkMode: Ref<boolean | undefined, boolean | undefined>
  theme: ComputedRef<naive_ui_es_themes_interface21.BuiltInGlobalTheme | undefined>
  colors: Ref<{
    primary?: string | undefined
    info?: string | undefined
    success?: string | undefined
    warning?: string | undefined
    error?: string | undefined
  }, Colors | {
    primary?: string | undefined
    info?: string | undefined
    success?: string | undefined
    warning?: string | undefined
    error?: string | undefined
  }>
  themeColors: ComputedRef<{
    primary?: string | undefined
    info?: string | undefined
    success?: string | undefined
    warning?: string | undefined
    error?: string | undefined
  } | {
    [k: string]: string | undefined
  }>
  themeOverrides: ComputedRef<GlobalThemeOverrides>
  locales: Locales<T>
  locale: ComputedRef<Locales<T>[T]>
  setColor: (v: Partial<Colors>) => void
}
```
