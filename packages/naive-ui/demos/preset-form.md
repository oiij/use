# PresetForm 配置表单

## 功能描述

**PresetForm** 是一个基于 options 配置的动态表单组件，提供了表单生成、字段校验、折叠区（collapsed）、栅格布局、自定义渲染等能力。底层基于 [useNaiveForm] (#usenaiveform-表单) 组合式 API，继承其全部方法与事件，额外暴露 `collapsed` ref 支持外部控制折叠区展开/收起。

## 安装

```bash
pnpm add @oiij/naive-ui
# or
npm install @oiij/naive-ui
# or
yarn add @oiij/naive-ui
```

## 依赖

- `vue`: ^3.0.0
- `naive-ui`: ^2.0.0

## 基本使用

<demo vue="./preset-form.vue" title="PresetForm" />

## API

### `<PresetForm />`

#### Props

| 属性         | 类型                                          | 说明                                                                     |
| ------------ | --------------------------------------------- | ------------------------------------------------------------------------ |
| `values`     | `MaybeRefOrGetter<V>`                         | 表单初始值；响应式，外部变化会同步到内部 formValues                      |
| `options`    | `PresetFormOptions<V>`                        | 表单项配置数组                                                           |
| `rules`      | `UseNaiveFormRules<V>`                        | Naive UI 点路径规则（`FormRules & Partial<Record<keyof V, ...>>`）       |
| `clearRules` | `MaybeRefOrGetter<UseNaiveFormClearRules<V>>` | 清空规则：支持类型默认值与按字段名指定，字段选项的 emptyValue 会合并进来 |
| `formProps`  | `PresetFormNativeProps`                       | 透传给 `<n-form>` 的配置；不能覆盖 model / rules                         |
| `gridProps`  | `GridProps & ClassStyle`                      | 透传给 `<n-grid>` 的配置                                                 |

#### Events

| 事件        | 参数         | 说明           |
| ----------- | ------------ | -------------- |
| `validated` | `(value: V)` | 校验成功时触发 |

#### Expose（通过 ref 访问，继承自 `UseNaiveFormReturns<V>`）

| 属性/方法             | 类型                                              | 说明                                                                                         |
| --------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `formValues`          | `Ref<V>`                                          | 当前表单值                                                                                   |
| `formRules`           | `Ref<FormRules>`                                  | 当前校验规则                                                                                 |
| `formProps`           | `ComputedRef<FormProps>`                          | useNaiveForm 计算的 NForm 绑定（`{ model, rules }`），与组件 prop `formProps` 同名但含义不同 |
| `formInst`            | `Ref<FormInst \| null>`                           | Naive UI Form 原生实例                                                                       |
| `dirty`               | `ComputedRef<boolean>`                            | 当前值与快照（上次 updateCache / resetForm 前）是否不同                                      |
| `setValue(next)`      | `(next: Partial<V>) => void`                      | 合并设置表单值                                                                               |
| `validate()`          | `() => Promise<{ warnings?: ValidateError[][] }>` | 整体校验（失败 reject），成功后触发 validated 事件                                           |
| `validateField(path)` | `(path: string \| string[]) => Promise<void>`     | 单字段 / 点路径 / 多字段数组校验                                                             |
| `resetForm()`         | `() => void`                                      | 恢复快照值（不清校验态），同时清空折叠区 filters / sorters（见 Demo）                        |
| `resetValidation()`   | `() => void`                                      | 仅恢复 Naive UI 校验态                                                                       |
| `reset()`             | `() => void`                                      | resetValidation + resetForm                                                                  |
| `clear()`             | `() => void`                                      | 按 clearRules 把所有字段清零                                                                 |
| `updateCache()`       | `() => void`                                      | 把当前 formValues 拍为新快照，后续 resetForm() 恢复此快照                                    |
| `onValidated`         | `(cb: (v: V) => void) => () => void`              | 订阅校验成功事件                                                                             |
| `onUpdateValue`       | `(cb: (v: V) => void) => () => void`              | 订阅 values 外部变化同步事件                                                                 |
| `collapsed`           | `Ref<boolean>`                                    | **PresetForm 特有**：折叠区是否展开，可从外部读写（`ref.value = true`）                      |

> 注意：Expose 里的 `formProps` 是 useNaiveForm 的计算属性（`{ model, rules }`），与组件 prop `formProps`（透传给 NForm 的配置）同名但含义不同。

#### Slots（作用域 v-bind 为组件内部解包后的纯值）

| 名称     | 作用域 v-bind      | 说明                                         |
| -------- | ------------------ | -------------------------------------------- |
| `header` | 同 Expose 全部字段 | 表单头部（只有用户传入才渲染，空容器不生成） |
| `footer` | 同 Expose 全部字段 | 表单底部操作区（空容器不生成）               |
| 默认     | 同 Expose 全部字段 | 表单项区域                                   |

> `header` / `footer` / 默认 slot 的参数是 PresetForm.vue 内部 `slotProps` 解包后的纯值（`formValues` / `dirty` / `collapsed` 等直接是值，不再是 ref）。而 `render` 的入参仍是 `PresetFormExpose<V> & { overflow: boolean }`（ref 形态），需要用 `.value` 访问。

## PresetFormOptionItem 配置

| 属性         | 类型                                          | 说明                                                                                                              |
| ------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `key`        | `keyof V \| number`                           | 字段键名（支持数字）                                                                                              |
| `label`      | `MaybeRefOrGetter<string>`                    | 标签                                                                                                              |
| `required`   | `MaybeRefOrGetter<boolean>`                   | 是否必填（会被 mergeRule 合入 FormItemRule.required）                                                             |
| `collapsed`  | `MaybeRefOrGetter<boolean>`                   | 是否折叠（为 true 的字段会被移到展开区）                                                                          |
| `span`       | `MaybeRefOrGetter<string \| number>`          | 栅格占位                                                                                                          |
| `hidden`     | `MaybeRefOrGetter<boolean>`                   | 是否隐藏                                                                                                          |
| `rule`       | `FormRules \| FormItemRule \| FormItemRule[]` | 校验规则（和 required 一起传给 mergeRule 合成）                                                                   |
| `itemProps`  | `PresetFormItemProps`                         | 透传给 `<n-form-item>` / `<n-gi>` 的配置；不能覆盖 label / path / rule；`offset` / `suffix` 会被拆出来传给 `n-gi` |
| `render`     | `(params) => VNode \| null`                   | 自定义渲染函数，params 为 `PresetFormExpose<V> & { overflow: boolean }`                                           |
| `emptyValue` | `any`                                         | 字段空值/重置值：同时用于 NPresetField 的 emptyValue 与表单 clear                                                 |
| _...其余_    | `PresetFieldOptions` 展开                     | 透传给 `<n-preset-field>` 的配置（`props` / `slots`）                                                             |

## 类型定义

```ts
export type PresetFormOptionItem<V extends DataObject = DataObject> = PresetFieldOptions & {
  /** 字段键名 */
  key?: keyof V
  /** 标签 */
  label?: MaybeRefOrGetter<string>
  /** 是否必填（被 mergeRule 合入 rule.required，不直接透传给 NFormItem） */
  required?: MaybeRefOrGetter<boolean>
  /** 是否折叠（为 true 时移到展开区） */
  collapsed?: MaybeRefOrGetter<boolean>
  /** 栅格占位 */
  span?: MaybeRefOrGetter<string | number>
  /** 是否隐藏 */
  hidden?: MaybeRefOrGetter<boolean>
  /** 校验规则 */
  rule?: FormRules | FormItemRule | FormItemRule[]
  /** 表单项属性（受控的 label / path / rule 不可覆盖；offset / suffix 会拆出传给 NGi，其余传给 NFormItem） */
  itemProps?: PresetFormItemProps
  /** 自定义渲染函数 */
  render?: (params: PresetFormExpose<V> & { overflow: boolean }) => VNode | null
  /** 字段空值/重置值 */
  emptyValue?: any
}

export type PresetFormOptions<V extends DataObject = DataObject> = PresetFormOptionItem<V>[]

export type PresetFormExpose<V extends DataObject = DataObject> = UseNaiveFormReturns<V> & {
  /** 折叠区是否展开（可从外部读写） */
  collapsed: Ref<boolean>
}

/** 表单透传属性：已排除受控的 model / rules */
export type PresetFormNativeProps = Omit<FormProps, 'model' | 'rules'> & ClassStyle

/** 表单项透传属性：已排除受控的 label / path / rule */
export type PresetFormItemProps = Omit<FormItemProps & GridItemProps, 'label' | 'path' | 'rule'> & ClassStyle

export type PresetFormProps<V extends DataObject = DataObject> = {
  /** 表单选项 */
  options?: PresetFormOptions<V>
  /** 表单值 */
  values?: V
  /** 校验规则（支持 keyof V 和点路径） */
  rules?: UseNaiveFormRules<V>
  /** 清空规则（类型默认值 + 按字段名） */
  clearRules?: MaybeRefOrGetter<UseNaiveFormClearRules<V>>
  /** 表单属性（受控的 model / rules 不可覆盖） */
  formProps?: PresetFormNativeProps
  /** 网格属性 */
  gridProps?: GridProps & ClassStyle
}
```

## 内部行为说明

| 行为               | 实现                                                                                                                                       | 说明                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **collapsed 合并** | 所有 `collapsed: true` 的 option 移到底部展开区，用 `NDivider + NCollapseTransition` 包裹；默认展开（`collapsed` ref 初始 false → 展开态） | 外部 `presetFormRef.value.collapsed = true` 可强制收起                           |
| **itemProps 拆分** | `offset` / `suffix` 提取出来传给 NGi；其余（labelPlacement / labelWidth / showFeedback 等）传给 NFormItem                                  | 用 PresetFormItem 的 itemProps 就能同时控制栅格和表单项                          |
| **required 处理**  | **只**传给 mergeRule 合成 FormItemRule.required，不直接透传给 NFormItem（Naive UI NFormItem 没有 required prop，是个易踩的坑）             | 最终效果：`required: true` → `rule: { required: true }`                          |
| **dirty 计算**     | `computed(() => !isEqual(formValues, cacheValue))`，cacheValue 在初始化和 updateCache 时更新                                               | updateCache 后 dirty 立刻变 false；resetForm 恢复 cacheValue 后 dirty 也变 false |
| **slot 懒渲染**    | header / footer slot 加了 `v-if="$slots.header"`，用户不传 slot 时不渲染空容器                                                             |                                                                                  |

## 使用示例

### 基础用法

```vue
<script setup>
import { NPresetForm } from '@oiij/naive-ui'
import { ref } from 'vue'

const values = ref({
  name: '',
  age: null,
  email: ''
})

const options = [
  { key: 'name', label: '姓名', type: 'input' },
  { key: 'age', label: '年龄', type: 'input-number' },
  { key: 'email', label: '邮箱', type: 'input' }
]

function handleValidated(value) {
  console.log('表单数据:', value)
}
</script>

<template>
  <NPresetForm
    :values="values"
    :options="options"
    @validated="handleValidated"
  />
</template>
```

### 带校验规则 + 折叠区

```vue
<script setup>
import { NPresetForm } from '@oiij/naive-ui'
import { ref } from 'vue'

const values = ref({ name: '', email: '', extra: '' })

const options = [
  { key: 'name', label: '姓名', type: 'input', required: true },
  { key: 'email', label: '邮箱', type: 'input', rule: { type: 'email', message: '请输入正确的邮箱' } },
  // collapsed 字段会被自动移到底部展开区
  { key: 'extra', label: '补充信息', type: 'textarea', collapsed: true },
]

const rules = {
  // 支持点路径（Naive UI 原生能力）
  'profile.bio': { required: false },
}
</script>

<template>
  <NPresetForm :values="values" :options="options" :rules="rules" />
</template>
```

### dirty + 保存快照 + 外部控制折叠

```vue
<script setup>
import { NPresetForm } from '@oiij/naive-ui'
import { NButton } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

const formRef = useTemplateRef('form')

function handleSave() {
  // 把当前值拍为新快照，后续 resetForm() 恢复这个状态
  formRef.value?.updateCache()
}

function handleSubmit() {
  formRef.value?.validate()
    .then(v => console.log('提交:', v))
    .catch(err => console.warn('校验失败'))
}

function handleCollapse() {
  // 外部控制折叠区
  if (formRef.value) {
    formRef.value.collapsed = !formRef.value.collapsed
  }
}
</script>

<template>
  <NPresetForm ref="form" :options="options">
    <template #footer>
      <NButton @click="handleSave">
        保存快照
      </NButton>
      <NButton type="primary" @click="handleSubmit">
        提交
      </NButton>
      <NButton @click="handleCollapse">
        折叠状态: {{ formRef?.collapsed ? '收起' : '展开' }}
      </NButton>
      <span style="margin-left: auto">dirty: {{ formRef?.dirty }}</span>
    </template>
  </NPresetForm>
</template>
```

### 自定义 render + overflow

```vue
<script setup>
import { NPresetForm } from '@oiij/naive-ui'
import { NButton, NSpace } from 'naive-ui'
import { ref } from 'vue'

const values = ref({ name: '' })

const options = [
  { key: 'name', label: '姓名', type: 'input' },
  // overflow 参数在内容溢出时为 true，可用于做省略号等 UI
  {
    label: '提示',
    itemProps: { suffix: true },
    render: ({ overflow }) => {
      return h('span', {}, overflow ? '（溢出）' : '')
    }
  },
]
</script>

<template>
  <NPresetForm :values="values" :options="options" />
</template>
```
