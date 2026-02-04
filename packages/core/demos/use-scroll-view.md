# UseScrollView

## 功能描述

**UseScrollView** 是一个用于管理滚动视图的 Vue 组合式函数，支持平滑滚动到指定元素、滚动方向控制、鼠标滚轮支持以及滚动状态样式管理。适用于长列表导航、内容区域滚动控制、分步表单等场景。

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

<demo vue="./use-scroll-view.vue" title="UseScrollView" />

## API

### 函数签名

```ts
declare function useScrollView(options?: ScrollViewOptions): UseScrollViewReturns
```

## 类型定义

```ts
export type ScrollViewOptions = {
  activeClassName?: string
  enableWheel?: boolean
  direction?: 'horizontal' | 'vertical'
}

export type UseScrollViewReturns = {
  scrollRef: Ref<HTMLElement | undefined>
  scrollToView: (options?: ScrollIntoViewOptions) => Promise<void>
}

export function useScrollView(options?: ScrollViewOptions): UseScrollViewReturns
```
