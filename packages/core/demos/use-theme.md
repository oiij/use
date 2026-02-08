# UseTheme

## 功能描述

**UseTheme** 是一个用于主题管理的 Vue 组合式函数，提供完整的暗色/亮色模式切换功能，支持系统主题跟随、localStorage 持久化存储和平滑过渡动画等特性。

## 安装

```bash
# 使用 npm
npm install @use/core

# 使用 yarn
yarn add @use/core

# 使用 pnpm
pnpm add @use/core
```

## 基本使用

<demo vue="./use-theme.vue" title="UseTheme" />

## API

### 函数签名

```ts
declare function useTheme(options?: UseThemeOptions): UseThemeReturns
```

## 类型定义

```ts
/**
 * 主题配置选项
 */
type UseThemeOptions = {
  /** 存储在 localStorage 中的键名，默认为 '__COLOR_MODE__' */
  storageKey?: string
  /** 视图过渡动画配置选项 */
  viewTransitionOptions?: ViewTransitionOptions
}

/**
 * 主题管理返回值
 */
type UseThemeReturns = {
  /** 当前是否为暗色模式（只读） */
  isDark: Readonly<Ref<boolean>>
  /** 系统偏好是否为暗色模式（只读） */
  preferredDark: Readonly<Ref<boolean>>
  /** 当前颜色模式（只读） */
  colorMode: Readonly<Ref<'dark' | 'light' | 'auto'>>
  /** 系统颜色模式（只读） */
  systemColorMode: Readonly<Ref<'dark' | 'light'>>
  /** 设置暗色模式 */
  setDarkMode: (darkMode: boolean, event?: MouseEvent) => void
  /** 切换到暗色模式 */
  setDark: (event?: MouseEvent) => void
  /** 切换到亮色模式 */
  setLight: (event?: MouseEvent) => void
  /** 切换暗色/亮色模式 */
  toggleDark: (event?: MouseEvent) => void
}
```

## 使用示例

### 基本用法

```ts
import { useTheme } from '@use/core'

const { isDark, toggleDark, setDark, setLight } = useTheme()

// 切换主题
function handleThemeToggle(event: MouseEvent) {
  toggleDark(event)
}

// 强制设置为暗色模式
setDark()

// 强制设置为亮色模式
setLight()
```

### 自定义配置

```ts
import { useTheme } from '@use/core'

const { isDark, toggleDark } = useTheme({
  storageKey: 'my-app-theme',
  viewTransitionOptions: {
    duration: 800,
    easing: 'ease-out'
  }
})
```

### 在模板中使用

```vue
<script setup lang="ts">
import { useTheme } from '@use/core'

const { isDark, toggleDark, setDark, setLight } = useTheme()
</script>

<template>
  <button @click="toggleDark">
    切换主题
  </button>

  <button @click="(e) => setDark(e)">
    切换到暗色模式
  </button>

  <button @click="(e) => setLight(e)">
    切换到亮色模式
  </button>

  <div :class="{ dark: isDark }">
    内容区域
  </div>
</template>
```
