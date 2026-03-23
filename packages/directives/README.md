# @oiij/directives

[![NPM version](https://img.shields.io/npm/v/@oiij/directives)](https://www.npmjs.com/package/@oiij/directives)
[![MIT-license](https://img.shields.io/npm/l/@oiij/directives)](https://github.com/oiij/use/blob/main/packages/directives/LICENSE)

## 简介

Use Directives 是一个丰富的 Vue 3 自定义指令集合，提供了一系列实用的指令，帮助开发者简化常见的 DOM 操作。

## 指令列表

| 指令                 | 说明                   |
| -------------------- | ---------------------- |
| `v-click-outside`    | 点击元素外部时触发回调 |
| `v-copy`             | 点击复制内容到剪贴板   |
| `v-debounce`         | 点击防抖               |
| `v-throttle`         | 点击节流               |
| `v-lazy-load`        | 图片懒加载             |
| `v-long-press`       | 长按触发               |
| `v-into-view`        | 元素进入视口时触发     |
| `v-watermark`        | 添加水印               |
| `v-array-buffer-src` | 数组缓冲区图片源       |

## 特点

### 📚 丰富指令集

- 🎯 涵盖常用的 DOM 操作场景
- 🔧 简化重复代码，提高开发效率
- ⚡ 优化的性能表现，最小化运行时开销

### 🧩 模块化设计

- 🏗️ 采用模块化架构，每个指令独立封装
- 📦 支持按需导入，减小打包体积
- 📁 清晰的文件结构，易于维护和扩展

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/directives

# 使用 npm
npm install @oiij/directives

# 使用 yarn
yarn add @oiij/directives
```

## 依赖

- `vue`: ^3.0.0
- `@oiij/utils`: workspace:\*

## 示例

### 全局注册

```ts
import { setupDirective } from '@oiij/directives'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(setupDirective)
```

### 按需导入

```vue
<script setup>
import { clickOutside, copy, debounce } from '@oiij/directives'

defineOptions({
  directives: {
    clickOutside,
    copy,
    debounce,
  },
})
</script>
```

## API

### `setupDirective`

全局注册所有指令的插件对象。

### 指令详情

#### `v-click-outside`

点击元素外部时触发回调。

```vue
<script setup>
function handleClickOutside(event) {
  console.log('点击了外部区域', event)
}
</script>

<template>
  <div v-click-outside="handleClickOutside">
    点击外部触发回调
  </div>
</template>
```

#### `v-copy`

点击复制内容到剪贴板。

```vue
<script setup>
import { ref } from 'vue'

const copyText = ref('要复制的文本')
const onSuccess = value => console.log('复制成功', value)
const onError = err => console.log('复制失败', err)
</script>

<template>
  <!-- 基本用法 -->
  <button v-copy="copyText">
    复制文本
  </button>

  <!-- 带回调 -->
  <button v-copy="{ value: copyText, success: onSuccess, error: onError }">
    复制文本
  </button>
</template>
```

#### `v-debounce`

点击防抖。

```vue
<template>
  <!-- 基本用法，默认 500ms -->
  <button v-debounce="handleClick">
    点击按钮
  </button>

  <!-- 自定义延迟时间 -->
  <button v-debounce:1000="handleClick">
    点击按钮
  </button>

  <!-- 立即执行 -->
  <button v-debounce.immediate="handleClick">
    点击按钮
  </button>
</template>
```

#### `v-throttle`

点击节流。

```vue
<template>
  <!-- 基本用法，默认 500ms -->
  <button v-throttle="handleClick">
    点击按钮
  </button>

  <!-- 自定义延迟时间 -->
  <button v-throttle:1000="handleClick">
    点击按钮
  </button>

  <!-- 立即执行 -->
  <button v-throttle.immediate="handleClick">
    点击按钮
  </button>
</template>
```

#### `v-lazy-load`

图片懒加载。

```vue
<script setup>
import { ref } from 'vue'

const imageUrl = ref('https://example.com/image.jpg')
</script>

<template>
  <img v-lazy-load="imageUrl" alt="懒加载图片">
</template>
```

#### `v-long-press`

长按触发。

```vue
<template>
  <!-- 基本用法，默认 3000ms -->
  <button v-long-press="handleLongPress">
    长按按钮
  </button>

  <!-- 自定义长按时间 -->
  <button v-long-press:1000="handleLongPress">
    长按按钮
  </button>
</template>
```

#### `v-into-view`

元素进入视口时触发。

```vue
<template>
  <!-- 基本用法 -->
  <div v-into-view="handleIntoView">
    进入视口触发
  </div>

  <!-- 仅触发一次 -->
  <div v-into-view.once="handleIntoViewOnce">
    仅触发一次
  </div>
</template>
```

#### `v-watermark`

添加水印。

```vue
<template>
  <!-- 基本用法 -->
  <div v-watermark="'水印文本'">
    带水印的内容
  </div>

  <!-- 带选项 -->
  <div v-watermark="{ text: '水印', textColor: 'rgba(255, 0, 0, 0.2)', fontSize: 20 }">
    带自定义水印的内容
  </div>
</template>
```

#### `v-array-buffer-src`

数组缓冲区图片源。

```vue
<script setup>
import { ref } from 'vue'

const imageData = ref(new Uint8Array([]))
const imageType = ref('image/jpeg')
</script>

<template>
  <img v-array-buffer-src:[imageType]="imageData" alt="图片">
</template>
```

## 类型定义

```ts
import type { Directive } from 'vue'

export type WatermarkOptions = {
  text?: string
  textColor?: string
  font?: string
  fontSize?: number
  rotate?: number
}

export declare const clickOutside: Directive
export declare const copy: Directive
export declare const debounce: Directive
export declare const throttle: Directive
export declare const lazyLoad: Directive
export declare const longPress: Directive
export declare const intoView: Directive
export declare const watermark: Directive
export declare const arrayBufferSrc: Directive

export declare const directives: Record<string, Directive>
export declare const setupDirective: { install: (app: App) => void }
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/directives/directives)
