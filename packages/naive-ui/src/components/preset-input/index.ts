import type { ButtonProps, CheckboxGroupProps, CheckboxProps, ColorPickerProps, DatePickerProps, DividerProps, DynamicTagsProps, InputNumberProps, InputProps, RadioGroupProps, RadioProps, RateProps, SelectProps, SliderProps, SwitchProps, TimePickerProps } from 'naive-ui'
import type { VNode, VNodeArrayChildren } from 'vue'
import type { ClassStyle } from '../data-table-plus/index'
import type { SearchInputProps } from '../search-input/index'

export { default as NPresetInput } from './PresetInput.vue'

type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any)

/**
 * 预设输入类型
 */
export type PresetInputType = {
  /** 按钮 */
  'button': {
    /** 属性 */
    props?: ButtonProps & { label?: string }
    /** 插槽 */
    slots?: {
      default?: () => RawChildren
      icon?: () => RawChildren
    }
  }
  /** 颜色选择器 */
  'color-picker': {
    props?: ColorPickerProps
    slots?: {
      label?: (color: string | null) => RawChildren
      action?: () => RawChildren
    }
  }
  /** 复选框 */
  'checkbox': {
    props?: CheckboxGroupProps & { options?: CheckboxProps[] }
    slots?: {
      default?: () => RawChildren
    }
  }
  /** 分割线 */
  'divider': {
    props?: DividerProps
    slots?: {
      default?: () => RawChildren
    }
  }
  /** 日期选择器 */
  'date-picker': {
    props?: DatePickerProps
    slots?: undefined
  }
  /** 动态标签 */
  'dynamic-tags': {
    props?: DynamicTagsProps
    slots?: {
      input?: (info: { submit: (value: any) => void, deactivate: () => void }) => RawChildren
      trigger?: (info: { activate: () => void, disabled: boolean }) => RawChildren
    }
  }
  /** 输入框 */
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
  /** 数字输入框 */
  'input-number': {
    props?: InputNumberProps
    slots?: {
      addIcon?: () => RawChildren
      minusIcon?: () => RawChildren
      prefix?: () => RawChildren
      suffix?: () => RawChildren
    }
  }
  /** 搜索框 */
  'search': {
    props?: SearchInputProps
    slots?: {
      prefix?: () => RawChildren
      prefixIcon?: () => RawChildren
      button?: (props: { value: string, loading: boolean }) => RawChildren
      buttonIcon?: () => RawChildren
    }
  }
  /** 单选框 */
  'radio': {
    props?: RadioGroupProps & { options?: RadioProps[] }
    slots?: {
      default?: () => RawChildren
    }
  }
  /** 评分 */
  'rate': {
    props?: RateProps
    slots?: {
      default?: (info: { index: number }) => RawChildren
    }
  }
  /** 选择器 */
  'select': {
    props?: SelectProps
    slots?: {
      header?: () => RawChildren
      action?: () => RawChildren
      empty?: () => RawChildren
      arrow?: () => RawChildren
    }
  }
  /** 滑块 */
  'slider': {
    props?: SliderProps
    slots?: {
      thumb?: () => RawChildren
    }
  }
  /** 开关 */
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
  /** 时间选择器 */
  'time-picker': {
    props?: TimePickerProps
    slots?: {
      icon?: () => RawChildren
    }
  }
}

/**
 * 预设输入选项
 */
export type PresetInputOptions = {
  [K in keyof PresetInputType]: {
    /** 类型 */
    type?: K
    /** 属性 */
    props?: PresetInputType[K]['props'] & ClassStyle
    /** 插槽 */
    slots?: PresetInputType[K]['slots']
  }
}[keyof PresetInputType]

/**
 * 预设输入属性
 * @template V 值类型
 */
export type PresetInputProps<V> = {
  /** 值 */
  value?: V
  /** 选项 */
  options?: PresetInputOptions
}
