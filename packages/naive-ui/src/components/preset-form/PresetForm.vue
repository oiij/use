<script setup lang='ts' generic=" V extends DataObject">
import type { FormInst, FormRules } from 'naive-ui'
import type { DataObject } from '../../composables/use-data-request'
import type { PresetFormExpose, PresetFormOptionItem, PresetFormProps } from './index'
import { NButton, NCollapseTransition, NDivider, NForm, NFormItem, NGi, NGrid } from 'naive-ui'
import { computed, ref, toValue, useTemplateRef } from 'vue'
import { useNaiveForm } from '../../composables/use-naive-form'
import { NPresetInput } from '../preset-input/index'
import { mergeRule } from './_utils'

const { options, values, rules, clearRules, formProps, gridProps } = defineProps<PresetFormProps<V>>()
const emit = defineEmits<{
  (e: 'validated', val: V): void
}>()

const { formValues, formRules, formInst, formProps: _formProps, setValue, validate, resetValidation, resetForm, reset, clear, onValidated } = useNaiveForm(useTemplateRef<FormInst>('form-ref'), {
  values,
  rules,
  clearRules,
})
onValidated((value) => {
  emit('validated', value)
})
const filterCollapsed = ref(false)

const visibleOptions = computed(() => {
  return options?.filter(f => !toValue(f.hidden)) || []
})

const _options = computed(() => {
  return visibleOptions.value.filter(f => !toValue(f.collapsed))
})

const _collapsedOptions = computed(() => {
  return visibleOptions.value.filter(f => toValue(f.collapsed))
})

function onPresetInputUpdate(val: any, key?: keyof V) {
  if (key) {
    setValue({ [key]: val } as V)
  }
}
function presetFormProps(options: PresetFormOptionItem<V>[]) {
  return options.map((option) => {
    const { key, label, required, span, rule, itemProps, render, ...inputOption } = option
    const { offset, suffix, ...extraItemProps } = itemProps ?? {}
    return {
      key: typeof key === 'string' ? key : undefined,
      label: toValue(label),
      span: toValue(span) ?? itemProps?.span,
      required,
      rule,
      offset,
      suffix,
      itemProps: extraItemProps,
      render,
      inputOption,
    }
  })
}
const expose: PresetFormExpose<V> = {
  formInst,
  formValues,
  formRules,
  formProps: _formProps,
  setValue,
  validate,
  resetValidation,
  resetForm,
  reset,
  clear,
  onValidated,
}

const templateBind = computed(() => {
  return {
    ...expose,
    formInst: formInst.value,
    formValues: formValues.value,
    formRules: formRules.value,
    formProps: _formProps,
  }
})

defineExpose(expose)
</script>

<template>
  <NForm ref="form-ref" :model="formValues" :rules="formRules as FormRules" v-bind="formProps">
    <slot name="header" v-bind="templateBind" />
    <slot v-bind="templateBind">
      <template v-if="_options && _options.length > 0">
        <NGrid v-bind="gridProps">
          <NGi
            v-for="({ span, offset, suffix, label, key, required, rule, itemProps, render, inputOption }, index) in presetFormProps(_options)"
            :key="index"
            :span="span"
            v-bind="{ offset, suffix }"
          >
            <template #default="{ overflow }">
              <NFormItem
                :label=" label"
                :path="key"
                :rule="mergeRule({ key, label, required, rule })"
                v-bind="itemProps"
              >
                <component :is="render({ ...expose, overflow })" v-if="render" />
                <NPresetInput v-else :options="inputOption" :value="key ? formValues[key] : undefined" @update:value="(val?:V[keyof V]) => onPresetInputUpdate(val, key)" />
              </NFormItem>
            </template>
          </NGi>
        </NGrid>
      </template>
      <template v-if="_collapsedOptions && _collapsedOptions.length > 0">
        <NDivider :style="{ margin: '5px 0' }">
          <NButton size="tiny" @click="filterCollapsed = !filterCollapsed">
            {{ filterCollapsed ? '折叠' : '展开' }}
          </NButton>
        </NDivider>
        <NCollapseTransition :show="filterCollapsed">
          <NGrid v-bind="gridProps">
            <NGi
              v-for="({ span, offset, suffix, label, key, required, rule, itemProps, render, inputOption }, index) in presetFormProps(_collapsedOptions)"
              :key="index"
              :span="span"
              v-bind="{ offset, suffix }"
            >
              <template #default="{ overflow }">
                <NFormItem
                  :label=" label"
                  :path="key"
                  :rule="mergeRule({ key, label, required, rule })"
                  v-bind="itemProps"
                >
                  <component :is="render({ ...expose, overflow })" v-if="render" />
                  <NPresetInput v-else :options="inputOption" :value="key ? formValues[key] : undefined" @update:value="(val?:V[keyof V]) => onPresetInputUpdate(val, key)" />
                </NFormItem>
              </template>
            </NGi>
          </NGrid>
        </NCollapseTransition>
      </template>
    </slot>
    <slot name="footer" v-bind="templateBind" />
  </NForm>
</template>

<style scoped>

</style>
