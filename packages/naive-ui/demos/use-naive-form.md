# UseNaiveForm

## 功能描述

**UseNaiveForm** 是一个功能强大的 Naive UI 表单管理工具，提供了完整的表单控制能力，包括表单验证、值管理、重置操作、清空操作等特性。它基于 Naive UI 的 Form 组件实现，为 Vue 应用提供了流畅的表单处理体验。

## 安装

```bash
# 使用 npm
npm install @oiij/naive-ui

# 使用 yarn
yarn add @oiij/naive-ui

# 使用 pnpm
pnpm add @oiij/naive-ui
```

## 基本使用

<demo vue="./use-naive-form.vue" title="UseNaiveForm" />

## API

### 函数签名

```ts
declare function useNaiveForm<T extends DataObject = DataObject>(formRef: TemplateRef<FormInst>, value?: T | Ref<T>, options?: NaiveFormOptions<T>): NaiveFormReturns<T>
```

## 类型定义

```ts
export type NaiveFormClearRules = {
  string?: string | null
  number?: number | null
  boolean?: boolean | null
}

export type NaiveFormRules<T extends DataObject> = Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>

export type NaiveFormOptions<T extends DataObject> = {
  rules?: NaiveFormRules<T> | Ref<NaiveFormRules<T>>
  clearRules?: NaiveFormClearRules
}

export type NaiveFormReturns<T extends DataObject = DataObject> = {
  formRef: Readonly<vue1743.ShallowRef<FormInst | null>>
  formValue: Ref<T, T>
  formRules: Ref<Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>, Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>>
  formProps: {
    model: vue1743.Reactive<T>
    rules: vue1743.Reactive<Partial<Record<keyof T, FormRules | FormItemRule | FormItemRule[]>>>
  }
  setValue: (_value: Partial<T>) => void
  validate: () => Promise<{
    warnings?: ValidateError[][]
  }>
  resetValidation: () => void
  resetForm: () => void
  reset: () => void
  clear: () => void
  onValidated: _vueuse_core1323.EventHookOn<[T]>
}
```
