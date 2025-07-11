import type { ButtonProps, CheckboxGroupProps, CheckboxProps, ColorPickerProps, DatePickerProps, DynamicTagsProps, FormItemProps, InputNumberProps, InputProps, RadioGroupProps, RadioProps, RateProps, SelectProps, SliderProps, SwitchProps, TimePickerProps } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { SearchInputProps } from '..'

export { default as NPresetInput } from './PresetInput.vue'

export interface PresetInputType {
  'button': ButtonProps
  'color-picker': ColorPickerProps
  'checkbox': CheckboxGroupProps & { options?: CheckboxProps[] }
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
    label?: string | boolean |(FormItemProps & {
      style?: CSSProperties
      class?: string
    })
    props?: PresetInputType[K] & {
      style?: CSSProperties
      class?: string
    }
  }
}[keyof PresetInputType]
export interface PresetInputProps<V> {
  value?: V
  path?: string
  options?: PresetInputOptions
}
