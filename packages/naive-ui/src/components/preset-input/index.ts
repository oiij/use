import type { ButtonProps, CheckboxGroupProps, CheckboxProps, ColorPickerProps, DatePickerProps, DividerProps, DynamicTagsProps, InputNumberProps, InputProps, RadioGroupProps, RadioProps, RateProps, SelectProps, SliderProps, SwitchProps, TimePickerProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { ClassStyle } from '../data-table-plus'
import type { SearchInputProps } from '../search-input/index'

export { default as NPresetInput } from './PresetInput.vue'

export type PresetInputType = & {
  'button': {
    props?: ButtonProps & { label?: string }
    slots?: {
      default?: () => VNode
      icon?: () => VNode
    }
  }
  'color-picker': {
    props?: ColorPickerProps
    slots?: {
      label?: (color: string | null) => VNode
      action?: () => VNode
    }
  }
  'checkbox': {
    props?: CheckboxGroupProps & { options?: CheckboxProps[] }
    slots?: {
      default?: () => VNode
    }
  }
  'divider': {
    props?: DividerProps
    slots?: {
      default?: () => VNode
    }
  }
  'date-picker': {
    props?: DatePickerProps
    slots?: undefined
  }
  'dynamic-tags': {
    props?: DynamicTagsProps
    slots?: {
      input?: (info: { submit: (value: any) => void, deactivate: () => void }) => VNode
      trigger?: (info: { activate: () => void, disabled: boolean }) => VNode
    }
  }
  'input': {
    props?: InputProps
    slots?: {
      clearIcon?: () => VNode
      count?: (props: { value: string }) => VNode
      passwordInvisibleIcon?: () => VNode
      passwordVisibleIcon?: () => VNode
      prefix?: () => VNode
      separator?: () => VNode
      suffix?: () => VNode
    }

  }
  'input-number': {
    props?: InputNumberProps
    slots?: {
      addIcon?: () => VNode
      minusIcon?: () => VNode
      prefix?: () => VNode
      suffix?: () => VNode
    }
  }
  'search': {
    props?: SearchInputProps
    slots?: {
      prefix?: () => VNode
      prefixIcon?: () => VNode
      button?: (props: { value: string, loading: boolean }) => VNode
      buttonIcon?: () => VNode

    }
  }
  'radio': {
    props?: RadioGroupProps & { options?: RadioProps[] }
    slots?: {
      default?: () => VNode
    }
  }
  'rate': {
    props?: RateProps
    slots?: {
      default?: (info: { index: number }) => VNode
    }
  }
  'select': {
    props?: SelectProps
    slots?: {
      header?: () => VNode
      action?: () => VNode
      empty?: () => VNode
      arrow?: () => VNode
    }
  }
  'slider': {
    props?: SliderProps
    slots?: {
      thumb?: () => VNode
    }
  }
  'switch': {
    props?: SwitchProps
    slots?: {
      checked?: () => VNode
      checkedIcon?: () => VNode
      icon?: () => VNode
      unchecked?: () => VNode
      uncheckedIcon?: () => VNode
    }

  }
  'time-picker': {
    props?: TimePickerProps
    slots?: {
      icon?: () => VNode
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
