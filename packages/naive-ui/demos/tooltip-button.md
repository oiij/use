# TooltipButton 提示按钮

## 功能描述

**TooltipButton** 是一个功能强大的提示按钮组件，提供了完整的按钮和提示框组合能力，包括按钮配置、提示框配置、自定义内容等特性。它基于 Naive UI 的 Button 和 Tooltip 组件实现，为 Vue 应用提供了便捷的提示按钮解决方案。

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

<demo vue="./tooltip-button.vue" title="TooltipButton" />

## API

### `<TooltipButton />`

提示按钮组件。

#### Props

| 属性           | 类型           | 说明         |
| -------------- | -------------- | ------------ |
| `value`        | `string`       | 提示框内容值 |
| `tooltipProps` | `TooltipProps` | 提示框配置   |
| `buttonProps`  | `ButtonProps`  | 按钮配置     |

#### Events

| 事件    | 参数               | 说明       |
| ------- | ------------------ | ---------- |
| `click` | `(ev: MouseEvent)` | 点击时触发 |

#### Slots

| 插槽      | 说明               |
| --------- | ------------------ |
| `default` | 自定义按钮内容     |
| `icon`    | 自定义按钮图标内容 |
| `tooltip` | 自定义提示框内容   |

## 类型定义

```ts
export type TooltipButtonProps = {
  /**
   * 提示框内容值
   */
  value: string
  /**
   * 提示框配置
   */
  tooltipProps?: TooltipProps
  /**
   * 按钮配置
   */
  buttonProps?: ButtonProps
  /**
   * 点击时触发
   */
  click?: (ev: MouseEvent) => void
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { TooltipButton } from '@oiij/naive-ui'

function handleClick() {
  console.log('按钮被点击')
}
</script>

<template>
  <TooltipButton
    value="点击查看详情"
    :button-props="{ type: 'primary' }"
    @click="handleClick"
  >
    查看
  </TooltipButton>
</template>
```

### 自定义图标

```vue
<script setup>
import { TooltipButton } from '@oiij/naive-ui'
</script>

<template>
  <TooltipButton
    value="编辑"
    :button-props="{ type: 'info', circle: true }"
  >
    <template #icon>
      <span>✏️</span>
    </template>
  </TooltipButton>
</template>
```

### 自定义提示框

```vue
<script setup>
import { TooltipButton } from '@oiij/naive-ui'
</script>

<template>
  <TooltipButton :button-props="{ type: 'warning' }">
    删除
    <template #tooltip>
      <div>
        <p>确定要删除吗？</p>
        <p style="color: #ff6b6b;">
          此操作不可撤销
        </p>
      </div>
    </template>
  </TooltipButton>
</template>
```
