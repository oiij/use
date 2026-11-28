# UseNaiveForm 表单管理

## 功能描述

**UseNaiveForm** 是一个功能强大的 Naive UI 表单管理工具，提供了完整的表单控制能力，包括表单验证、值管理、重置操作、清空操作、单字段校验、脏值检测以及快照管理等特性。它基于 Naive UI 的 Form 组件实现，为 Vue 应用提供了流畅的表单处理体验。

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
- `es-toolkit`: ^1.0.0

## 基本使用

<demo vue="./use-naive-form.vue" title="UseNaiveForm" />

## API

### `useNaiveForm(formInstRef, options?)`

使用 Naive UI 表单管理。

#### 参数

| 参数          | 类型                     | 说明                                                         |
| ------------- | ------------------------ | ------------------------------------------------------------ |
| `formInstRef` | `TemplateRef<FormInst>`  | Naive UI 表单实例引用                                        |
| `options`     | `UseNaiveFormOptions<T>` | 配置选项（包含 values / rules / clearRules / onUpdateValue） |

#### UseNaiveFormOptions

| 选项         | 类型                                                             | 说明                                                                           | 默认值                                          |
| ------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| `values`     | `T \| MaybeRefOrGetter<T>`                                       | 表单初始值，支持 Ref / getter / 普通对象                                       | `{}`                                            |
| `rules`      | `UseNaiveFormRules<T> \| MaybeRefOrGetter<UseNaiveFormRules<T>>` | 表单校验规则，支持 Ref / getter / 普通对象                                     | `{}`                                            |
| `clearRules` | `UseNaiveFormClearRules<T> \| MaybeRefOrGetter<...>`             | 清空规则，支持类型默认值与按顶层字段名的覆盖值；`clear()` / `resetForm()` 生效 | `{ string: null, number: null, boolean: null }` |

#### 返回值

| 属性                      | 类型                                                                      | 说明                                                                                   |
| ------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `formInst`                | `Ref<FormInst \| null>`                                                   | 表单实例引用（与传入同一份）                                                           |
| `formValues`              | `Ref<T>`                                                                  | 当前表单值（单一真相源）                                                               |
| `formRules`               | `Ref<UseNaiveFormRules<T>>`                                               | 当前表单校验规则                                                                       |
| `formProps`               | `ComputedRef<{ model: T, rules: UseNaiveFormRules<T> }>`                  | 直接绑定到 `<n-form v-bind>` 的 props                                                  |
| `dirty`                   | `ComputedRef<boolean>`                                                    | 脏值标记：当前 formValues 与快照不同即为 true                                          |
| `setValue(value)`         | `(value: Partial<T>) => void`                                             | 合并设置表单值                                                                         |
| `validate()`              | `() => Promise<{ warnings?: ValidateError[][] }>`                         | 整体校验表单                                                                           |
| `validateField(path)`     | `(path: string \| string[]) => Promise<{ warnings?: ValidateError[][] }>` | 校验指定字段，支持 key / 点路径 / 多字段数组                                           |
| `updateCache()`           | `() => void`                                                              | 将当前 formValues 保存为新快照，后续 resetForm / reset 恢复到此快照                    |
| `resetValidation()`       | `() => void`                                                              | 重置校验状态                                                                           |
| `resetForm()`             | `() => void`                                                              | 先按 clearRules 清空（快照中不存在的字段保留字段级默认值），再恢复至快照（不重置校验） |
| `reset()`                 | `() => void`                                                              | 同时重置校验状态 + 恢复 formValues 至快照                                              |
| `clear()`                 | `() => void`                                                              | 按 clearRules 将每个字段清为默认值                                                     |
| `onValidated(callback)`   | `(callback: (values: T) => void) => void`                                 | 整体校验通过时触发                                                                     |
| `onUpdateValue(callback)` | `(callback: (values: T) => void) => void`                                 | formValues 发生任何变化时触发（包括外部 values 选项变更）                              |

## 类型定义

```ts
export type UseNaiveFormClearRules<T extends DataObject = DataObject> = {
  /** 字符串字段的清空默认值，默认 null */
  string?: string | null
  /** 数字字段的清空默认值，默认 null */
  number?: number | null
  /** 布尔字段的清空默认值，默认 null */
  boolean?: boolean | null
} & {
  /** 按顶层字段名指定的清空值，优先级高于类型默认值（string/number/boolean 为类型保留键） */
  [K in Exclude<keyof T, 'string' | 'number' | 'boolean'>]?: unknown
}

export type UseNaiveFormRules<T extends DataObject> = FormRules & Partial<Record<keyof T, FormItemRule | FormItemRule[] | FormRules>>

export type UseNaiveFormOptions<T extends DataObject> = {
  values?: MaybeRefOrGetter<T>
  rules?: MaybeRefOrGetter<UseNaiveFormRules<T>>
  clearRules?: MaybeRefOrGetter<UseNaiveFormClearRules<T>>
}

export type UseNaiveFormReturns<T extends DataObject = DataObject> = ReturnType<typeof useNaiveForm<T>>
```

## 使用示例

### 基础用法

```vue
<script setup>
import { useNaiveForm } from '@oiij/naive-ui'
import { ref, useTemplateRef } from 'vue'

const { formProps, formValues, validate, resetForm } = useNaiveForm(useTemplateRef('form'), {
  values: { name: '', email: '' },
  rules: { name: { required: true, message: '请输入姓名' } },
})

async function handleSubmit() {
  try {
    const res = await validate()
    console.log('通过', formValues.value)
  }
  catch (errors) {
    console.log('未通过', errors)
  }
}
</script>

<template>
  <n-form ref="form" v-bind="formProps">
    <n-form-item label="姓名" path="name">
      <n-input v-model:value="formValues.name" />
    </n-form-item>
    <n-form-item label="邮箱" path="email">
      <n-input v-model:value="formValues.email" />
    </n-form-item>
    <n-button @click="handleSubmit">
      提交
    </n-button>
    <n-button @click="resetForm">
      恢复默认
    </n-button>
  </n-form>
</template>
```

### 校验单个字段（或嵌套路径）

```vue
<script setup>
import { useNaiveForm } from '@oiij/naive-ui'
import { useTemplateRef } from 'vue'

const { formProps, validateField } = useNaiveForm(useTemplateRef('form'), {
  values: { user: { name: '', age: 0 } },
  rules: { 'user.name': { required: true, message: '请输入用户名' } },
})

async function checkName() {
  // 单字段
  await validateField('user.name')
  // 多字段
  await validateField(['user.name', 'user.age'])
}
</script>
```

### 脏值检测 + 快照保存

```vue
<script setup>
import { useNaiveForm } from '@oiij/naive-ui'
import { useTemplateRef } from 'vue'

const { dirty, updateCache, formValues } = useNaiveForm(useTemplateRef('form'), {
  values: { name: '', age: 0 },
})

function saveAndLock() {
  // 用户修改后点击"保存"，把当前值拍为新快照
  // 之后 dirty 会变回 false，resetForm 会恢复到这份快照
  updateCache()
  // 此处调用后端保存
  await fetch('/api/save', { method: 'POST', body: JSON.stringify(formValues.value) })
}
</script>

<template>
  <div>dirty: {{ dirty }}</div>
  <n-button :disabled="!dirty" @click="saveAndLock">
    保存
  </n-button>
</template>
```

### 自定义 clearRules + 清空监听

```vue
<script setup>
import { useNaiveForm } from '@oiij/naive-ui'
import { useTemplateRef } from 'vue'

const { formProps, formValues, clear, onUpdateValue } = useNaiveForm(useTemplateRef('form'), {
  values: { name: '', age: 18, vip: false, tags: ['a', 'b'] },
  // 显式覆盖类型默认值，保持与旧版本（number -> null, boolean -> false）兼容
  clearRules: { number: null, boolean: false },
})

onUpdateValue((values) => {
  console.log('值变了', values)
})

// 调用 clear() 后：
// name  -> ''  (string 默认)
// age   -> null (显式覆盖)
// vip   -> false (显式覆盖)
// tags  -> []  (数组置空)
clear()
</script>
```
