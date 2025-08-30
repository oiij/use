import type { FormItemGiProps, FormItemRule, FormProps, FormRules, GridProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { DataObject } from '../../composables/index'
import type { NaiveFormClearRules, NaiveFormReturns, NaiveFormRules } from '../../composables/useNaiveForm'
import type { ClassStyle } from '../data-table-plus'
import type { PresetInputOptions } from '../preset-input/index'

export type { NaiveFormRules } from '../../composables/useNaiveForm'
export { default as NPresetForm } from './PresetForm.vue'

export type PresetFormExpose<V extends DataObject = DataObject> = NaiveFormReturns<V>

export type PresetFormOptionItem<V extends DataObject = DataObject> = PresetInputOptions & {
  key?: keyof V
  label?: string | (() => string)
  required?: boolean | (() => boolean)
  collapsed?: boolean | (() => boolean)
  span?: string | number | (() => string | number)
  hidden?: boolean | (() => boolean)
  rule?: FormRules | FormItemRule | FormItemRule[]
  itemProps?: FormItemGiProps & ClassStyle
  render?: (params: PresetFormExpose<V>) => VNode | null
}
export type PresetFormOptions<V extends DataObject = DataObject> = PresetFormOptionItem<V>[]

export type PresetFormProps<V extends DataObject = DataObject> = & {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps & ClassStyle
  gridProps?: GridProps & ClassStyle
}
