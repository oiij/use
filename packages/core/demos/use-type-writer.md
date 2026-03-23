# UseTypeWriter

## 功能描述

**UseTypeWriter** 是一个用于实现打字机效果的 Vue 组合式函数，支持自定义打字速度、间隔时间和状态控制，可用于创建动态文本展示效果。

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

<demo vue="./use-type-writer.vue" title="UseTypeWriter" />

## API

### `useTypeWriter(value, options?)`

创建打字机效果。

#### 参数

| 参数      | 类型                       | 说明         |
| --------- | -------------------------- | ------------ |
| `value`   | `MaybeRefOrGetter<string>` | 要显示的文本 |
| `options` | `TypeWriterOptions`        | 配置选项     |

#### TypeWriterOptions

| 选项       | 类型      | 默认值  | 说明                 |
| ---------- | --------- | ------- | -------------------- |
| `step`     | `number`  | `1`     | 每次打字的字符步长   |
| `interval` | `number`  | `50`    | 打字间隔时间（毫秒） |
| `enabled`  | `boolean` | `true`  | 是否启用打字效果     |
| `manual`   | `boolean` | `false` | 是否手动控制         |

#### 返回值

| 属性                 | 类型                  | 说明         |
| -------------------- | --------------------- | ------------ |
| `value`              | `Ref<string>`         | 原始文本     |
| `typedValue`         | `ComputedRef<string>` | 已打字的文本 |
| `progress`           | `ComputedRef<number>` | 进度百分比   |
| `isTyping`           | `Ref<boolean>`        | 是否正在打字 |
| `paused`             | `Ref<boolean>`        | 是否已暂停   |
| `ended`              | `Ref<boolean>`        | 是否已结束   |
| `start()`            | `Function`            | 开始打字     |
| `pause()`            | `Function`            | 暂停打字     |
| `resume()`           | `Function`            | 恢复打字     |
| `restart()`          | `Function`            | 重新开始打字 |
| `stop()`             | `Function`            | 停止打字     |
| `destroy()`          | `Function`            | 销毁实例     |
| `onStart(callback)`  | `Function`            | 开始事件     |
| `onStop(callback)`   | `Function`            | 停止事件     |
| `onUpdate(callback)` | `Function`            | 更新事件     |

## 类型定义

```ts
export type TypeWriterOptions = {
  /**
   * 每次打字的字符步长
   * @default 1
   */
  step?: number
  /**
   * 打字间隔时间（毫秒）
   * @default 50
   */
  interval?: number
  /**
   * 是否启用打字效果，禁用时直接显示完整文本
   * @default true
   */
  enabled?: boolean
  /**
   * 是否手动控制，为 true 时不自动开始
   * @default false
   */
  manual?: boolean
}

export type UseTypeWriterReturns = {
  value: Ref<string>
  typedValue: ComputedRef<string>
  progress: ComputedRef<number>
  isTyping: Ref<boolean>
  paused: Ref<boolean>
  ended: Ref<boolean>
  start: () => void
  pause: () => void
  resume: () => void
  restart: () => void
  stop: () => void
  destroy: () => void
  onStat: (callback: () => void) => void
  onStop: (callback: (value: string) => void) => void
  onUpdate: (callback: (data: { index: number, value: string }) => void) => void
}

export declare function useTypeWriter(value: MaybeRefOrGetter<string>, options?: TypeWriterOptions): UseTypeWriterReturns
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useTypeWriter } from '@oiij/use'
import { ref } from 'vue'

const text = ref('Hello World!')
const { typedValue, isTyping, progress } = useTypeWriter(text)
</script>

<template>
  <p>{{ typedValue }}</p>
  <p>进度: {{ progress }}%</p>
</template>
```

### 手动控制

```vue
<script setup>
import { useTypeWriter } from '@oiij/use'
import { ref } from 'vue'

const text = ref('Hello World!')
const { typedValue, start, pause, resume, restart, stop } = useTypeWriter(text, {
  manual: true
})
</script>

<template>
  <p>{{ typedValue }}</p>
  <button @click="start">
    开始
  </button>
  <button @click="pause">
    暂停
  </button>
  <button @click="resume">
    继续
  </button>
  <button @click="restart">
    重新开始
  </button>
  <button @click="stop">
    停止
  </button>
</template>
```

### 自定义配置

```ts
import { useTypeWriter } from '@oiij/use'

const { typedValue } = useTypeWriter('Hello World!', {
  step: 2, // 每次显示2个字符
  interval: 100, // 100ms间隔
  enabled: true
})
```

### 监听事件

```vue
<script setup>
import { useTypeWriter } from '@oiij/use'
import { ref } from 'vue'

const text = ref('Hello World!')
const { typedValue, onStart, onStop, onUpdate } = useTypeWriter(text)

onStart(() => {
  console.log('开始打字')
})

onStop((value) => {
  console.log('打字结束:', value)
})

onUpdate(({ index, value }) => {
  console.log('更新:', index, value)
})
</script>

<template>
  <p>{{ typedValue }}</p>
</template>
```
