# PresetInput 配置输入框

## Demo

<demo vue="./demos/preset-input.vue" title="PresetInput" />

## Types

```ts
export interface PresetInputType {
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
export interface PresetInputProps<V> {
  value?: V
  options?: PresetInputOptions
}
```

## Props

| Name    | Type               | Default | Description |
| ------- | ------------------ | ------- | ----------- |
| value   | String             | -       | 输入的值。  |
| options | PresetInputOptions | -       | 输入框配置  |

## Emits

| Name         | Type   | Default | Description |
| ------------ | ------ | ------- | ----------- |
| update:value | String | -       | 输入的值。  |
