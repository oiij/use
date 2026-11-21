# UseTheme

## 功能描述

**UseTheme** 是一个用于主题管理的 Vue 组合式函数，提供完整的暗色/亮色模式切换功能，支持系统主题跟随和 localStorage 持久化存储等特性。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/use

# 使用 npm
npm install @oiij/use

# 使用 yarn
yarn add @oiij/use
```

## 依赖

- `vue`: ^3.0.0
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./use-theme.vue" title="UseTheme" />

## API

### `useTheme(options?)`

主题管理，支持暗黑/亮色模式切换和系统主题跟随。

#### 参数

| 参数      | 类型              | 说明     |
| --------- | ----------------- | -------- |
| `options` | `UseThemeOptions` | 配置选项 |

#### UseThemeOptions

| 选项                      | 类型                  | 默认值                     | 说明                         |
| ------------------------- | --------------------- | -------------------------- | ---------------------------- |
| `storageKey`              | `string`              | `'__COLOR_MODE_PERSIST__'` | 存储在 localStorage 中的键名 |
| `useDarkOptions`          | `UseDarkOptions`      | -                          | 暗色模式选项                 |
| `usePreferredDarkOptions` | `ConfigurableWindow`  | -                          | 系统主题跟随选项             |
| `useColorModeOptions`     | `UseColorModeOptions` | -                          | 颜色模式选项                 |

#### 返回值

| 属性                 | 类型           | 说明                   |
| -------------------- | -------------- | ---------------------- |
| `isDark`             | `Ref<boolean>` | 当前是否为暗色模式     |
| `preferredDark`      | `Ref<boolean>` | 系统偏好是否为暗色模式 |
| `colorMode`          | `Ref<string>`  | 当前颜色模式           |
| `systemColorMode`    | `Ref<string>`  | 系统颜色模式           |
| `setColorMode(mode)` | `Function`     | 设置颜色模式           |
| `setDark()`          | `Function`     | 切换到暗色模式         |
| `setLight()`         | `Function`     | 切换到亮色模式         |
| `toggleDark()`       | `Function`     | 切换暗色/亮色模式      |

## 类型定义

```ts
export type UseThemeOptions = {
  /**
   * 存储在 localStorage 中的键名
   * @default '__COLOR_MODE_PERSIST__'
   */
  storageKey?: string
  /**
   * 暗色模式选项
   */
  useDarkOptions?: UseDarkOptions
  /**
   * 系统主题跟随选项
   */
  usePreferredDarkOptions?: ConfigurableWindow
  /**
   * 颜色模式选项
   */
  useColorModeOptions?: UseColorModeOptions
}

export type UseThemeReturns = {
  isDark: Ref<boolean>
  preferredDark: Ref<boolean>
  colorMode: Ref<string>
  systemColorMode: Ref<string>
  setColorMode: (mode: 'dark' | 'light' | 'auto') => void
  setDark: () => void
  setLight: () => void
  toggleDark: () => void
}

export declare function useTheme(options?: UseThemeOptions): UseThemeReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useTheme } from '@oiij/use'

const { isDark, toggleDark, setDark, setLight } = useTheme()
</script>

<template>
  <button @click="toggleDark">
    切换主题
  </button>
  <p>当前模式: {{ isDark ? '暗色' : '亮色' }}</p>
</template>
```

### 自定义配置

```ts
import { useTheme } from '@oiij/use'

const { isDark, toggleDark } = useTheme({
  storageKey: 'my-app-theme',
  useDarkOptions: {
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  },
})
```

### 手动设置颜色模式

```vue
<script setup>
import { useTheme } from '@oiij/use'

const { setColorMode } = useTheme()
</script>

<template>
  <button @click="setColorMode('auto')">
    跟随系统
  </button>
</template>
```

### 在模板中使用

```vue
<script setup lang="ts">
import { useTheme } from '@oiij/use'

const { isDark, toggleDark, setDark, setLight } = useTheme()
</script>

<template>
  <button @click="toggleDark">
    切换主题
  </button>
  <button @click="setDark">
    切换到暗色模式
  </button>
  <button @click="setLight">
    切换到亮色模式
  </button>
  <div :class="{ dark: isDark }">
    内容区域
  </div>
</template>
```
