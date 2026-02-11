import type { FormItemProps, FormItemRule, FormProps, FormRules, GridItemProps, GridProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject } from '../../composables/use-data-request'
import type { UseNaiveFormClearRules, UseNaiveFormReturns, UseNaiveFormRules } from '../../composables/use-naive-form'
import type { ClassStyle } from '../data-table-plus/index'
import type { PresetInputOptions } from '../preset-input/index'
import type PresetForm from './PresetForm.vue'

export type { UseNaiveFormRules } from '../../composables/use-naive-form'

export { default as NPresetForm } from './PresetForm.vue'

/**
 * 预设表单暴露的方法
 * @template V 表单值类型
 */
export type PresetFormExpose<V extends DataObject = DataObject> = UseNaiveFormReturns<V>

/**
 * 预设表单选项项
 * @template V 表单值类型
 */
export type PresetFormOptionItem<V extends DataObject = DataObject> = PresetInputOptions & {
  /** 字段键名 */
  key?: keyof V
  /** 标签 */
  label?: string | (() => string)
  /** 是否必填 */
  required?: boolean | (() => boolean)
  /** 是否折叠 */
  collapsed?: boolean | (() => boolean)
  /** 跨度 */
  span?: string | number | (() => string | number)
  /** 是否隐藏 */
  hidden?: boolean | (() => boolean)
  /** 验证规则 */
  rule?: FormRules | FormItemRule | FormItemRule[]
  /** 表单项属性 */
  itemProps?: FormItemProps & GridItemProps & ClassStyle
  /** 自定义渲染函数 */
  render?: (params: PresetFormExpose<V> & { overflow: boolean }) => VNode | null
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
  value?: V
  /** 验证规则 */
  rules?: UseNaiveFormRules<V>
  /** 清空规则 */
  clearRules?: UseNaiveFormClearRules
  /** 表单属性 */
  formProps?: FormProps & ClassStyle
  /** 网格属性 */
  gridProps?: GridProps & ClassStyle
}

/**
 * 预设表单实例类型
 */
export type PresetFormInst = ComponentExposed<typeof PresetForm>
