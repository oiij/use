import type { ButtonProps, CheckboxGroupProps, CheckboxProps, ColorPickerProps, DatePickerProps, DividerProps, DynamicTagsOption, DynamicTagsProps, InputNumberProps, InputProps, RadioGroupProps, RadioProps, RateProps, SelectProps, SliderProps, SwitchProps, TimePickerProps } from 'naive-ui'
import type { VNode, VNodeArrayChildren } from 'vue'
import type { ClassStyle } from '../_utils/types'
import type { SearchInputProps } from '../search-input/index'

export { default as NPresetField } from './PresetField.vue'

type RawChildren = string | number | boolean | VNode | VNodeArrayChildren | (() => any)

/**
 * 预设字段类型
 */
export type PresetFieldType = {
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
 * 预设字段值类型映射
 * 描述每种输入类型对应的 value 类型，用于让 value 与 type 自动关联
 */
export type PresetFieldValueMap = {
  /** 按钮，无值 */
  'button': never
  /** 颜色选择器值 */
  'color-picker': string | null
  /** 复选框值 */
  'checkbox': Array<string | number> | null
  /** 分割线，无值 */
  'divider': never
  /** 日期选择器值：单日期时间戳或范围元组 */
  'date-picker': number | [number, number] | null
  /** 动态标签值 */
  'dynamic-tags': Array<string | DynamicTagsOption>
  /** 输入框值 */
  'input': string | null
  /** 数字输入框值 */
  'input-number': number | null
  /** 搜索框值 */
  'search': string | null
  /** 单选框值 */
  'radio': string | number | boolean | null
  /** 评分值 */
  'rate': number
  /** 选择器值 */
  'select': string | number | Array<string | number> | null
  /** 滑块值 */
  'slider': number | number[]
  /** 开关值 */
  'switch': boolean
  /** 时间选择器值 */
  'time-picker': number | null
}

type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never

/**
 * 预设字段选项配置
 * @template K 预设字段类型
 */
export type PresetFieldOption<K extends keyof PresetFieldType = keyof PresetFieldType> = {
  /** 透传属性，受控的 value / onUpdate:value 不可覆盖，默认 undefined */
  props?: DistributiveOmit<NonNullable<PresetFieldType[K]['props']>, 'value' | 'onUpdate:value' | 'onUpdateValue'> & ClassStyle
  /** 插槽，默认 undefined */
  slots?: PresetFieldType[K]['slots']
}

/**
 * 预设字段选项
 */
export type PresetFieldOptions = {
  [K in keyof PresetFieldType]: PresetFieldOption<K>
}[keyof PresetFieldType]

/**
 * 预设字段属性
 * @template K 预设字段类型，value 类型会随 type 自动关联
 */
export type PresetFieldProps<K extends keyof PresetFieldType = keyof PresetFieldType> = {
  /** 输入类型 */
  type?: K
  /** 值，类型由 type 决定 */
  value?: PresetFieldValueMap[K]
  /** 值为 undefined 时使用的空值，优先于该类型的内置空值 */
  emptyValue?: PresetFieldValueMap[K]
  /** 选项 */
  options?: PresetFieldOption<K>
}
