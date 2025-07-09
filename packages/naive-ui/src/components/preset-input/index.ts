import type { ButtonProps, DatePickerProps, FormItemProps, InputProps, SelectProps, SwitchProps, TimePickerProps } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { SearchInputProps } from '..'

export { default as NPresetInput } from './PresetInput.vue'

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
export interface PresetInputProps<V extends string = string> {
  value?: V
  path?: string
  options?: PresetInputOptions
}
