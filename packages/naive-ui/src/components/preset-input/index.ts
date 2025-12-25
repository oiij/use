import type { ButtonProps, CheckboxGroupProps, CheckboxProps, ColorPickerProps, DatePickerProps, DividerProps, DynamicTagsProps, InputNumberProps, InputProps, RadioGroupProps, RadioProps, RateProps, SelectProps, SliderProps, SwitchProps, TimePickerProps } from 'naive-ui'
import type { VNode, VNodeArrayChildren } from 'vue'
import type { ClassStyle } from '../data-table-plus/index'
import type { SearchInputProps } from '../search-input/index'

export { default as NPresetInput } from './PresetInput.vue'

type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any)

export type PresetInputType = & {
  'button': {
    props?: ButtonProps & { label?: string }
    slots?: {
      default?: () => RawChildren
      icon?: () => RawChildren
    }
  }
  'color-picker': {
    props?: ColorPickerProps
    slots?: {
      label?: (color: string | null) => RawChildren
      action?: () => RawChildren
    }
  }
  'checkbox': {
    props?: CheckboxGroupProps & { options?: CheckboxProps[] }
    slots?: {
      default?: () => RawChildren
    }
  }
  'divider': {
    props?: DividerProps
    slots?: {
      default?: () => RawChildren
    }
  }
  'date-picker': {
    props?: DatePickerProps
    slots?: undefined
  }
  'dynamic-tags': {
    props?: DynamicTagsProps
    slots?: {
      input?: (info: { submit: (value: any) => void, deactivate: () => void }) => RawChildren
      trigger?: (info: { activate: () => void, disabled: boolean }) => RawChildren
    }
  }
  'input': {
    props?: InputProps
    slots?: {
      clearIcon?: () => RawChildren
      count?: (props: { value: string }) => RawChildren
      passwordInvisibleIcon?: () => RawChildren
      passwordVisibleIcon?: () => RawChildren
      prefix?: () => RawChildren
      separator?: () => RawChildren
      suffix?: () => RawChildren
    }

  }
  'input-number': {
    props?: InputNumberProps
    slots?: {
      addIcon?: () => RawChildren
      minusIcon?: () => RawChildren
      prefix?: () => RawChildren
      suffix?: () => RawChildren
    }
  }
  'search': {
    props?: SearchInputProps
    slots?: {
      prefix?: () => RawChildren
      prefixIcon?: () => RawChildren
      button?: (props: { value: string, loading: boolean }) => RawChildren
      buttonIcon?: () => RawChildren

    }
  }
  'radio': {
    props?: RadioGroupProps & { options?: RadioProps[] }
    slots?: {
      default?: () => RawChildren
    }
  }
  'rate': {
    props?: RateProps
    slots?: {
      default?: (info: { index: number }) => RawChildren
    }
  }
  'select': {
    props?: SelectProps
    slots?: {
      header?: () => RawChildren
      action?: () => RawChildren
      empty?: () => RawChildren
      arrow?: () => RawChildren
    }
  }
  'slider': {
    props?: SliderProps
    slots?: {
      thumb?: () => RawChildren
    }
  }
  'switch': {
    props?: SwitchProps
    slots?: {
      checked?: () => RawChildren
      checkedIcon?: () => RawChildren
      icon?: () => RawChildren
      unchecked?: () => RawChildren
      uncheckedIcon?: () => RawChildren
    }

  }
  'time-picker': {
    props?: TimePickerProps
    slots?: {
      icon?: () => RawChildren
    }

  }
}
export type PresetInputOptions = {
  [K in keyof PresetInputType]: {
    type?: K
    props?: PresetInputType[K]['props'] & ClassStyle
    slots?: PresetInputType[K]['slots']
  }
}[keyof PresetInputType]

export type PresetInputProps<V> = & {
  value?: V
  options?: PresetInputOptions
}
