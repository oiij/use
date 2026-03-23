# ToggleInput 切换编辑

## 功能描述

**ToggleInput** 是一个功能强大的切换编辑组件，提供了完整的文本编辑切换能力，包括双击编辑、失焦保存等特性。它基于 Naive UI 的 Input 组件实现，为 Vue 应用提供了便捷的文本编辑解决方案。

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

<demo vue="./toggle-input.vue" title="ToggleInput" />

## API

### `<ToggleInput />`

切换编辑组件。

#### Props

| 属性         | 类型         | 说明         |
| ------------ | ------------ | ------------ |
| `value`      | `string`     | 文本输入的值 |
| `inputProps` | `InputProps` | 输入框配置   |

#### Events

| 事件           | 参数              | 说明                   |
| -------------- | ----------------- | ---------------------- |
| `update:value` | `(value: string)` | 输入框值停止输入时触发 |

## 类型定义

```ts
export type ToggleInputProps = {
  /**
   * 文本输入的值
   */
  'value': string
  /**
   * 输入框配置
   */
  'inputProps'?: InputProps
  /**
   * 输入框值更新时触发
   */
  'update:value'?: (value: string) => void
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { ToggleInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('点击编辑我')
</script>

<template>
  <ToggleInput v-model:value="value" />
</template>
```

### 自定义输入框配置

```vue
<script setup>
import { ToggleInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('双击编辑')
</script>

<template>
  <ToggleInput
    v-model:value="value"
    :input-props="{ placeholder: '请输入内容', maxlength: 50 }"
  />
</template>
```
