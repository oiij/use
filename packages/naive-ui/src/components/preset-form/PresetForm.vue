<script setup lang='ts'
  generic="
    V extends RObject,
  "
>
import type { NaiveFormRules } from '../../composables/useNaiveForm'
import type { RObject } from '../remote-request/index'
import type { PresetFormProps } from './index'
import { NButton, NCollapseTransition, NDivider, NFlex, NForm, NGi, NGrid } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { useNaiveForm } from '../../composables/useNaiveForm'
import { renderLabel } from '../preset-input/_utils'
import { NPresetInput } from '../preset-input/index'
import { options2Rules } from './_utils'

const { options, values, rules, clearRules, formProps, gridProps, flexProps, layout = 'grid' } = defineProps<PresetFormProps<V>>()
const emit = defineEmits<{
  (e: 'validated', val: V): void
}>()
const _layout = computed(() => {
  const _layout = typeof layout === 'string' ? [layout, layout] : layout
  return {
    grid: _layout[0] === 'grid',
    flex: _layout[0] === 'flex',
    collapsedGrid: _layout[1] === 'grid',
    collapsedFlex: _layout[1] === 'flex',
  }
})

const { formValue, formRules, formRef, validate, resetValidation, resetForm, reset, clear, onValidated } = useNaiveForm(values, {
  rules: {
    ...rules,
    ...options2Rules(options),
  } as NaiveFormRules<V>,
  clearRules,
})
onValidated((value) => {
  emit('validated', value)
})
const filterCollapsed = ref(false)

const exposeRefs = {
  formRef,
  formValue,
  formRules,
}
const exposeActions = {
  validate,
  resetValidation,
  resetForm,
  reset,
  clear,
  onValidated,
  setValues: (value: Partial<V>) => {
    Object.assign(formValue.value, value)
  },
}
const _options = computed(() => options?.filter(f => typeof f.hidden === 'function' ? !f.hidden(exposeRefs) : !f.hidden).filter(f => !f.collapsed))
const _collapsedOptions = computed(() => options?.filter(f => typeof f.hidden === 'function' ? !f.hidden(exposeRefs) : !f.hidden).filter(f => f.collapsed))

defineExpose({
  refs: exposeRefs,
  actions: exposeActions,
})
function onPresetInputUpdate(val: any, key?: keyof V) {
  if (key) {
    exposeActions.setValues({ [key]: val } as V)
  }
}
</script>

<template>
  <NForm ref="formRef" :model="formValue" :rules="(formRules as any)" v-bind="formProps">
    <slot name="header" :refs="exposeRefs" :actions="exposeActions" />
    <slot :refs="exposeRefs" :actions="exposeActions">
      <NGrid v-if="_layout.grid && _options && _options.length > 0" v-bind="gridProps">
        <NGi
          v-for="({ key, gridSpan, gridItemProps, render, label, ...opt }, _index) in _options"
          :key="_index"
          :span="gridSpan"
          v-bind="gridItemProps"
        >
          <component :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string })" v-if="render" />
          <component
            :is="renderLabel(
              h(NPresetInput, {
                'options': opt,
                'value': key ? formValue[key] : undefined,
                'onUpdate:value': (val) => onPresetInputUpdate(val, key),
              }),
              label,
              { path: key as string })"
            v-else
          />
        </NGi>
      </NGrid>
      <NFlex v-if="_layout.flex && _options && _options.length > 0" v-bind="flexProps">
        <template
          v-for="({ key, render, label, ...opt }, _index) in _options"
          :key="_index"
        >
          <component :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string })" v-if="render" />
          <component
            :is="renderLabel(
              h(NPresetInput, {
                'options': opt,
                'value': key ? formValue[key] : undefined,
                'onUpdate:value': (val) => onPresetInputUpdate(val, key),
              }),
              label,
              { path: key as string })"
            v-else
          />
        </template>
      </NFlex>
      <NDivider v-if="_collapsedOptions && _collapsedOptions.length > 0" :style="{ margin: '5px 0' }">
        <NButton size="tiny" @click="filterCollapsed = !filterCollapsed">
          {{ filterCollapsed ? '折叠' : '展开' }}
        </NButton>
      </NDivider>
      <NCollapseTransition :show="filterCollapsed">
        <NGrid v-if="_layout.collapsedGrid && _collapsedOptions && _collapsedOptions.length > 0" v-bind="gridProps">
          <NGi
            v-for="({ key, gridSpan, gridItemProps, render, label, ...opt }, _index) in _collapsedOptions"
            :key="_index"
            :span="gridSpan"
            v-bind="gridItemProps"
          >
            <component :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string })" v-if="render" />
            <component
              :is="renderLabel(
                h(NPresetInput, {
                  'options': opt,
                  'value': key ? formValue[key] : undefined,
                  'onUpdate:value': (val) => onPresetInputUpdate(val, key),
                }),
                label,
                { path: key as string })"
              v-else
            />
          </NGi>
        </NGrid>
        <NFlex v-if="_layout.collapsedFlex && _collapsedOptions && _collapsedOptions.length > 0" v-bind="flexProps">
          <template
            v-for="({ key, render, label, ...opt }, _index) in _collapsedOptions"
            :key="_index"
          >
            <component :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string })" v-if="render" />
            <component
              :is="renderLabel(
                h(NPresetInput, {
                  'options': opt,
                  'value': key ? formValue[key] : undefined,
                  'onUpdate:value': (val) => onPresetInputUpdate(val, key),
                }),
                label,
                { path: key as string })"
              v-else
            />
          </template>
        </NFlex>
      </NCollapseTransition>
    </slot>
    <slot name="footer" :refs="exposeRefs" :actions="exposeActions" />
  </NForm>
</template>

<style scoped>

</style>
