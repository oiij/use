import type { FormItemProps, FormItemRule, FormProps, FormRules, GridItemProps, GridProps } from 'naive-ui'
import type { MaybeRefOrGetter, Ref, VNode } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject } from '../../composables/use-data-request'
import type { UseNaiveFormClearRules, UseNaiveFormReturns, UseNaiveFormRules } from '../../composables/use-naive-form'
import type { ClassStyle } from '../_utils/types'
import type { PresetFieldOptions, PresetFieldType } from '../preset-field/index'
import type PresetForm from './PresetForm.vue'

export type { UseNaiveFormRules } from '../../composables/use-naive-form'

export { default as NPresetForm } from './PresetForm.vue'

/**
 * 预设表单暴露的方法
 * @template V 表单值类型
 */
export type PresetFormExpose<V extends DataObject = DataObject> = UseNaiveFormReturns<V> & {
  /** 折叠区是否展开（可从外部读写） */
  collapsed: Ref<boolean>
}

/**
 * 表单透传属性
 * 已排除受控的 model / rules，避免覆盖表单内部状态
 */
export type PresetFormNativeProps = Omit<FormProps, 'model' | 'rules'> & ClassStyle

/**
 * 表单项透传属性
 * 已排除受控的 label / path / rule，避免覆盖表单项内部绑定
 */
export type PresetFormItemProps = Omit<FormItemProps & GridItemProps, 'label' | 'path' | 'rule'> & ClassStyle

/**
 * 预设表单选项项
 * @template V 表单值类型
 */
export type PresetFormOptionItem<V extends DataObject = DataObject> = PresetFieldOptions & {
  /** 输入类型 */
  type?: keyof PresetFieldType
  /** 字段键名 */
  key?: keyof V
  /** 标签 */
  label?: MaybeRefOrGetter<string>
  /** 是否必填 */
  required?: MaybeRefOrGetter<boolean>
  /** 是否折叠 */
  collapsed?: MaybeRefOrGetter<boolean>
  /** 跨度 */
  span?: MaybeRefOrGetter<string | number>
  /** 是否隐藏 */
  hidden?: MaybeRefOrGetter<boolean>
  /** 验证规则 */
  rule?: FormRules | FormItemRule | FormItemRule[]
  /** 表单项透传属性，受控字段不可覆盖 */
  itemProps?: PresetFormItemProps
  /** 自定义渲染函数 */
  render?: (params: PresetFormExpose<V> & { overflow: boolean }) => VNode | null
  /** 字段清空/空值，同时用于 PresetField 的 emptyValue 与表单 clear 的字段重置值 */
  emptyValue?: any
}

/**
 * 预设表单选项
 * @template V 表单值类型
 */
export type PresetFormOptions<V extends DataObject = DataObject> = PresetFormOptionItem<V>[]

/**
 * 预设表单属性
 * @template V 表单值类型
 */
export type PresetFormProps<V extends DataObject = DataObject> = {
  /** 表单选项 */
  options?: PresetFormOptions<V>
  /** 表单值 */
  values?: V
  /** 验证规则 */
  rules?: UseNaiveFormRules<V>
  /** 清空规则，支持按类型默认值、按字段名指定，或由字段选项的 emptyValue 汇总 */
  clearRules?: MaybeRefOrGetter<UseNaiveFormClearRules<V>>
  /** 表单透传属性，受控字段不可覆盖 */
  formProps?: PresetFormNativeProps
  /** 网格属性 */
  gridProps?: GridProps & ClassStyle
}

/**
 * 预设表单实例类型
 */
export type PresetFormInst = ComponentExposed<typeof PresetForm>
