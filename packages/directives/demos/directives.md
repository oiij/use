# UseDirectives

## 功能描述

**UseDirectives** 是一个 Vue 指令集合，提供了一系列常用的自定义指令，可用于增强 Vue 应用的交互能力。

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

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/directives

# 使用 npm
npm install @oiij/directives

# 使用 yarn
yarn add @oiij/directives
```

## 基本使用

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

<demo vue="./directives.vue" title="UseDirectives" />

## API

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
import type { App, Directive } from 'vue'

export type WatermarkOptions = {
  /**
   * 水印文本
   */
  text?: string
  /**
   * 文本颜色
   * @default 'rgba(0, 0, 0, 0.3)'
   */
  textColor?: string
  /**
   * 字体
   * @default 'Microsoft JhengHei'
   */
  font?: string
  /**
   * 字体大小
   * @default 16
   */
  fontSize?: number
  /**
   * 旋转角度
   * @default -20
   */
  rotate?: number
}

export declare const clickOutside: Directive<HTMLElement, (ev: MouseEvent) => void>
export declare const copy: Directive<HTMLElement, { value: string, success?: (v: string) => void, error?: (v: string) => void } | string>
export declare const debounce: Directive<HTMLElement, (ev: MouseEvent | TouchEvent) => void, 'immediate'>
export declare const throttle: Directive<HTMLElement, (ev: MouseEvent | TouchEvent) => void, 'immediate'>
export declare const lazyLoad: Directive<HTMLImageElement, string>
export declare const longPress: Directive<HTMLElement, (ev: MouseEvent | TouchEvent) => void>
export declare const intoView: Directive<HTMLElement, (target: Element) => void, 'once'>
export declare const watermark: Directive<HTMLElement, string | WatermarkOptions>
export declare const arrayBufferSrc: Directive<HTMLImageElement, Uint8Array>

export declare const directives: Record<string, Directive>
export declare const setupDirective: { install: (app: App) => void }
```

## 使用示例

### 复制功能

```vue
<script setup>
import { copy } from '@oiij/directives'
import { ref } from 'vue'

const copyText = ref('要复制的文本')

function onSuccess(value) {
  console.log('复制成功', value)
}
</script>

<template>
  <button v-copy="{ value: copyText, success: onSuccess }">
    点击复制
  </button>
</template>
```

### 防抖节流

```vue
<script setup>
import { debounce, throttle } from '@oiij/directives'

function handleClick() {
  console.log('点击触发')
}
</script>

<template>
  <button v-debounce="handleClick">
    防抖按钮
  </button>
  <button v-throttle="handleClick">
    节流按钮
  </button>
</template>
```

### 图片懒加载

```vue
<script setup>
import { lazyLoad } from '@oiij/directives'
import { ref } from 'vue'

const images = ref([
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
])
</script>

<template>
  <div v-for="(src, index) in images" :key="index">
    <img v-lazy-load="src" :alt="`图片${index + 1}`">
  </div>
</template>
```

### 水印

```vue
<script setup>
import { watermark } from '@oiij/directives'
</script>

<template>
  <div v-watermark="{ text: '机密文件', textColor: 'rgba(255, 0, 0, 0.1)' }" style="height: 400px">
    敏感内容
  </div>
</template>
```
