# UseNaiveTheme 主题管理

## 功能描述

**UseNaiveTheme** 是一个功能强大的 Naive UI 主题管理工具，提供了完整的主题控制能力，包括暗黑模式切换、多语言支持、颜色定制、主题覆盖等特性。它基于 Naive UI 实现，为 Vue 应用提供了统一的主题管理体验。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/naive-ui

# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui
```

## 依赖

- `vue`: ^3.0.0
- `naive-ui`: ^2.0.0

## 基本使用

<demo vue="./use-naive-theme.vue" title="UseNaiveTheme" />

## API

### `useNaiveTheme(options?)`

使用 Naive UI 主题管理。

#### 参数

| 参数      | 类型                   | 说明     |
| --------- | ---------------------- | -------- |
| `options` | `NaiveThemeOptions<T>` | 配置选项 |

#### NaiveThemeOptions

| 选项                   | 类型                      | 说明       |
| ---------------------- | ------------------------- | ---------- |
| `language`             | `T \| Ref<T>`             | 语言设置   |
| `darkMode`             | `boolean \| Ref<boolean>` | 暗黑模式   |
| `colors`               | `Colors`                  | 颜色配置   |
| `globalThemeOverrides` | `GlobalThemeOverrides`    | 主题覆盖   |
| `locales`              | `Locales<T>`              | 多语言配置 |

#### 返回值

| 属性               | 类型                                | 说明         |
| ------------------ | ----------------------------------- | ------------ |
| `language`         | `Ref<T>`                            | 当前语言     |
| `darkMode`         | `Ref<boolean>`                      | 暗黑模式状态 |
| `theme`            | `ComputedRef<BuiltInGlobalTheme>`   | 当前主题     |
| `colors`           | `Ref<Colors>`                       | 颜色配置     |
| `themeColors`      | `ComputedRef<Colors>`               | 主题颜色     |
| `themeOverrides`   | `ComputedRef<GlobalThemeOverrides>` | 主题覆盖     |
| `locales`          | `Locales<T>`                        | 多语言配置   |
| `locale`           | `ComputedRef<Locales[T]>`           | 当前语言配置 |
| `setColor(colors)` | `Function`                          | 设置颜色     |

## 类型定义

```ts
export type Locales<T extends string = string> = Record<T, {
  name: string
  dateLocale: NDateLocale
  locale: typeof zhCN
}>

export type NaiveThemeOptions<T extends string> = {
  /**
   * 语言设置
   */
  language?: T | Ref<T>
  /**
   * 暗黑模式
   */
  darkMode?: boolean | Ref<boolean>
  /**
   * 颜色配置
   */
  colors?: Colors
  /**
   * 主题覆盖
   */
  globalThemeOverrides?: GlobalThemeOverrides
  /**
   * 多语言配置
   */
  locales?: Partial<Locales<T>>
}

export type NaiveThemeReturns = {
  language: Ref<string>
  darkMode: Ref<boolean | undefined>
  theme: ComputedRef<BuiltInGlobalTheme | undefined>
  colors: Ref<Colors>
  themeColors: ComputedRef<Colors>
  themeOverrides: ComputedRef<GlobalThemeOverrides>
  locales: Locales
  locale: ComputedRef<Locales[string]>
  setColor: (colors: Partial<Colors>) => void
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useNaiveTheme } from '@oiij/naive-ui'

const { theme, darkMode, themeOverrides } = useNaiveTheme()
</script>

<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-button @click="darkMode = !darkMode">
      切换主题
    </n-button>
  </n-config-provider>
</template>
```

### 多语言支持

```vue
<script setup>
import { useNaiveTheme } from '@oiij/naive-ui'

const { language, locale, theme } = useNaiveTheme({
  language: 'zh-CN',
  locales: {
    'zh-CN': {
      name: '中文',
      locale: zhCN,
      dateLocale: dateZhCN
    },
    'en-US': {
      name: 'English',
      locale: enUS,
      dateLocale: dateEnUS
    }
  }
})
</script>

<template>
  <n-config-provider
    :theme="theme"
    :locale="locale.locale"
    :date-locale="locale.dateLocale"
  >
    <button @click="language = language === 'zh-CN' ? 'en-US' : 'zh-CN'">
      切换语言
    </button>
  </n-config-provider>
</template>
```

### 自定义颜色

```vue
<script setup>
import { useNaiveTheme } from '@oiij/naive-ui'

const { theme, setColor } = useNaiveTheme()

function changePrimaryColor(color) {
  setColor({ primary: color })
}
</script>

<template>
  <n-config-provider :theme="theme">
    <input type="color" @input="(e) => changePrimaryColor(e.target.value)">
  </n-config-provider>
</template>
```
