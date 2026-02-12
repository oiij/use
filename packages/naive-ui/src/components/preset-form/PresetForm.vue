<script setup lang='ts' generic=" V extends DataObject">
import type { FormInst, FormRules } from 'naive-ui'
import type { DataObject } from '../../composables/use-data-request'
import type { PresetFormExpose, PresetFormOptionItem, PresetFormProps } from './index'
import { NButton, NCollapseTransition, NDivider, NForm, NFormItem, NGi, NGrid } from 'naive-ui'
import { computed, ref, useTemplateRef } from 'vue'
import { useNaiveForm } from '../../composables/use-naive-form'
import { NPresetInput } from '../preset-input/index'
import { mergeRule } from './_utils'

const { options, value, rules, clearRules, formProps, gridProps } = defineProps<PresetFormProps<V>>()
const emit = defineEmits<{
  (e: 'validated', val: V): void
}>()

const { formValue, formRules, formInst, formProps: _formProps, setValue, validate, resetValidation, resetForm, reset, clear, onValidated } = useNaiveForm(useTemplateRef<FormInst>('form-ref'), {
  value,
  rules,
  clearRules,
})
onValidated((value) => {
  emit('validated', value)
})
const filterCollapsed = ref(false)

const visibleOptions = computed(() => {
  return options?.filter(f => typeof f.hidden === 'function' ? !f.hidden() : !f.hidden) || []
})

const _options = computed(() => {
  return visibleOptions.value.filter(f => typeof f.collapsed === 'function' ? !f.collapsed() : !f.collapsed)
})

const _collapsedOptions = computed(() => {
  return visibleOptions.value.filter(f => typeof f.collapsed === 'function' ? f.collapsed() : f.collapsed)
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
      label: typeof label === 'function' ? label() : label,
      span: typeof span === 'function' ? span() : span ?? itemProps?.span,
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
  formValue,
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
    formValue: formValue.value,
    formRules: formRules.value,
    formProps: _formProps,
  }
})

defineExpose(expose)
</script>

<template>
  <NForm ref="form-ref" :model="formValue" :rules="formRules as FormRules" v-bind="formProps">
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
                <NPresetInput v-else :options="inputOption" :value="key ? formValue[key] : undefined" @update:value="(val?:V[keyof V]) => onPresetInputUpdate(val, key)" />
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
                  <NPresetInput v-else :options="inputOption" :value="key ? formValue[key] : undefined" @update:value="(val?:V[keyof V]) => onPresetInputUpdate(val, key)" />
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
