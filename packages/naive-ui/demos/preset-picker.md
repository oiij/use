# PresetPicker 配置选择器

## 功能描述

**PresetPicker** 是一个功能强大的配置选择器组件，提供了完整的选择器配置能力，包括模态框选择、表格展示、多选支持、清空功能等特性。它基于 Naive UI 的 Button、Modal 和 DataTable 组件实现，为 Vue 应用提供了灵活的选择器配置解决方案。

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

<demo vue="./preset-picker.vue" title="PresetPicker" />

## API

### `<PresetPicker />`

配置选择器组件。

#### Props

| 属性               | 类型                                            | 说明                                                               |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------ |
| `value`            | `PresetPickerValue`                             | 选择器的值                                                         |
| `fallbackLabel`    | `string \| ((val: string \| number) => string)` | 选择器的值为空时的提示；字符串为统一占位文案，多选时直接展示该文案 |
| `multiple`         | `boolean`                                       | 是否多选                                                           |
| `disabled`         | `boolean`                                       | 是否禁用                                                           |
| `clearable`        | `boolean`                                       | 是否可清空                                                         |
| `tooltip`          | `boolean`                                       | 是否显示提示，默认 `true`                                          |
| `placeholder`      | `string`                                        | 输入框占位符，默认 `'请选择'`                                      |
| `type`             | `ButtonProps['type']`                           | 按钮类型                                                           |
| `columns`          | `DataTableColumns`                              | 数据列                                                             |
| `selectionOptions` | `TableSelectionColumn`                          | 选择列配置                                                         |
| `fields`           | `{ label?: string, value?: string }`            | 字段映射（label / value）                                          |
| `buttonProps`      | `ButtonProps`                                   | 按钮配置                                                           |
| `clearButtonProps` | `ButtonProps`                                   | 清空按钮配置                                                       |
| `badgeProps`       | `BadgeProps`                                    | 徽章配置                                                           |
| `modalProps`       | `ModalProps`                                    | 弹窗配置                                                           |

#### Events

| 事件            | 参数                                      | 说明               |
| --------------- | ----------------------------------------- | ------------------ |
| `update:value`  | `(val: V \| null, raw: R \| R[] \| null)` | 值更新时           |
| `afterEnter`    | -                                         | 弹窗进入动画结束时 |
| `afterLeave`    | -                                         | 弹窗离开动画结束时 |
| `esc`           | -                                         | 按下 esc 键时      |
| `maskClick`     | -                                         | 点击遮罩层时       |
| `update:show`   | `(val: boolean)`                          | 弹窗显示状态更新时 |
| `close`         | -                                         | 弹窗关闭时         |
| `negativeClick` | -                                         | 取消按钮点击时     |
| `positiveClick` | -                                         | 确定按钮点击时     |

> 多选时 `raw` 仅包含已加载到的行，数量可能少于 `keys`。

#### Expose（通过 ref 访问）

| 属性/方法                    | 类型                                      | 说明                                                 |
| ---------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `showModalFlag`              | `Ref<boolean>`                            | 弹窗是否显示                                         |
| `checkedRowKeys`             | `Ref<(string \| number)[]>`               | 选中行键                                             |
| `checkedRows`                | `Ref<R[]>`                                | 选中行数据                                           |
| `columns`                    | `DataTableColumns`                        | 响应式列数组（selection 列 + 用户 columns 实时同步） |
| `showModal()`                | `() => void`                              | 打开弹窗                                             |
| `updateCheckedRowKeysEffect` | `(keys, rows, meta, currentData) => void` | 同步选中行键 / 行数据（支持 checkAll / uncheckAll）  |
| `clickRowEffect(row)`        | `(row: R) => void`                        | 行点击切换选中                                       |
| `clearValue()`               | `() => void`                              | 清空值                                               |
| `setCheckedRowKeys(keys)`    | `(keys: (string \| number)[]) => void`    | 设置选中行键                                         |
| `setCheckedRows(rows)`       | `(rows: R[]) => void`                     | 设置选中行数据                                       |
| `runPositiveClick()`         | `() => void`                              | 执行确定按钮逻辑                                     |

#### 行为说明

- 外部修改 `value` 会立即同步选中键，并清理无效行（已不在 value 内的 `checkedRows`）。
- `columns` / `selectionOptions` / `multiple` 变化会实时反映到表格列。

## 类型定义

```ts
export type PresetPickerValue = string | number | (string | number)[] | null

export type PresetPickerProps<V, R> = {
  /**
   * 选择器的值
   */
  value?: V
  /**
   * 选择器的值为空时的提示
   */
  fallbackLabel?: string | ((val: string | number) => string)
  /**
   * 是否多选
   */
  multiple?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 是否显示提示，默认 true
   */
  tooltip?: boolean
  /**
   * 输入框占位符，默认 '请选择'
   */
  placeholder?: string
  /**
   * 按钮类型
   */
  type?: ButtonProps['type']
  /**
   * 数据列
   */
  columns?: DataTableColumns<R>
  /**
   * 选择列配置
   */
  selectionOptions?: TableSelectionColumn
  /**
   * 数据列配置
   */
  fields?: { label?: string, value?: string }
  /**
   * 按钮配置
   */
  buttonProps?: ButtonProps & ClassStyle
  /**
   * 清空按钮配置
   */
  clearButtonProps?: ButtonProps & ClassStyle
  /**
   * 徽章配置
   */
  badgeProps?: BadgeProps & ClassStyle
  /**
   * 弹窗配置
   */
  modalProps?: ModalProps & ClassStyle
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { PresetPicker } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref(null)
const data = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 }
]

const columns = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' }
]
</script>

<template>
  <PresetPicker
    v-model:value="value"
    :data="data"
    :columns="columns"
    :fields="{ label: 'name', value: 'id' }"
  />
</template>
```

### 多选

```vue
<script setup>
import { PresetPicker } from '@oiij/naive-ui'
import { ref } from 'vue'

const value = ref([])
const data = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
]

const columns = [
  { title: '姓名', key: 'name' }
]
</script>

<template>
  <PresetPicker
    v-model:value="value"
    :data="data"
    :columns="columns"
    :multiple="true"
    :fields="{ label: 'name', value: 'id' }"
  />
</template>
```
