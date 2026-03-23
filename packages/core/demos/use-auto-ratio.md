# UseAutoRatio

## 功能描述

**UseAutoRatio** 是一个用于自动计算元素宽高比的 Vue 组合式函数，它可以根据目标容器（或窗口）的尺寸，自动调整元素的宽度和高度，以保持指定的宽高比。这对于需要固定比例的元素（如视频播放器、图片展示等）非常有用。

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

<demo vue="./use-auto-ratio.vue" title="UseAutoRatio" />

## API

### `useAutoRatio(templateRef?, ratio?, target?)`

自动计算元素宽高比。

#### 参数

| 参数          | 类型                            | 默认值   | 说明                   |
| ------------- | ------------------------------- | -------- | ---------------------- |
| `templateRef` | `TemplateRef<HTMLElement>`      | -        | 需要保持比例的元素引用 |
| `ratio`       | `number`                        | `16 / 9` | 宽高比                 |
| `target`      | `MaybeRefOrGetter<HTMLElement>` | -        | 目标容器，默认为窗口   |

#### 返回值

| 属性          | 类型                       | 说明         |
| ------------- | -------------------------- | ------------ |
| `templateRef` | `TemplateRef<HTMLElement>` | 元素引用     |
| `width`       | `ComputedRef<number>`      | 计算后的宽度 |
| `height`      | `ComputedRef<number>`      | 计算后的高度 |

## 类型定义

```ts
export type UseAutoRatioReturns = {
  /**
   * 元素引用
   */
  templateRef: TemplateRef<HTMLElement> | undefined
  /**
   * 计算后的宽度
   */
  width: ComputedRef<number>
  /**
   * 计算后的高度
   */
  height: ComputedRef<number>
}

export declare function useAutoRatio(
  templateRef?: TemplateRef<HTMLElement>,
  ratio?: number,
  target?: MaybeRefOrGetter<HTMLElement>
): UseAutoRatioReturns
```

## 使用示例

### 基础用法（16:9 比例）

```vue
<script setup>
import { useAutoRatio } from '@oiij/use'
import { ref } from 'vue'

const containerRef = ref()
const { width, height } = useAutoRatio(containerRef, 16 / 9)
</script>

<template>
  <div
    ref="containerRef"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    视频播放器
  </div>
</template>
```

### 4:3 比例

```vue
<script setup>
import { useAutoRatio } from '@oiij/use'
import { ref } from 'vue'

const containerRef = ref()
const { width, height } = useAutoRatio(containerRef, 4 / 3)
</script>

<template>
  <div
    ref="containerRef"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    图片展示
  </div>
</template>
```

### 自定义目标容器

```vue
<script setup>
import { useAutoRatio } from '@oiij/use'
import { ref } from 'vue'

const containerRef = ref()
const parentRef = ref()
const { width, height } = useAutoRatio(containerRef, 16 / 9, parentRef)
</script>

<template>
  <div ref="parentRef" style="width: 100%; height: 500px;">
    <div
      ref="containerRef"
      :style="{ width: `${width}px`, height: `${height}px` }"
    >
      在父容器中保持比例
    </div>
  </div>
</template>
```
