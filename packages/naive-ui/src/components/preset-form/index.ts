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

export type PresetFormExpose<V extends DataObject = DataObject> = UseNaiveFormReturns<V>

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
  value?: V
  rules?: UseNaiveFormRules<V>
  clearRules?: UseNaiveFormClearRules
  formProps?: FormProps & ClassStyle
  gridProps?: GridProps & ClassStyle
}

export type PresetFormInst = ComponentExposed<typeof PresetForm>
