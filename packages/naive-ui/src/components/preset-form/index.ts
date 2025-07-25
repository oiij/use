import type { FlexProps, FormItemProps, FormItemRule, FormProps, FormRules, GridItemProps, GridProps } from 'naive-ui'
import type { CSSProperties, VNode } from 'vue'
import type { NaiveFormClearRules, NaiveFormReturns, NaiveFormRules } from '../../composables/useNaiveForm'

import type { PresetInputOptions } from '../preset-input/index'

export type { NaiveFormRules } from '../../composables/useNaiveForm'
export { default as NPresetForm } from './PresetForm.vue'
export type PresetFormExposeRefs<V extends Record<string, any> = Record<string, any>> = Pick<NaiveFormReturns<V>, 'formValue' | 'formRef' | 'formRules'>
export type PresetFormExposeActions<V extends Record<string, any> = Record<string, any>> = Pick<NaiveFormReturns<V>, 'validate' | 'resetValidation' | 'resetForm' | 'reset' | 'clear' | 'onValidated'> & {
  setValues: (value: Partial<V>) => void
}
export type PresetFormOptions<V extends Record<string, any> = Record<string, any>> = (PresetInputOptions & {
  key?: keyof V
  label?: string | boolean |(FormItemProps & {
    style?: CSSProperties
    class?: string
  })
  rules?: FormRules | FormItemRule | FormItemRule[]
  collapsed?: boolean
  gridItemProps?: GridItemProps
  render?: (refs: PresetFormExposeRefs<V>, actions: PresetFormExposeActions<V>) => VNode
})[]
export interface PresetFormProps<V extends Record<string, any> = Record<string, any>> {
  options?: PresetFormOptions<V>
  values?: V
  rules?: NaiveFormRules<V>
  clearRules?: NaiveFormClearRules
  formProps?: FormProps
  gridProps?: GridProps
  flexProps?: FlexProps
  layout?: 'grid' | 'flex' | ['grid' | 'flex']
}
