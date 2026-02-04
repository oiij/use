# UseAutoRatio

## 功能描述

**UseAutoRatio** 是一个用于自动计算元素宽高比的 Vue 组合式函数，它可以根据目标容器（或窗口）的尺寸，自动调整元素的宽度和高度，以保持指定的宽高比。这对于需要固定比例的元素（如视频播放器、图片展示等）非常有用。

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

<demo vue="./use-auto-ratio.vue" title="UseAutoRatio" />

## API

### 函数签名

```ts
declare function useAutoRatio(
  templateRef?: TemplateRef<HTMLElement>,
  ratio?: number,
  target?: MaybeComputedElementRef
): UseAutoRatioReturns
```

## 类型定义

```ts
export type UseAutoRatioReturns = {
  templateRef: TemplateRef<HTMLElement> | undefined
  width: ComputedRef<number>
  height: ComputedRef<number>
}

export function useAutoRatio(
  templateRef?: TemplateRef<HTMLElement>,
  ratio?: number,
  target?: MaybeComputedElementRef
): UseAutoRatioReturns
```
