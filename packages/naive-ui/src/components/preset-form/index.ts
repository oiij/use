import type { GridItemProps } from 'naive-ui'
import type { VNode } from 'vue'
import type { NaiveFormReturns } from '../../composables'
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
  gridItemProps?: GridItemProps
  render?: (refs: PresetFormExposeRefs<V>, actions: PresetFormExposeActions<V>) => VNode
})[]
