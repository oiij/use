# PresetInput 配置输入框

## Demo

<demo vue="./demos/preset-input.vue" title="PresetInput" />

## Types

```ts
interface PresetInputType {
  'date-picker': DatePickerProps
  'input': InputProps
  'search': SearchInputProps
  'select': SelectProps
  'switch': SwitchProps
  'time-picker': TimePickerProps
  'button': ButtonProps
}
export type PresetInputOptions = {
  [K in keyof PresetInputType]: {
    type?: K
    label?: string | boolean | (FormItemProps & {
      style?: CSSProperties
      class?: string
    })
    props?: PresetInputType[K] & {
      style?: CSSProperties
      class?: string
    }
  };
}[keyof PresetInputType]
```

## Props

| Name    | Type               | Default | Description |
| ------- | ------------------ | ------- | ----------- |
| value   | String             | -       | 输入的值。  |
| path    | String             | -       | 输入路径。  |
| options | PresetInputOptions | -       | 输入框配置  |

## Emits

| Name         | Type   | Default | Description |
| ------------ | ------ | ------- | ----------- |
| update:value | String | -       | 输入的值。  |
