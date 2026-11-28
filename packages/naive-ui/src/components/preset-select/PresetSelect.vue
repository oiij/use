<script setup lang='ts' generic="V extends PresetSelectValue, P extends DataObject, D extends DataObject, R extends DataObject">
import type { SelectInst } from 'naive-ui'
import type { DataObject } from '../../composables/use-data-request'
import type { PresetSelectEmits, PresetSelectProps, PresetSelectValue } from './index'
import { NFlex, NPagination, NSelect } from 'naive-ui'
import { useTemplateRef } from 'vue'
import { usePresetSelect } from './use-preset-select'

const props = defineProps<PresetSelectProps<V, P, D, R>>()
const emit = defineEmits<PresetSelectEmits<V, P, D, R>>()
const selectInstRef = useTemplateRef<SelectInst>('select-ref')

const { fields, options, fallbackOption, handlers, paginationBindings, paginationHandlers, expose, slotProps, loading } = usePresetSelect<V, P, D, R>(props, emit, selectInstRef)

defineExpose(expose)
</script>

<template>
  <NSelect
    ref="select-ref"
    v-bind="props.selectProps"
    remote
    filterable
    :multiple="props.multiple ?? false"
    :disabled="props.disabled"
    :clearable="props.clearable"
    :options="options"
    :label-field="fields.label"
    :value-field="fields.value"
    :children-field="fields.children"
    :value="props.value"
    :fallback-option="fallbackOption"
    :loading="loading"
    @search="handlers.onSearch"
    @update:show="handlers.onUpdateShow"
    @update:value="handlers.onUpdateValue"
  >
    <template #header>
      <slot name="header" v-bind="slotProps" />
    </template>
    <template #action>
      <slot name="footer" v-bind="slotProps">
        <NFlex>
          <slot name="footer-extra" v-bind="slotProps" />
          <NPagination
            v-if="props.pagination"
            simple
            :disabled="loading"
            v-bind="paginationBindings"
            :style="{ marginLeft: 'auto' }"
            @update:page="paginationHandlers.onUpdatePage"
            @update:page-size="paginationHandlers.onUpdatePageSize"
          />
        </NFlex>
      </slot>
    </template>
    <template #empty>
      <slot name="empty" v-bind="slotProps" />
    </template>
    <template #arrow>
      <slot name="arrow" v-bind="slotProps" />
    </template>
  </NSelect>
</template>
