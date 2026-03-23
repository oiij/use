# @oiij/chrome-tabs

[![NPM version](https://img.shields.io/npm/v/@oiij/chrome-tabs)](https://www.npmjs.com/package/@oiij/chrome-tabs)
[![MIT-license](https://img.shields.io/npm/l/@oiij/chrome-tabs)](https://github.com/oiij/use/blob/main/packages/chrome-tabs/LICENSE)

## 简介

Use Chrome-Tabs 是一个仿 Chrome 风格的标签页组件，为 Vue 3 应用提供流畅的标签页管理体验，帮助开发者构建具有类似浏览器标签页功能的应用。

## 特点

### 🎨 Chrome 风格设计

- 🖥️ 还原 Chrome 浏览器标签页外观
- 🖱️ 支持标签页拖拽排序
- ✨ 流畅的动画过渡效果

### 🧩 模块化设计

- 🏗️ 采用模块化架构，组件独立封装
- 📦 支持按需导入，减小打包体积
- 📁 清晰的文件结构，易于维护和扩展

### 🔒 类型安全

- 📝 完整的 TypeScript 类型定义
- 💡 提供准确的类型推断和代码提示
- ⚡ 支持 Vue 3 的 Composition API 类型系统

### 🚀 轻量高效

- 🪶 核心代码精简，无额外依赖
- ⚡ 优化的性能表现，最小化运行时开销
- 📉 支持 Tree Shaking，进一步减小打包体积

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/chrome-tabs

# 使用 npm
npm install @oiij/chrome-tabs

# 使用 yarn
yarn add @oiij/chrome-tabs
```

## 依赖

- `vue`: ^3.0.0
- `@oiij/css-render`: workspace:\*
- `@oiij/use`: workspace:\*
- `colord`: ^2.0.0

## 示例

### 基础使用

```vue
<script setup>
import { ChromeTabs } from '@oiij/chrome-tabs'
import { ref } from 'vue'

const value = ref('tab1')
const options = [
  { key: 'tab1', label: '标签1' },
  { key: 'tab2', label: '标签2' },
  { key: 'tab3', label: '标签3' },
]
</script>

<template>
  <ChromeTabs v-model:value="value" :options="options" />
</template>
```

### 可关闭标签页

```vue
<script setup>
import { ChromeTabs } from '@oiij/chrome-tabs'
import { reactive, ref } from 'vue'

const value = ref('tab1')
const options = reactive([
  { key: 'tab1', label: '标签1', closable: true },
  { key: 'tab2', label: '标签2', closable: true },
  { key: 'tab3', label: '标签3', closable: true },
])

function onClose(key) {
  const index = options.findIndex(f => f.key === key)
  options.splice(index, 1)
}
</script>

<template>
  <ChromeTabs v-model:value="value" :options="options" @close="onClose" />
</template>
```

### 可添加标签页

```vue
<script setup>
import { ChromeTabs } from '@oiij/chrome-tabs'
import { reactive, ref } from 'vue'

const value = ref('tab1')
const options = reactive([
  { key: 'tab1', label: '标签1', closable: true },
])

function handleAdd() {
  const key = `tab${options.length + 1}`
  options.push({ key, label: key, closable: true })
  value.value = key
}

function onClose(key) {
  const index = options.findIndex(f => f.key === key)
  options.splice(index, 1)
}
</script>

<template>
  <ChromeTabs
    v-model:value="value"
    :options="options"
    addable
    @add="handleAdd"
    @close="onClose"
  />
</template>
```

### 自定义颜色

```vue
<script setup>
import { ChromeTabs } from '@oiij/chrome-tabs'
import { ref } from 'vue'

const value = ref('tab1')
const options = [
  { key: 'tab1', label: '标签1' },
  { key: 'tab2', label: '标签2' },
]
const colors = {
  background: '#E8F5E9',
  active: '#C8E6C9',
  primary: '#4CAF50',
}
</script>

<template>
  <ChromeTabs v-model:value="value" :options="options" :colors="colors" />
</template>
```

## API

### `<ChromeTabs />`

Chrome 标签页组件。

#### Props

| 属性           | 类型                      | 默认值  | 说明               |
| -------------- | ------------------------- | ------- | ------------------ |
| `value`        | `TabItemKey`              | -       | 当前激活的标签页键 |
| `options`      | `TabsOption[]`            | `[]`    | 标签页选项配置     |
| `colors`       | `object`                  | -       | 颜色配置           |
| `dropdown`     | `boolean`                 | `false` | 是否显示下拉菜单   |
| `addable`      | `boolean`                 | `false` | 是否可添加标签页   |
| `loadingValue` | `TabItemKey`              | -       | 加载中的标签页键   |
| `iconSize`     | `number`                  | `20`    | 图标大小           |
| `contentClass` | `string`                  | -       | 内容区域类名       |
| `contentStyle` | `CSSProperties \| string` | -       | 内容区域样式       |

#### Events

| 事件           | 参数                               | 说明                 |
| -------------- | ---------------------------------- | -------------------- |
| `update:value` | `(value: TabItemKey)`              | 激活标签页变化时触发 |
| `click`        | `(key: TabItemKey, index: number)` | 点击标签页时触发     |
| `contextmenu`  | `(key: TabItemKey, index: number)` | 右键点击标签页时触发 |
| `close`        | `(key: TabItemKey, index: number)` | 关闭标签页时触发     |
| `add`          | -                                  | 点击添加按钮时触发   |

#### Slots

| 插槽     | 说明     |
| -------- | -------- |
| `prefix` | 前缀内容 |
| `suffix` | 后缀内容 |

### `<ChromeTabItem />`

Chrome 标签页项组件。

#### Props

| 属性          | 类型                  | 默认值  | 说明       |
| ------------- | --------------------- | ------- | ---------- |
| `itemKey`     | `TabItemKey`          | -       | 标签页键   |
| `itemIndex`   | `number`              | -       | 标签页索引 |
| `activeIndex` | `number`              | `0`     | 激活索引   |
| `label`       | `string \| function`  | -       | 标签页标题 |
| `icon`        | `function`            | -       | 标签页图标 |
| `closable`    | `boolean \| function` | `false` | 是否可关闭 |
| `disabled`    | `boolean \| function` | `false` | 是否禁用   |
| `loading`     | `boolean \| function` | `false` | 是否加载中 |
| `loadingIcon` | `function`            | -       | 加载图标   |
| `iconSize`    | `number`              | `20`    | 图标大小   |

## 类型定义

```ts
import type { CSSProperties, VNode } from 'vue'

type VNodeChild = VNode | string | number | undefined | void | null | boolean
type TabItemKey = string | number

export type TabsOption = {
  key: TabItemKey
  label: string | ((key: TabItemKey, index: number) => VNodeChild)
  icon?: (key: TabItemKey, index: number) => VNodeChild
  closable?: boolean | ((key: TabItemKey, index: number) => boolean)
  disabled?: boolean | ((key: TabItemKey, index: number) => boolean)
  loading?: boolean | ((key: TabItemKey, index: number) => boolean)
  loadingIcon?: (key: TabItemKey, index: number) => VNodeChild
  onClick?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onContextMenu?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  onClose?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  class?: string
  style?: CSSProperties | string
}

export type TabsProps = {
  value?: TabItemKey
  colors?: {
    active?: string
    primary?: string
    background?: string
  }
  dropdown?: boolean
  addable?: boolean
  options?: TabsOption[]
  loadingValue?: TabItemKey
  iconSize?: number
  contentClass?: string
  contentStyle?: CSSProperties | string
}
```

## 在线文档

[在线文档](https://oiij-use.vercel.app/chrome-tabs/chrome-tabs)
