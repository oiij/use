import type { Component } from 'vue'
import type { PresetFieldType } from './index'
import { NButton, NCheckbox, NCheckboxGroup, NColorPicker, NDatePicker, NDivider, NDynamicTags, NInput, NInputNumber, NRadio, NRadioGroup, NRate, NSelect, NSlider, NSwitch, NTimePicker } from 'naive-ui'
import { h } from 'vue'
import { NSearchInput } from '../search-input/index'

/**
 * 预设字段渲染配置
 */
export type PresetFieldConfig = {
  /** 渲染的组件 */
  component: Component
  /** 是否绑定 value / onUpdate:value，默认 true */
  bindValue?: boolean
  /** 值为 undefined 时使用的空值，默认 undefined */
  emptyValue?: any
  /** 透传属性处理函数，默认 undefined */
  resolveProps?: (props: Record<string, any>) => Record<string, any>
  /** 值预处理函数，默认 undefined */
  resolveValue?: (value: any) => any
  /** 插槽处理函数，默认 undefined */
  resolveSlots?: (ctx: { props?: Record<string, any>, slots?: Record<string, any> }) => Record<string, any> | undefined
}

export const presetFieldConfigs: Record<keyof PresetFieldType, PresetFieldConfig> = {
  'button': {
    component: NButton,
    bindValue: false,
    resolveProps: ({ label: _label, ...props }) => props,
    resolveSlots: ({ props, slots }) => ({ default: () => props?.label, ...slots }),
  },
  'color-picker': { component: NColorPicker, emptyValue: null },
  'checkbox': {
    component: NCheckboxGroup,
    emptyValue: [],
    resolveProps: ({ options: _options, ...props }) => props,
    resolveSlots: ({ props, slots }) => ({ default: () => props?.options?.map((option: any) => h(NCheckbox, { ...option })), ...slots }),
  },
  'divider': { component: NDivider, bindValue: false },
  'date-picker': {
    component: NDatePicker,
    emptyValue: null,
    resolveValue: value => (Array.isArray(value) && value.length === 0 ? null : value),
  },
  'dynamic-tags': { component: NDynamicTags, emptyValue: [] },
  'input': { component: NInput, emptyValue: null },
  'input-number': { component: NInputNumber, emptyValue: null },
  'radio': {
    component: NRadioGroup,
    emptyValue: null,
    resolveProps: ({ options: _options, ...props }) => props,
    resolveSlots: ({ props, slots }) => ({ default: () => props?.options?.map((option: any) => h(NRadio, { ...option })), ...slots }),
  },
  'rate': { component: NRate, emptyValue: 0 },
  'search': { component: NSearchInput, emptyValue: null },
  'select': { component: NSelect, emptyValue: null },
  'slider': { component: NSlider, emptyValue: null },
  'switch': { component: NSwitch, emptyValue: false },
  'time-picker': { component: NTimePicker, emptyValue: null },
}

/**
 * 解析字段组件的绑定属性与插槽
 * 受控的 value / onUpdate:value 最后写入，避免被透传属性覆盖
 * @param config 字段渲染配置
 * @param options 值、空值、透传属性、插槽与更新回调
 * @param options.value 当前值
 * @param options.emptyValue 空值覆盖
 * @param options.props 透传属性
 * @param options.slots 透传插槽
 * @param options.onUpdateValue 值更新回调
 * @returns bindings 组件绑定属性，slots 合并后的插槽
 * @example
 * ```ts
 * const { bindings, slots } = resolveFieldBindings(config, {
 *   value: props.value,
 *   emptyValue: props.emptyValue,
 *   props: options?.props,
 *   onUpdateValue: val => emit('update:value', val),
 * })
 * ```
 */
export function resolveFieldBindings(config: PresetFieldConfig, options: {
  /** 当前值，默认 undefined */
  value?: any
  /** 空值覆盖，默认 undefined */
  emptyValue?: any
  /** 透传属性，默认 undefined */
  props?: Record<string, any>
  /** 透传插槽，默认 undefined */
  slots?: Record<string, any>
  /** 值更新回调，默认 undefined */
  onUpdateValue?: (val: any) => void
} = {}) {
  const { value, emptyValue, props, slots, onUpdateValue } = options
  const rawProps = props ?? {}
  const mergedProps = config.resolveProps ? config.resolveProps(rawProps) : rawProps
  const resolvedValue = config.resolveValue ? config.resolveValue(value) : value
  const fallbackValue = emptyValue === undefined ? config.emptyValue : emptyValue

  const bindings: Record<string, any> = config.bindValue === false
    ? { ...mergedProps }
    : {
        ...mergedProps,
        'value': resolvedValue === undefined ? (fallbackValue ?? null) : resolvedValue,
        'onUpdate:value': onUpdateValue,
      }

  const mergedSlots = config.resolveSlots
    ? config.resolveSlots({ props: rawProps, slots })
    : slots

  return { bindings, slots: mergedSlots }
}
