# SearchInput 搜索框

## 功能描述

**SearchInput** 是一个功能强大的搜索框组件，提供了完整的搜索功能，包括自动触发搜索、搜索按钮配置、加载状态显示等特性。它基于 Naive UI 的 Input 和 Button 组件实现，为 Vue 应用提供了流畅的搜索体验。

## 安装

```bash
# 使用 pnpm
pnpm add @oiij/naive-ui

# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui
```

## 依赖

- `vue`: ^3.0.0
- `naive-ui`: ^2.0.0

## 基本使用

<demo vue="./search-input.vue" title="SearchInput" />

## API

### `<SearchInput />`

搜索框组件。

#### Props

| 属性           | 类型                          | 默认值  | 说明               |
| -------------- | ----------------------------- | ------- | ------------------ |
| `value`        | `string`                      | -       | 文本输入的值       |
| `type`         | `string`                      | -       | 输入框类型         |
| `placeholder`  | `string`                      | -       | 输入框占位符       |
| `autoTrigger`  | `boolean \| number`           | `true`  | 是否自动触发搜索   |
| `searchButton` | `boolean \| 'text' \| 'icon'` | `true`  | 是否显示搜索按钮   |
| `loading`      | `boolean`                     | `false` | 搜索按钮是否加载中 |
| `inputProps`   | `InputProps`                  | -       | 输入框配置         |
| `buttonProps`  | `ButtonProps`                 | -       | 按钮配置           |

#### Events

| 事件           | 参数              | 说明                   |
| -------------- | ----------------- | ---------------------- |
| `update:value` | `(value: string)` | 输入框值停止输入时触发 |

#### Slots

| 插槽     | 说明               |
| -------- | ------------------ |
| `icon`   | 自定义图标内容     |
| `button` | 自定义搜索按钮内容 |

## 类型定义

```ts
export type SearchInputProps = {
  /**
   * 文本输入的值
   */
  value?: string | null
  /**
   * 输入框类型
   */
  type?: ButtonProps['type']
  /**
   * 输入框占位符
   */
  placeholder?: string
  /**
   * 是否自动触发搜索，如果值为 Number，则设置自动触发的延迟时间
   * @default true
   */
  autoTrigger?: boolean | number
  /**
   * 是否显示搜索按钮
   * @default true
   */
  searchButton?: 'text' | 'icon' | boolean
  /**
   * 输入框配置
   */
  inputProps?: InputProps
  /**
   * 按钮配置
   */
  buttonProps?: ButtonProps
  /**
   * 搜索按钮是否加载中
   * @default false
   */
  loading?: boolean
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { SearchInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const keyword = ref('')

function handleSearch(value) {
  console.log('搜索:', value)
}
</script>

<template>
  <SearchInput
    v-model:value="keyword"
    placeholder="请输入关键词"
    @update:value="handleSearch"
  />
</template>
```

### 带加载状态

```vue
<script setup>
import { SearchInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const keyword = ref('')
const loading = ref(false)

async function handleSearch(value) {
  loading.value = true
  await fetchData(value)
  loading.value = false
}
</script>

<template>
  <SearchInput
    v-model:value="keyword"
    :loading="loading"
    @update:value="handleSearch"
  />
</template>
```

### 自定义触发延迟

```vue
<script setup>
import { SearchInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const keyword = ref('')

function handleSearch(value) {
  console.log('搜索:', value)
}
</script>

<template>
  <SearchInput
    v-model:value="keyword"
    :auto-trigger="500"
    @update:value="handleSearch"
  />
</template>
```
