# PresetInput 配置输入框

## 功能描述

**PresetInput** 是一个功能强大的配置输入框组件，提供了完整的输入控件配置能力，支持多种输入类型，包括按钮、颜色选择器、复选框、日期选择器、动态标签、输入框、数字输入框、搜索框、单选框、评分、选择器、滑块、开关、时间选择器等。它基于 Naive UI 的各种输入组件实现，为 Vue 应用提供了统一的输入控件配置方案。

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

<demo vue="./preset-input.vue" title="PresetInput" />

## API

### `<PresetInput />`

配置输入框组件。

#### Props

| 属性      | 类型                 | 说明       |
| --------- | -------------------- | ---------- |
| `value`   | `string`             | 输入的值   |
| `options` | `PresetInputOptions` | 输入框配置 |

#### Events

| 事件           | 参数              | 说明     |
| -------------- | ----------------- | -------- |
| `update:value` | `(value: string)` | 输入的值 |

## 支持的输入类型

| 类型           | 说明       |
| -------------- | ---------- |
| `button`       | 按钮       |
| `color-picker` | 颜色选择器 |
| `checkbox`     | 复选框     |
| `divider`      | 分割线     |
| `date-picker`  | 日期选择器 |
| `dynamic-tags` | 动态标签   |
| `input`        | 输入框     |
| `input-number` | 数字输入框 |
| `search`       | 搜索框     |
| `radio`        | 单选框     |
| `rate`         | 评分       |
| `select`       | 选择器     |
| `slider`       | 滑块       |
| `switch`       | 开关       |
| `time-picker`  | 时间选择器 |

## 类型定义

```ts
export type PresetInputType = {
  'button': ButtonProps & { label?: string }
  'color-picker': ColorPickerProps
  'checkbox': CheckboxGroupProps & { options?: CheckboxProps[] }
  'divider': DividerProps
  'date-picker': DatePickerProps
  'dynamic-tags': DynamicTagsProps
  'input': InputProps
  'input-number': InputNumberProps
  'search': SearchInputProps
  'radio': RadioGroupProps & { options?: RadioProps[] }
  'rate': RateProps
  'select': SelectProps
  'slider': SliderProps
  'switch': SwitchProps
  'time-picker': TimePickerProps
}

export type PresetInputOptions = {
  [K in keyof PresetInputType]: {
    type?: K
    props?: PresetInputType[K] & {
      style?: CSSProperties
      class?: string
    }
  }
}[keyof PresetInputType]
```

## 使用示例

### 基础用法

```vue
<script setup>
import { PresetInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')

const options = {
  type: 'input',
  props: { placeholder: '请输入' }
}
</script>

<template>
  <PresetInput v-model:value="value" :options="options" />
</template>
```

### 选择器

```vue
<script setup>
import { PresetInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')

const options = {
  type: 'select',
  props: {
    placeholder: '请选择',
    options: [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' }
    ]
  }
}
</script>

<template>
  <PresetInput v-model:value="value" :options="options" />
</template>
```

### 日期选择器

```vue
<script setup>
import { PresetInput } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref(null)

const options = {
  type: 'date-picker',
  props: { placeholder: '请选择日期' }
}
</script>

<template>
  <PresetInput v-model:value="value" :options="options" />
</template>
```
