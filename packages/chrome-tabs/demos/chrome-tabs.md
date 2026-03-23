# Chrome-Tabs

## 功能描述

**Chrome-Tabs** 是一个类似 Chrome 浏览器标签页风格的 Vue 组件，支持标签页的添加、删除、点击切换、下拉菜单等功能，可自定义颜色主题和图标大小。

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

## 基本使用

<demo vue="./chrome-tabs.vue" title="Chrome-Tabs Base" />

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
  /**
   * 标签页键
   */
  key: TabItemKey
  /**
   * 标签页标题
   */
  label: string | ((key: TabItemKey, index: number) => VNodeChild)
  /**
   * 标签页图标
   */
  icon?: (key: TabItemKey, index: number) => VNodeChild
  /**
   * 是否可关闭
   * @default false
   */
  closable?: boolean | ((key: TabItemKey, index: number) => boolean)
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean | ((key: TabItemKey, index: number) => boolean)
  /**
   * 是否加载中
   * @default false
   */
  loading?: boolean | ((key: TabItemKey, index: number) => boolean)
  /**
   * 加载图标
   */
  loadingIcon?: (key: TabItemKey, index: number) => VNodeChild
  /**
   * 点击事件
   */
  onClick?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  /**
   * 右键菜单事件
   */
  onContextMenu?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  /**
   * 关闭事件
   */
  onClose?: (key: TabItemKey, index: number, ev: MouseEvent) => void
  /**
   * 自定义类名
   */
  class?: string
  /**
   * 自定义样式
   */
  style?: CSSProperties | string
}

export type TabsProps = {
  /**
   * 当前激活的标签页键
   */
  value?: TabItemKey
  /**
   * 颜色配置
   */
  colors?: {
    /**
     * 激活状态颜色
     */
    active?: string
    /**
     * 主要颜色
     */
    primary?: string
    /**
     * 背景颜色
     */
    background?: string
  }
  /**
   * 是否显示下拉菜单
   * @default false
   */
  dropdown?: boolean
  /**
   * 是否可添加标签页
   * @default false
   */
  addable?: boolean
  /**
   * 标签页选项配置
   */
  options?: TabsOption[]
  /**
   * 加载中的标签页键
   */
  loadingValue?: TabItemKey
  /**
   * 图标大小
   */
  iconSize?: number
  /**
   * 内容区域类名
   */
  contentClass?: string
  /**
   * 内容区域样式
   */
  contentStyle?: CSSProperties | string
}
```

## 使用示例

### 基础用法

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

### 带图标的标签页

```vue
<script setup>
import { ChromeTabs } from '@oiij/chrome-tabs'
import { h, ref } from 'vue'
import HomeIcon from './icons/HomeIcon.vue'
import SettingsIcon from './icons/SettingsIcon.vue'

const value = ref('home')
const options = [
  {
    key: 'home',
    label: '首页',
    icon: () => h(HomeIcon)
  },
  {
    key: 'settings',
    label: '设置',
    icon: () => h(SettingsIcon)
  },
]
</script>

<template>
  <ChromeTabs v-model:value="value" :options="options" />
</template>
```
