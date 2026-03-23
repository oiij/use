# UseNaiveForm 表单管理

## 功能描述

**UseNaiveForm** 是一个功能强大的 Naive UI 表单管理工具，提供了完整的表单控制能力，包括表单验证、值管理、重置操作、清空操作等特性。它基于 Naive UI 的 Form 组件实现，为 Vue 应用提供了流畅的表单处理体验。

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

<demo vue="./use-naive-form.vue" title="UseNaiveForm" />

## API

### `useNaiveForm(formRef, value?, options?)`

使用 Naive UI 表单管理。

#### 参数

| 参数      | 类型                    | 说明     |
| --------- | ----------------------- | -------- |
| `formRef` | `TemplateRef<FormInst>` | 表单引用 |
| `value`   | `T \| Ref<T>`           | 表单值   |
| `options` | `NaiveFormOptions<T>`   | 配置选项 |

#### NaiveFormOptions

| 选项         | 类型                  | 说明         |
| ------------ | --------------------- | ------------ |
| `rules`      | `NaiveFormRules<T>`   | 表单校验规则 |
| `clearRules` | `NaiveFormClearRules` | 清空规则     |

#### 返回值

| 属性                    | 类型                     | 说明         |
| ----------------------- | ------------------------ | ------------ |
| `formRef`               | `Ref<FormInst \| null>`  | 表单引用     |
| `formValue`             | `Ref<T>`                 | 表单值       |
| `formRules`             | `Ref<NaiveFormRules<T>>` | 表单校验规则 |
| `formProps`             | `object`                 | 表单 props   |
| `setValue(value)`       | `Function`               | 设置表单值   |
| `validate()`            | `Function`               | 验证表单     |
| `resetValidation()`     | `Function`               | 重置验证     |
| `resetForm()`           | `Function`               | 重置表单     |
| `reset()`               | `Function`               | 重置         |
| `clear()`               | `Function`               | 清空         |
| `onValidated(callback)` | `Function`               | 验证成功事件 |

## 类型定义

```ts
export type NaiveFormClearRules = {
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}

export type NaiveFormRules<T> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>

export type NaiveFormOptions<T> = {
  /**
   * 表单校验规则
   */
  rules?: NaiveFormRules<T> | Ref<NaiveFormRules<T>>
  /**
   * 清空规则
   */
  clearRules?: NaiveFormClearRules
}

export type NaiveFormReturns<T> = {
  formRef: Ref<FormInst | null>
  formValue: Ref<T>
  formRules: Ref<NaiveFormRules<T>>
  formProps: { model: T, rules: NaiveFormRules<T> }
  setValue: (value: Partial<T>) => void
  validate: () => Promise<{ warnings?: ValidateError[][] }>
  resetValidation: () => void
  resetForm: () => void
  reset: () => void
  clear: () => void
  onValidated: (callback: (value: T) => void) => void
}
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useNaiveForm } from '@oiij/naive-ui'
import { ref, useTemplateRef } from 'vue'

const formValue = ref({
  name: '',
  email: ''
})

const { formRef, formProps, validate, resetForm } = useNaiveForm(
  useTemplateRef('form'),
  formValue
)

async function handleSubmit() {
  const { warnings } = await validate()
  if (!warnings) {
    console.log('提交:', formValue.value)
  }
}
</script>

<template>
  <n-form ref="form" v-bind="formProps">
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="formValue.name" />
    </n-form-item>
    <n-form-item label="邮箱" path="email">
      <n-input v-model:value="formValue.email" />
    </n-form-item>
  </n-form>
  <button @click="handleSubmit">
    提交
  </button>
</template>
```

### 带校验规则

```vue
<script setup>
import { useNaiveForm } from '@oiij/naive-ui'
import { ref, useTemplateRef } from 'vue'

const formValue = ref({
  name: '',
  age: null
})

const rules = {
  name: { required: true, message: '请输入姓名' },
  age: { type: 'number', required: true, message: '请输入年龄' }
}

const { formRef, formProps, validate } = useNaiveForm(
  useTemplateRef('form'),
  formValue,
  { rules }
)
</script>

<template>
  <n-form ref="form" v-bind="formProps">
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="formValue.name" />
    </n-form-item>
    <n-form-item label="年龄" path="age">
      <n-input-number v-model:value="formValue.age" />
    </n-form-item>
  </n-form>
  <button @click="validate">
    验证
  </button>
</template>
```
