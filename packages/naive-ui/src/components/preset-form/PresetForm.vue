<script setup lang='ts' generic=" V extends DataObject">
import type { FormInst, FormRules } from 'naive-ui'
import type { DataObject } from '../../composables/use-data-request'
import type { UseNaiveFormClearRules } from '../../composables/use-naive-form'
import type { PresetFormExpose, PresetFormProps } from './index'
import { NButton, NCollapseTransition, NDivider, NForm, NFormItem, NGi, NGrid } from 'naive-ui'
import { computed, ref, toValue, useTemplateRef } from 'vue'
import { useNaiveForm } from '../../composables/use-naive-form'
import { createExpose } from '../_utils/expose'
import { NPresetField } from '../preset-field/index'
import { mergeRule } from './_utils'
import { usePresetFormOptions } from './use-preset-form-options'

const { options, values, rules, clearRules, formProps, gridProps } = defineProps<PresetFormProps<V>>()
const emit = defineEmits<{
  (e: 'validated', val: V): void
}>()

const mergedClearRules = computed<UseNaiveFormClearRules<V>>(() => {
  const rules = { ...toValue(clearRules) } as Record<string, unknown>
  for (const option of options ?? []) {
    if (typeof option.key === 'string' && option.emptyValue !== undefined)
      rules[option.key] = option.emptyValue
  }
  return rules as UseNaiveFormClearRules<V>
})

const { formValues, formRules, formInst, formProps: _formProps, dirty, setValue, validate, validateField, updateCache, resetValidation, resetForm, reset, clear, onValidated, onUpdateValue } = useNaiveForm(useTemplateRef<FormInst>('form-ref'), {
  values,
  rules,
  clearRules: mergedClearRules,
})
onValidated((value) => {
  emit('validated', value)
})

const collapsed = ref(false)

const { normalRenderProps: _optionsRenderProps, collapsedRenderProps: _collapsedRenderProps } = usePresetFormOptions<V>(() => options)

const expose: PresetFormExpose<V> = {
  // 状态
  formInst,
  formValues,
  formRules,
  formProps: _formProps,
  dirty,
  // 方法
  setValue,
  validate,
  validateField,
  updateCache,
  resetValidation,
  resetForm,
  reset,
  clear,
  // 事件
  onValidated,
  onUpdateValue,
  // 组件特有
  collapsed,
}

const { slotProps } = createExpose(expose)

function createRenderArgs(overflow: any) {
  return { ...expose, overflow }
}

function onPresetFieldUpdate(val: any, key?: keyof V) {
  if (key) {
    setValue({ [key]: val } as V)
  }
}

defineExpose(expose)
</script>

<template>
  <NForm ref="form-ref" v-bind="formProps" :model="formValues" :rules="formRules as FormRules">
    <slot v-if="$slots.header" name="header" v-bind="slotProps" />
    <slot v-bind="slotProps">
      <template v-for="[group, wrapped] in [[_optionsRenderProps, false], [_collapsedRenderProps, true]]" :key="wrapped ? 'collapsed' : 'normal'">
        <template v-if="group.length">
          <NDivider v-if="wrapped" :style="{ margin: '5px 0' }">
            <NButton size="tiny" @click="collapsed = !collapsed">
              {{ collapsed ? '折叠' : '展开' }}
            </NButton>
          </NDivider>
          <NCollapseTransition :key="group.map(i => [i.key, i.label, i.required, i.span].join(':')).join('|')" :show="wrapped ? collapsed : true">
            <NGrid v-bind="gridProps">
              <NGi
                v-for="{ span, offset, suffix, label, key, rule, itemProps, render, inputOption, rawKey, required, type, emptyValue } in group"
                :key="String(rawKey)"
                :span="span"
                v-bind="{ offset, suffix }"
              >
                <template #default="{ overflow }">
                  <NFormItem
                    v-bind="itemProps"
                    :label="label"
                    :path="key"
                    :rule="mergeRule({ key, label, required, rule })"
                  >
                    <component :is="render(createRenderArgs(overflow))" v-if="render" />
                    <NPresetField v-else :type="type" :empty-value="emptyValue" :options="inputOption" :value="rawKey ? formValues[rawKey as keyof V] : undefined" @update:value="(val?: unknown) => onPresetFieldUpdate(val, rawKey as keyof V)" />
                  </NFormItem>
                </template>
              </NGi>
            </NGrid>
          </NCollapseTransition>
        </template>
      </template>
    </slot>
    <slot v-if="$slots.footer" name="footer" v-bind="slotProps" />
  </NForm>
</template>
