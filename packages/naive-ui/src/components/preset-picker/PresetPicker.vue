<script setup lang='ts' generic="V extends PresetPickerValue, R extends DataObject">
import type { DataObject } from '../../composables/use-data-request'
import type { PresetPickerEmits, PresetPickerProps, PresetPickerValue } from './index'
import { NBadge, NButton, NButtonGroup, NModal, NTooltip } from 'naive-ui'
import MageMultiplyCircleFill from '../icons/MageMultiplyCircleFill.vue'
import { usePresetPicker } from './use-preset-picker'

const props = defineProps<PresetPickerProps<V, R>>()
const emit = defineEmits<PresetPickerEmits<V, R>>()

const { label, showClearButton, checkedCount, showModalFlag, showModal, clearValue, onPositiveClick, onNegativeClick, handleLoadedRows, expose, slotProps } = usePresetPicker<V, R>(props, emit)

defineExpose(expose)
</script>

<template>
  <NBadge :value="checkedCount" v-bind="props.badgeProps">
    <NButtonGroup>
      <NTooltip :disabled="!(props.tooltip ?? true) || !Array.isArray(props.value)" :trigger="Array.isArray(props.value) ? 'hover' : 'manual'">
        <template #trigger>
          <NButton v-bind="props.buttonProps" :type="props.type" :disabled="props.disabled" @click="showModal">
            <template #icon>
              <slot name="button-icon" />
            </template>
            <slot name="button">
              <span>{{ Array.isArray(props.value) ? '已选择' : label }}</span>
            </slot>
          </NButton>
        </template>
        <div>{{ Array.isArray(props.value) ? label : '' }}</div>
      </NTooltip>
      <slot name="clear-button">
        <NButton v-if="showClearButton" v-bind="props.clearButtonProps" circle :type="props.type" @click.stop="clearValue">
          <template #icon>
            <slot name="clear-icon">
              <MageMultiplyCircleFill />
            </slot>
          </template>
        </NButton>
      </slot>
      <NModal
        v-model:show="showModalFlag"
        style="width:auto;"
        preset="dialog"
        v-bind="props.modalProps"
        :title="props.placeholder ?? '请选择'"
        positive-text="确认"
        negative-text="取消"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
      >
        <slot v-bind="slotProps" @loaded-rows="handleLoadedRows" />
        <template #action>
          <slot name="modal-action" />
        </template>
        <template #header>
          <slot name="modal-header" />
        </template>
        <template #icon>
          <slot name="modal-icon" />
        </template>
        <template #close>
          <slot name="modal-close" />
        </template>
      </NModal>
    </NButtonGroup>
  </NBadge>
</template>
