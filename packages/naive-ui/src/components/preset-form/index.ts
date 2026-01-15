import type { FormItemProps, FormItemRule, FormProps, FormRules, GridItemProps, GridProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject } from '../../composables/use-data-request'
import type { NaiveFormClearRules, NaiveFormReturns, NaiveFormRules } from '../../composables/use-naive-form'
import type { ClassStyle } from '../data-table-plus/index'
import type { PresetInputOptions } from '../preset-input/index'
import type PresetForm from './PresetForm.vue'

export type { NaiveFormRules } from '../../composables/use-naive-form'

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
  itemProps?: FormItemProps & GridItemProps & ClassStyle
  render?: (params: PresetFormExpose<V> & { overflow: boolean }) => VNode | null
}
export type PresetFormOptions<V extends DataObject = DataObject> = PresetFormOptionItem<V>[]

export type PresetFormProps<V extends DataObject = DataObject> = {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps & ClassStyle
  gridProps?: GridProps & ClassStyle
}

export type PresetFormInst = ComponentExposed<typeof PresetForm>
