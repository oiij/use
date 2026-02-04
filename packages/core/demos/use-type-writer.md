# UseTypeWriter

## 功能描述

**UseTypeWriter** 是一个用于实现打字机效果的 Vue 组合式函数，支持自定义打字速度、间隔时间和状态控制，可用于创建动态文本展示效果。

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

<demo vue="./use-type-writer.vue" title="UseTypeWriter" />

## API

### 函数签名

```ts
declare function useTypeWriter(value: Ref<string> | ComputedRef<string>, options?: TypeWriterOptions): UseTypeWriterReturns
```

## 类型定义

```ts
type TypeWriterOptions = {
  step?: number
  interval?: number
  enabled?: boolean
}

export type UseTypeWriterReturns = {
  typeIndex: Ref<number>
  paused: Ref<boolean>
  ended: Ref<boolean>
  isTyping: Ref<boolean>
  typedValue: ComputedRef<string>
  progress: ComputedRef<number>
  start: () => void
  pause: () => void
  resume: () => void
  restart: () => void
  stop: () => void
  destroy: () => void
  onStat: EventHookOn<void>
  onStop: EventHookOn<string>
  onUpdate: EventHookOn<{
    index: number
    value: string
  }>
}

export function useTypeWriter(value: Ref<string> | ComputedRef<string>, options?: TypeWriterOptions): UseTypeWriterReturns
```
