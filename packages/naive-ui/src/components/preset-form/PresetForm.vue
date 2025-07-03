<script setup lang='ts'
generic="
  V extends Record<string, any>
  "
>
import type { FormProps, GridProps } from 'naive-ui'
import type { PresetFormOptions } from '.'
import type { NaiveFormRules } from '../../composables'
import { NForm, NGi, NGrid } from 'naive-ui'
import { NPresetInput } from '..'
import { useNaiveForm } from '../../composables'

const { options, values, rules, formProps: defaultProps, gridProps } = defineProps<{
  options?: PresetFormOptions<V>
  values?: V
  rules: NaiveFormRules<V>
  formProps?: FormProps
  gridProps?: GridProps
}>()
const emit = defineEmits<{
  (e: 'validated', val: V): void
}>()
const { formProps, formValue, formRules, formRef, validate, resetValidation, resetForm, reset, clear, onValidated } = useNaiveForm(values, {
  rules,
})
onValidated((value) => {
  emit('validated', value)
})
const exposeRefs = {
  formRef,
  formValue,
  formRules,
  formProps,
}
const exposeActions = {
  validate,
  resetValidation,
  resetForm,
  reset,
  clear,
  onValidated,
  setValue: (value: Partial<V>) => {
    Object.assign(formValue.value, value)
  },
}
defineExpose({
  refs: exposeRefs,
  actions: exposeActions,
})
function onPresetInputUpdate(val: any, key?: keyof V) {
  if (key) {
    exposeActions.setValue({ [key]: val } as V)
  }
}
</script>

<template>
  <NForm v-bind="{ ...(formProps as any), ...defaultProps }">
    <slot name="header" />
    <slot :refs="exposeRefs" :actions="exposeActions">
      <NGrid v-bind="gridProps">
        <NGi
          v-for="({ key, gridItemProps, render, ...opt }, _index) in options"
          :key="_index"
          :span="12"
          v-bind="gridItemProps"
        >
          <component :is="render(exposeRefs, exposeActions)" v-if="render" />
          <NPresetInput
            v-else
            :options="opt"
            :path="(key as string)"
            :value="key ? formValue[key] : undefined"
            @update:value="(val) => onPresetInputUpdate(val, key)"
          />
        </NGi>
      </NGrid>
    </slot>
    <slot name="footer" />
  </NForm>
</template>

<style scoped>

</style>
