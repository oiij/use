# UseScrollView

## 功能描述

**UseScrollView** 是一个用于管理滚动视图的 Vue 组合式函数，支持平滑滚动到指定元素、滚动方向控制、鼠标滚轮支持以及滚动状态样式管理。适用于长列表导航、内容区域滚动控制、分步表单等场景。

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

<demo vue="./use-scroll-view.vue" title="UseScrollView" />

## API

### `useScrollView(templateRef, options?)`

滚动视图控制。

#### 参数

| 参数          | 类型                                         | 说明                   |
| ------------- | -------------------------------------------- | ---------------------- |
| `templateRef` | `MaybeRefOrGetter<HTMLElement \| undefined>` | 目标滚动容器的模板引用 |
| `options`     | `ScrollViewOptions`                          | 配置选项               |

#### ScrollViewOptions

| 选项                    | 类型                         | 默认值       | 说明                         |
| ----------------------- | ---------------------------- | ------------ | ---------------------------- |
| `activeClassName`       | `string`                     | `'.active'`  | 激活元素的 CSS 选择器        |
| `enableWheel`           | `boolean`                    | `true`       | 是否启用滚轮滚动             |
| `direction`             | `'horizontal' \| 'vertical'` | `'vertical'` | 滚动方向                     |
| `scrollOffset`          | `number`                     | -            | 滚动偏移量                   |
| `debounceDelay`         | `number`                     | `500`        | 滚动防抖延迟时间（毫秒）     |
| `autoScrollOnResize`    | `boolean`                    | `true`       | 是否在容器尺寸变化时自动滚动 |
| `scrollIntoViewOptions` | `ScrollIntoViewOptions`      | -            | scrollIntoView 配置选项      |

#### 返回值

| 属性                                 | 类型       | 说明               |
| ------------------------------------ | ---------- | ------------------ |
| `scrollToView(options?)`             | `Function` | 滚动到激活元素     |
| `scrollToElement(element, options?)` | `Function` | 滚动到指定元素     |
| `scrollToNext()`                     | `Function` | 滚动到下一个元素   |
| `scrollToPrevious()`                 | `Function` | 滚动到上一个元素   |
| `getActiveElement()`                 | `Function` | 获取激活元素       |
| `getScrollableElements()`            | `Function` | 获取可滚动元素列表 |

## 类型定义

```ts
export type ScrollDirection = 'horizontal' | 'vertical'

export type ScrollViewOptions = {
  /**
   * 激活元素的 CSS 选择器
   * @default '.active'
   */
  activeClassName?: string
  /**
   * 是否启用滚轮滚动
   * @default true
   */
  enableWheel?: boolean
  /**
   * 滚动方向
   * @default 'vertical'
   */
  direction?: ScrollDirection
  /**
   * 滚动偏移量
   */
  scrollOffset?: number
  /**
   * 滚动防抖延迟时间（毫秒）
   * @default 500
   */
  debounceDelay?: number
  /**
   * 是否在容器尺寸变化时自动滚动到激活元素
   * @default true
   */
  autoScrollOnResize?: boolean
  /**
   * scrollIntoView 的默认配置选项
   */
  scrollIntoViewOptions?: ScrollIntoViewOptions
}

export type UseScrollViewReturns = {
  scrollToView: (customOptions?: ScrollIntoViewOptions) => Promise<void>
  scrollToElement: (element: Element, customOptions?: ScrollIntoViewOptions) => Promise<void>
  scrollToNext: () => Promise<void>
  scrollToPrevious: () => Promise<void>
  getActiveElement: () => Element | null
  getScrollableElements: () => Element[]
}

export declare function useScrollView(templateRef: MaybeRefOrGetter<HTMLElement | undefined>, options?: ScrollViewOptions): UseScrollViewReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useScrollView } from '@oiij/use'
import { ref } from 'vue'

const containerRef = ref()
const { scrollToView, scrollToNext, scrollToPrevious } = useScrollView(containerRef, {
  activeClassName: '.active',
  enableWheel: true,
  direction: 'vertical'
})
</script>

<template>
  <div ref="containerRef">
    <div class="item">
      Item 1
    </div>
    <div class="item active">
      Item 2
    </div>
    <div class="item">
      Item 3
    </div>
  </div>
  <button @click="scrollToPrevious">
    上一个
  </button>
  <button @click="scrollToNext">
    下一个
  </button>
</template>
```

### 水平滚动

```ts
import { useScrollView } from '@oiij/use'

const { scrollToNext, scrollToPrevious } = useScrollView(containerRef, {
  direction: 'horizontal',
  activeClassName: '.active'
})
```

### 自定义滚动偏移

```ts
import { useScrollView } from '@oiij/use'

const { scrollToNext } = useScrollView(containerRef, {
  scrollOffset: 200 // 每次滚动 200px
})
```
