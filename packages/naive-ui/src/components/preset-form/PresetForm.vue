<script setup lang='ts'
  generic="
    V extends DataObject,
  "
>
import type { DataObject } from '../../composables/index'
import type { PresetFormExpose, PresetFormProps } from './index'
import { NButton, NCollapseTransition, NDivider, NForm, NFormItemGi, NGrid } from 'naive-ui'
import { computed, ref, toValue } from 'vue'
import { useNaiveForm } from '../../composables/index'
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

const _options = computed(() => options?.filter(f => typeof f.hidden === 'function' ? !f.hidden() : !f.hidden).filter(f => typeof f.collapsed === 'function' ? !f.collapsed() : !f.collapsed))
const _collapsedOptions = computed(() => options?.filter(f => typeof f.hidden === 'function' ? !f.hidden() : !f.hidden).filter(f => typeof f.collapsed === 'function' ? !f.collapsed() : f.collapsed))

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
          <NFormItemGi
            v-for="({ key, label, required, span, rule, props, render, ...opt }, _index) in _options"
            :key="_index"
            :label="typeof label === 'function' ? label() : label"
            :span="typeof span === 'function' ? span() : span"
            :path="typeof key === 'string' ? key : undefined"
            :rule="mergeRule({ key, label, required, rule })"
            v-bind="props"
          >
            <component :is="render(expose)" v-if="render" />
            <NPresetInput v-else :options="opt" :value="key ? formValue[key] : undefined" @update:value="(val) => onPresetInputUpdate(val, key)" />
          </NFormItemGi>
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
            <NFormItemGi
              v-for="({ key, label, required, span, rule, props, render, ...opt }, _index) in _collapsedOptions"
              :key="_index"
              :label="typeof label === 'function' ? label() : label"
              :span="typeof span === 'function' ? span() : span"
              :path="typeof key === 'string' ? key : undefined"
              :rule="mergeRule({ key, label, required, rule })"
              v-bind="props"
            >
              <component :is="render(expose)" v-if="render" />
              <NPresetInput v-else :options="opt" :value="key ? formValue[key] : undefined" @update:value="(val) => onPresetInputUpdate(val, key)" />
            </NFormItemGi>
          </NGrid>
        </NCollapseTransition>
      </template>
    </slot>
    <slot name="footer" v-bind="templateBind" />
  </NForm>
</template>

<style scoped>

</style>
