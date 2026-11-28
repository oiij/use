# Bubble 对话气泡

## 功能描述

**Bubble** 是一个用于展示对话消息的气泡组件，支持左右两侧布局、头像、名称、时间、加载动画、打字光标以及自定义插槽。组件颜色与字号取自 Naive UI 主题变量，可随主题切换自动适配，适合与 `useLLM`、`useChat` 等流式对话组合式函数配合使用。

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

<demo vue="./bubble.vue" title="Bubble" />

## API

### `<Bubble />`

对话气泡组件。

#### Props

| 属性          | 类型               | 默认值      | 说明                               |
| ------------- | ------------------ | ----------- | ---------------------------------- |
| `content`     | `string`           | `''`        | 气泡正文内容                       |
| `placement`   | `'start' \| 'end'` | `'start'`   | 气泡位置，`start` 居左、`end` 居右 |
| `avatar`      | `string`           | `undefined` | 头像图片地址                       |
| `avatarProps` | `AvatarProps`      | `undefined` | 头像属性                           |
| `name`        | `string`           | `''`        | 名称                               |
| `datetime`    | `string`           | `''`        | 时间文本                           |
| `loading`     | `boolean`          | `false`     | 是否显示加载动画                   |
| `typing`      | `boolean`          | `false`     | 是否在正文末尾显示打字光标         |
| `maxWidth`    | `string \| number` | `'80%'`     | 气泡最大宽度，数字按 px 处理       |

#### Slots

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 自定义正文内容           |
| `avatar`  | 自定义头像               |
| `header`  | 自定义头部（名称与时间） |
| `footer`  | 自定义底部内容           |
| `loading` | 自定义加载状态内容       |

## 类型定义

```ts
export type BubblePlacement = 'start' | 'end'

export type BubbleProps = {
  content?: string
  placement?: BubblePlacement
  avatar?: string
  avatarProps?: AvatarProps & ClassStyle
  name?: string
  datetime?: string
  loading?: boolean
  typing?: boolean
  maxWidth?: string | number
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { NBubble } from '@oiij/naive-ui/components'
</script>

<template>
  <NBubble content="你好，有什么可以帮你？" />
</template>
```

### 左右布局

```vue
<template>
  <NBubble placement="start" name="Vue 助手" content="你好，我是对话助手" />
  <NBubble placement="end" name="我" content="介绍一下这个组件" />
</template>
```

### 头像与时间

```vue
<template>
  <NBubble
    placement="start"
    name="Vue 助手"
    datetime="10:24"
    avatar="https://example.com/avatar.png"
  >
    支持通过 `avatar` 传入头像地址，也可以使用 `avatar` 插槽自定义头像。
  </NBubble>
</template>
```

### 加载与打字效果

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)
const typing = ref(true)
</script>

<template>
  <NBubble
    placement="start"
    :loading="loading"
    :typing="typing"
    content="正在思考中……"
  />
</template>
```

### 自定义头部与底部

```vue
<template>
  <NBubble content="消息内容">
    <template #header>
      <span>自定义头部</span>
    </template>
    <template #footer>
      <span>自定义底部</span>
    </template>
  </NBubble>
</template>
```
