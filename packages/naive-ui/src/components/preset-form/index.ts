import type { FlexProps, FormItemProps, FormItemRule, FormProps, FormRules, GridItemProps, GridProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { NaiveFormClearRules, NaiveFormReturns, NaiveFormRules } from '../../composables/useNaiveForm'
import type { ClassStyle } from '../data-table-plus'
import type { PresetInputOptions } from '../preset-input/index'

export type { NaiveFormRules } from '../../composables/useNaiveForm'
export { default as NPresetForm } from './PresetForm.vue'
export type PresetFormExposeRefs<V extends Record<string, any> = Record<string, any>> = Pick<NaiveFormReturns<V>, 'formValue' | 'formRef' | 'formRules'>
export type PresetFormExposeActions<V extends Record<string, any> = Record<string, any>> = Pick<NaiveFormReturns<V>, 'validate' | 'resetValidation' | 'resetForm' | 'reset' | 'clear' | 'onValidated'> & {
  setValues: (value: Partial<V>) => void
}
export type PresetFormOptionsItem<V extends Record<string, any> = Record<string, any>> = PresetInputOptions & {
  key?: keyof V
  label?: string | boolean | FormItemProps & ClassStyle
  rules?: FormRules | FormItemRule | FormItemRule[]
  required?: boolean
  collapsed?: boolean
  hidden?: boolean | ((refs: PresetFormExposeRefs<V>) => boolean)
  gridSpan?: string | number
  gridItemProps?: GridItemProps & ClassStyle
  render?: (refs: PresetFormExposeRefs<V>, actions: PresetFormExposeActions<V>) => VNode | null
}
export type PresetFormOptions<V extends Record<string, any> = Record<string, any>> = PresetFormOptionsItem<V>[]

export type PresetFormProps<V extends Record<string, any> = Record<string, any>> = & {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps & ClassStyle
  gridProps?: GridProps & ClassStyle
  flexProps?: FlexProps & ClassStyle
  layout?: 'grid' | 'flex' | ['grid' | 'flex']
}
