<script setup lang='ts'
  generic="
    V extends DataObject,
  "
>
import type { DataObject } from '../../composables/useDataRequest'
import type { PresetFormExpose, PresetFormProps } from './index'
import { NButton, NCollapseTransition, NDivider, NForm, NFormItem, NFormItemGi, NGi, NGrid } from 'naive-ui'
import { computed, ref, toValue } from 'vue'
import { useNaiveForm } from '../../composables/useNaiveForm'
import { NPresetInput } from '../preset-input/index'
import { mergeRule } from './_utils'

const { options, values, rules, clearRules, formProps, gridProps } = defineProps<PresetFormProps<V>>()
const emit = defineEmits<{
  (e: 'validated', val: V): void
}>()

const { formValue, formRules, formRef, formProps: _formProps, setValue, validate, resetValidation, resetForm, reset, clear, onValidated } = useNaiveForm(values, {
  rules,
  clearRules,
})
onValidated((value) => {
  emit('validated', value)
})
const filterCollapsed = ref(false)

const _options = computed(() => {
  return options?.filter(f => typeof f.hidden === 'function' ? !f.hidden() : !f.hidden)
    .filter(f => typeof f.collapsed === 'function' ? !f.collapsed() : !f.collapsed)
})
const _collapsedOptions = computed(() => {
  return options?.filter(f => typeof f.hidden === 'function' ? !f.hidden() : !f.hidden)
    .filter(f => typeof f.collapsed === 'function' ? !f.collapsed() : f.collapsed)
})

function onPresetInputUpdate(val: any, key?: keyof V) {
  if (key) {
    setValue({ [key]: val } as V)
  }
}

const expose: PresetFormExpose<V> = {
  formRef,
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
    formRef: toValue(formRef),
    formValue: toValue(formValue),
    formRules: toValue(formRules),
    formProps: toValue(_formProps),
  }
})

defineExpose(expose)
</script>

<template>
  <NForm ref="formRef" :model="formValue" :rules="(formRules as any)" v-bind="formProps">
    <slot name="header" v-bind="templateBind" />
    <slot v-bind="templateBind">
      <template v-if="_options && _options.length > 0">
        <NGrid v-bind="gridProps">
          <NGi
            v-for="({ key, label, required, span, rule, itemProps: { offset, span: _span, suffix, ..._itemProps } = {}, render, ...opt }, _index) in _options"
            :key="_index"
            :span="typeof span === 'function' ? span() : span ?? _span"
            v-bind="{ offset, suffix }"
          >
            <template #default="{ overflow }">
              <NFormItem
                :label="typeof label === 'function' ? label() : label"
                :path="typeof key === 'string' ? key : undefined"
                :rule="mergeRule({ key, label, required, rule })"
                v-bind="_itemProps"
              >
                <component :is="render({ ...expose, overflow })" v-if="render" />
                <NPresetInput v-else :options="opt" :value="key ? formValue[key] : undefined" @update:value="(val) => onPresetInputUpdate(val, key)" />
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
              v-for="({ key, label, required, span, rule, itemProps: { offset, span: _span, suffix, ..._itemProps } = {}, render, ...opt }, _index) in _collapsedOptions"
              :key="_index"
              :span="typeof span === 'function' ? span() : span ?? _span"
              v-bind="{ offset, suffix }"
            >
              <template #default="{ overflow }">
                <NFormItem
                  :label="typeof label === 'function' ? label() : label"
                  :path="typeof key === 'string' ? key : undefined"
                  :rule="mergeRule({ key, label, required, rule })"
                  v-bind="_itemProps"
                >
                  <component :is="render({ ...expose, overflow })" v-if="render" />
                  <NPresetInput v-else :options="opt" :value="key ? formValue[key] : undefined" @update:value="(val) => onPresetInputUpdate(val, key)" />
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
