<script setup lang='ts'
  generic="
    V extends Record<string, any> = Record<string, any>,
  "
>
import type { PresetFormProps } from '.'
import { NForm, NGi, NGrid } from 'naive-ui'
import { computed, ref } from 'vue'
import { NPresetInput } from '..'
import { useNaiveForm } from '../../composables'
import { renderLabel } from '../preset-input/_utils'
import { options2Rules } from './_utils'

const { options, values, rules, formProps: defaultProps, gridProps, flexProps, layout = 'grid' } = defineProps<PresetFormProps<V>>()
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

const { formProps, formValue, formRules, formRef, validate, resetValidation, resetForm, reset, clear, onValidated } = useNaiveForm(values, {
  rules: rules ?? options2Rules(options),
})
onValidated((value) => {
  emit('validated', value)
})
const filterCollapsed = ref(false)

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
  setValues: (value: Partial<V>) => {
    Object.assign(formValue.value, value)
  },
}
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
  <NForm v-bind="{ ...(formProps as any), ...defaultProps }">
    <slot name="header" :refs="exposeRefs" :actions="exposeActions" />
    <slot :refs="exposeRefs" :actions="exposeActions">
      <NGrid v-if="_layout.grid" v-bind="gridProps">
        <NGi
          v-for="({ key, gridItemProps, render, ...opt }, _index) in options?.filter(f => !f.collapsed)"
          :key="_index"
          :span="12"
          v-bind="gridItemProps"
        >
          <component :is="renderLabel(render(exposeRefs, exposeActions), opt.label, (key as string))" v-if="render" />
          <NPresetInput
            v-else
            :options="opt"
            :path="(key as string)"
            :value="key ? formValue[key] : undefined"
            @update:value="(val) => onPresetInputUpdate(val, key)"
          />
        </NGi>
      </NGrid>
      <NFlex v-if="_layout.flex" v-bind="flexProps">
        <template
          v-for="({ key, render, ...opt }, _index) in options?.filter(f => !f.collapsed)"
          :key="_index"
        >
          <component :is="renderLabel(render(exposeRefs, exposeActions), opt.label, (key as string))" v-if="render" />
          <NPresetInput
            v-else
            :options="opt"
            :path="(key as string)"
            :value="key ? formValue[key] : undefined"
            @update:value="(val) => onPresetInputUpdate(val, key)"
          />
        </template>
      </NFlex>
      <NDivider v-if="options?.filter(f => f.collapsed) && options?.filter(f => f.collapsed)?.length > 0" style="margin:5px 0;">
        <NButton size="tiny" @click="filterCollapsed = !filterCollapsed">
          {{ filterCollapsed ? '折叠' : '展开' }}
        </NButton>
      </NDivider>
      <NCollapseTransition :show="filterCollapsed">
        <NGrid v-if="_layout.collapsedGrid" v-bind="gridProps">
          <NGi
            v-for="({ key, gridItemProps, render, ...opt }, _index) in options?.filter(f => f.collapsed)"
            :key="_index"
            :span="12"
            v-bind="gridItemProps"
          >
            <component :is="renderLabel(render(exposeRefs, exposeActions), opt.label, (key as string))" v-if="render" />
            <NPresetInput
              v-else
              :options="opt"
              :path="(key as string)"
              :value="key ? formValue[key] : undefined"
              @update:value="(val) => onPresetInputUpdate(val, key)"
            />
          </NGi>
        </NGrid>
        <NFlex v-if="_layout.collapsedFlex" v-bind="flexProps">
          <template
            v-for="({ key, render, ...opt }, _index) in options?.filter(f => f.collapsed)"
            :key="_index"
          >
            <component :is="renderLabel(render(exposeRefs, exposeActions), opt.label, (key as string))" v-if="render" />
            <NPresetInput
              v-else
              :options="opt"
              :path="(key as string)"
              :value="key ? formValue[key] : undefined"
              @update:value="(val) => onPresetInputUpdate(val, key)"
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
