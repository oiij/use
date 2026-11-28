# PresetField 配置字段控件

## 功能描述

**PresetField** 是一个功能强大的配置字段控件，提供了完整的输入控件配置能力，支持多种输入类型，包括按钮、颜色选择器、复选框、日期选择器、动态标签、输入框、数字输入框、搜索框、单选框、评分、选择器、滑块、开关、时间选择器等。它基于 Naive UI 的各种输入组件实现，为 Vue 应用提供了统一的输入控件配置方案。

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

<demo vue="./preset-field.vue" title="PresetField" />

## API

### `<PresetField />`

配置字段控件。

#### Props

| 属性         | 类型                        | 说明                                                                                                                                                           |
| ------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`       | `keyof PresetFieldType`     | 输入类型                                                                                                                                                       |
| `value`      | `PresetFieldValueMap[type]` | 输入的值，类型随 type 自动关联                                                                                                                                 |
| `emptyValue` | `PresetFieldValueMap[type]` | 值为 undefined 时的空值，优先于内置空值                                                                                                                        |
| `options`    | `PresetFieldOption<K>`      | 输入框配置（属性与插槽）；`options.props` 已排除受控键，不能覆盖 `value` / `onUpdate:value`（绑定顺序为「透传 props 在前，受控 value / onUpdate:value 在后」） |

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
export type PresetFieldValueMap = {
  'button': never
  'color-picker': string | null
  'checkbox': Array<string | number> | null
  'divider': never
  'date-picker': number | [number, number] | null
  'dynamic-tags': Array<string | DynamicTagsOption>
  'input': string | null
  'input-number': number | null
  'search': string | null
  'radio': string | number | boolean | null
  'rate': number
  'select': string | number | Array<string | number> | null
  'slider': number | number[]
  'switch': boolean
  'time-picker': number | null
}

type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never

export type PresetFieldOption<K extends keyof PresetFieldType = keyof PresetFieldType> = {
  /** 透传属性，受控的 value / onUpdate:value / onUpdateValue 不可覆盖 */
  props?: DistributiveOmit<NonNullable<PresetFieldType[K]['props']>, 'value' | 'onUpdate:value' | 'onUpdateValue'> & {
    style?: CSSProperties
    class?: string
  }
  slots?: PresetFieldType[K]['slots']
}

export type PresetFieldOptions = {
  [K in keyof PresetFieldType]: PresetFieldOption<K>
}[keyof PresetFieldType]

export type PresetFieldProps<K extends keyof PresetFieldType = keyof PresetFieldType> = {
  type?: K
  value?: PresetFieldValueMap[K]
  emptyValue?: PresetFieldValueMap[K]
  options?: PresetFieldOption<K>
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { PresetField } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')

const options = {
  props: { placeholder: '请输入' }
}
</script>

<template>
  <PresetField v-model:value="value" type="input" :options="options" />
</template>
```

### 选择器

```vue
<script setup>
import { PresetField } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref('')

const options = {
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
  <PresetField v-model:value="value" type="select" :options="options" />
</template>
```

### 日期选择器

```vue
<script setup>
import { PresetField } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref(null)

const options = {
  props: { placeholder: '请选择日期' }
}
</script>

<template>
  <PresetField v-model:value="value" type="date-picker" :options="options" />
</template>
```
