# @oiij/viselect

[![NPM version](https://img.shields.io/npm/v/@oiij/viselect)](https://www.npmjs.com/package/@oiij/viselect)
[![MIT-license](https://img.shields.io/npm/l/@oiij/viselect)](https://github.com/oiij/use/blob/main/packages/viselect/LICENSE)

## 简介

**Viselect** 是基于 [`@viselect/vanilla`](https://github.com/simonwep/viselect) 的 Vue 3 组合式函数封装，提供在浏览器中通过鼠标 / 触摸拖拽进行区域选择的能力。开发者只需传入一个模板引用作为框选边界，即可获得完整的选区事件订阅能力、响应式选中集合，以及底层实例访问入口。

## 特点

### 🖱️ 框选交互

- 📦 基于 `@viselect/vanilla`，零额外运行时依赖
- 🎯 支持鼠标、触摸拖拽框选
- ⚙️ 支持单选 / 多选 / 范围选 / 跨容器选

### 🎨 默认样式与定制

- 💉 自动注入默认选区样式，开箱即用
- 🎨 可通过 `selectionAreaClass` 自定义选区外观

### 🔌 Vue 3 友好

- 🪝 提供完整的组合式事件钩子：`onInit`、`onBeforeStart`、`onBeforeDrag`、`onStart`、`onMove`、`onStop`
- 🔄 自动管理生命周期，组件卸载时销毁实例
- 📝 通过 `instanceRef` 暴露底层 `SelectionArea` 实例
- 🟢 维护响应式 `selected` 集合，基于元素的 `data-key` 属性自动同步选中项

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示

## 约定

- 元素需设置 `data-key` 属性才能被纳入响应式 `selected`
- 框选开始时，若未按住 `Ctrl`（Windows）/ `Meta`（macOS），将自动清空已有选中
- 按住 `Ctrl` / `Meta` 可在已有选中的基础上累加框选

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/viselect

# 使用 npm
npm install @oiij/viselect

# 使用 yarn
yarn add @oiij/viselect
```

## 依赖

- `@viselect/vanilla`: ^3.10.1
- `@vueuse/core`: ^14.4.0
- `vue`: ^3.5.42

## 示例

### 基础使用

```ts
import { useViselect } from '@oiij/viselect'
import { ref, watch } from 'vue'

const containerRef = ref<HTMLDivElement>()

const { selected, onInit, onStop } = useViselect(containerRef, {
  selectables: '.selectable',
})

onInit((instance) => {
  console.log('viselect 已初始化', instance)
})

// 监听响应式选中集合（元素需设置 data-key）
watch(selected, (keys) => {
  console.log('当前选中：', keys)
})

onStop(() => {
  console.log('框选结束')
})
```

### 在模板中使用

元素必须设置 `data-key` 属性，`selected` 才能正确返回对应的 key 数组：

```vue
<script setup lang="ts">
import { useViselect } from '@oiij/viselect'
import { ref } from 'vue'

const containerRef = ref<HTMLDivElement>()

const { selected, onStop, instanceRef } = useViselect(containerRef, {
  selectables: '.item',
  behaviour: {
    overlap: 'keep',
    intersect: 'touch',
  },
})

onStop(() => {
  console.log('选中数量：', selected.value.length)
})

function clearSelection() {
  instanceRef.value?.clearSelection()
}
</script>

<template>
  <div ref="containerRef" class="container">
    <div
      v-for="i in 20"
      :key="i"
      class="item"
      :data-key="`item-${i}`"
    >
      {{ i }}
    </div>
  </div>
  <div>当前选中：{{ selected.join(', ') }}</div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  user-select: none;
  padding: 12px;
  border: 1px dashed #ccc;
}

.item {
  padding: 16px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
```

### 累加框选（按住 Ctrl / Meta）

```ts
import { useViselect } from '@oiij/viselect'
import { ref } from 'vue'

const containerRef = ref<HTMLDivElement>()

const { selected } = useViselect(containerRef, {
  selectables: '.item',
})

// 内部约定：未按 Ctrl/Meta 时自动清空已有选中
// 按住 Ctrl（Windows）或 Cmd（macOS）时，新框选会累加到已有集合
```

### 在 `onBeforeStart` 中阻止框选

```ts
import { useViselect } from '@oiij/viselect'
import { ref } from 'vue'

const containerRef = ref<HTMLDivElement>()

const { onBeforeStart } = useViselect(containerRef, {
  selectables: '.item',
})

onBeforeStart(({ event }) => {
  // 仅在按住 Alt 键时才允许框选
  if (!(event as MouseEvent).altKey) {
    return false
  }
})
```

### 通过 `instanceRef` 操作实例

```ts
import { useViselect } from '@oiij/viselect'
import { ref } from 'vue'

const containerRef = ref<HTMLDivElement>()

const { instanceRef } = useViselect(containerRef, {
  selectables: '.item',
})

// 主动选中所有元素
function selectAll() {
  instanceRef.value?.select('.item')
}

// 清空选中
function clearSelection() {
  instanceRef.value?.clearSelection()
}

// 获取当前选中元素
function getSelected() {
  return instanceRef.value?.getSelection() ?? []
}
```

## API

### `useViselect(domRef, options?)`

创建并管理一个 `SelectionArea` 实例，同时维护一个基于 `data-key` 的响应式选中集合。

#### 参数

| 参数      | 类型                                          | 说明                                  |
| --------- | --------------------------------------------- | ------------------------------------- |
| `domRef`  | `TemplateRef<HTMLDivElement>`                 | 作为框选边界容器的模板引用            |
| `options` | `Omit<PartialSelectionOptions, 'boundaries'>` | 透传给 `SelectionArea` 的配置（可选） |

#### 返回值

| 属性            | 类型                                     | 说明                                        |
| --------------- | ---------------------------------------- | ------------------------------------------- |
| `instanceRef`   | `ShallowRef<SelectionArea \| undefined>` | 底层 `SelectionArea` 实例的浅层引用         |
| `selected`      | `ComputedRef<string[]>`                  | 当前选中元素的 `data-key` 数组，响应式更新  |
| `onInit`        | `EventHookOn<[SelectionArea]>`           | 实例创建完成时触发                          |
| `onBeforeStart` | `EventHookOn<[SelectionEvent]>`          | 框选开始前触发，返回 `false` 可阻止本次框选 |
| `onBeforeDrag`  | `EventHookOn<[SelectionEvent]>`          | 拖拽开始前触发，返回 `false` 可阻止拖拽     |
| `onStart`       | `EventHookOn<[SelectionEvent]>`          | 框选开始时触发                              |
| `onMove`        | `EventHookOn<[SelectionEvent]>`          | 框选移动过程中触发                          |
| `onStop`        | `EventHookOn<[SelectionEvent]>`          | 框选结束时触发                              |

## SelectionEvent

`useViselect` 触发的事件参数结构继承自 `@viselect/vanilla`：

```ts
export type SelectionEvent = {
  event: MouseEvent | TouchEvent | null
  store: SelectionStore
  selection: SelectionArea
}

export type SelectionStore = {
  touched: Element[] // 当前触摸过的元素
  stored: Element[] // 已保存的元素
  selected: Element[] // 当前选中元素
  changed: ChangedElements
}

export type ChangedElements = {
  added: Element[] // 新增的元素
  removed: Element[] // 移除的元素
}
```

## 类型定义

```ts
import type { PartialSelectionOptions, SelectionEvent } from '@viselect/vanilla'
import type { TemplateRef } from 'vue'

export declare function useViselect(
  domRef: TemplateRef<HTMLDivElement>,
  options?: Omit<PartialSelectionOptions, 'boundaries'>,
): {
  instanceRef: import('vue').ShallowRef<SelectionArea | undefined>
  selected: import('vue').ComputedRef<string[]>
  onInit: import('@vueuse/core').EventHookOn<[SelectionArea]>
  onBeforeStart: import('@vueuse/core').EventHookOn<[SelectionEvent]>
  onBeforeDrag: import('@vueuse/core').EventHookOn<[SelectionEvent]>
  onStart: import('@vueuse/core').EventHookOn<[SelectionEvent]>
  onMove: import('@vueuse/core').EventHookOn<[SelectionEvent]>
  onStop: import('@vueuse/core').EventHookOn<[SelectionEvent]>
}
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/viselect/viselect)
