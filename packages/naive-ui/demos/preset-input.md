# PresetInput 配置输入框

## 功能描述

**PresetInput** 是一个功能强大的配置输入框组件，提供了完整的输入控件配置能力，支持多种输入类型，包括按钮、颜色选择器、复选框、日期选择器、动态标签、输入框、数字输入框、搜索框、单选框、评分、选择器、滑块、开关、时间选择器等。它基于 Naive UI 的各种输入组件实现，为 Vue 应用提供了统一的输入控件配置方案。

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

<demo vue="./preset-input.vue" title="PresetInput" />

## API

### Props

| Name    | Type               | Default | Description |
| ------- | ------------------ | ------- | ----------- |
| value   | String             | -       | 输入的值。  |
| options | PresetInputOptions | -       | 输入框配置  |

### Emits

| Name         | Type   | Default | Description |
| ------------ | ------ | ------- | ----------- |
| update:value | String | -       | 输入的值。  |

## 类型定义

```ts
export type PresetInputType = {
  'button': ButtonProps & {
    label?: string
  }
  'color-picker': ColorPickerProps
  'checkbox': CheckboxGroupProps & {
    options?: CheckboxProps[]
  }
  'divider ': DividerProps
  'date-picker': DatePickerProps
  'dynamic-tags': DynamicTagsProps
  'input': InputProps
  'input-number': InputNumberProps
  'search': SearchInputProps
  'radio': RadioGroupProps & {
    options?: RadioProps[]
  }
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
  };
}[keyof PresetInputType]

export type PresetInputProps<V> = {
  value?: V
  options?: PresetInputOptions
}
```
