# CopyButton 复制按钮

## 功能描述

**CopyButton** 是一个功能强大的复制按钮组件，提供了完整的复制功能，包括文本复制、复制反馈、自定义提示等特性。它基于 Naive UI 的 Button 和 Tooltip 组件实现，为 Vue 应用提供了流畅的复制操作体验。

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
- `@vueuse/core`: ^10.0.0

## 基本使用

<demo vue="./copy-button.vue" title="CopyButton" />

## API

### `<CopyButton />`

复制按钮组件。

#### Props

| 属性           | 类型                  | 说明       |
| -------------- | --------------------- | ---------- |
| `value`        | `string`              | 要复制的值 |
| `config`       | `UseClipboardOptions` | 复制配置   |
| `tooltipProps` | `TooltipProps`        | 提示框配置 |
| `buttonProps`  | `ButtonProps`         | 按钮配置   |

#### Events

| 事件     | 参数              | 说明           |
| -------- | ----------------- | -------------- |
| `copied` | `(value: string)` | 复制成功时触发 |

#### Slots

| 插槽      | 说明             |
| --------- | ---------------- |
| `default` | 自定义按钮内容   |
| `icon`    | 自定义图标内容   |
| `tooltip` | 自定义提示框内容 |

## 类型定义

```ts
export type CopyButtonProps = {
  /**
   * 要复制的值
   */
  value: string
  /**
   * 复制配置
   */
  config?: UseClipboardOptions
  /**
   * 提示框配置
   */
  tooltipProps?: TooltipProps
  /**
   * 按钮配置
   */
  buttonProps?: ButtonProps
  /**
   * 复制成功时触发
   */
  copied?: (value: string) => void
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { CopyButton } from '@oiij/naive-ui'

const text = '要复制的文本'
</script>

<template>
  <CopyButton :value="text" />
</template>
```

### 自定义按钮

```vue
<script setup>
import { CopyButton } from '@oiij/naive-ui'
</script>

<template>
  <CopyButton value="复制内容" :button-props="{ type: 'primary' }">
    点击复制
  </CopyButton>
</template>
```

### 监听复制事件

```vue
<script setup>
import { CopyButton } from '@oiij/naive-ui'

function handleCopied(value) {
  console.log('复制成功:', value)
}
</script>

<template>
  <CopyButton value="复制内容" @copied="handleCopied" />
</template>
```
