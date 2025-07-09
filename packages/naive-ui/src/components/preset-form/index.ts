import type { FormProps, GridItemProps, GridProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { NaiveFormReturns, NaiveFormRules } from '../../composables'

import type { PresetInputOptions } from '../preset-input'

export type { NaiveFormRules } from '../../composables'
export { default as NPresetForm } from './PresetForm.vue'
export type PresetFormExposeRefs<V extends Record<string, any>> = Pick<NaiveFormReturns<V>, 'formValue' | 'formRef' | 'formRules' | 'formProps'> & {

}
export type PresetFormExposeActions<V extends Record<string, any>> = Pick<NaiveFormReturns<V>, 'validate' | 'resetValidation' | 'resetForm' | 'reset' | 'clear' | 'onValidated'> & {
  setValue: (value: Partial<V>) => void
}
export type PresetFormOptions<V extends Record<string, any>> = (PresetInputOptions & {
  key?: keyof V
  collapsed?: boolean
  gridItemProps?: GridItemProps
  render?: (refs: PresetFormExposeRefs<V>, actions: PresetFormExposeActions<V>) => VNode
})[]
export interface PresetFormProps<V extends Record<string, any> = Record<string, any>> {
  options?: PresetFormOptions<V>
  values?: V
  rules: NaiveFormRules<V>
  formProps?: FormProps
  gridProps?: GridProps
}
