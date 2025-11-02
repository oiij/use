<script setup lang='ts'  generic="V extends PresetPickerValue, R extends DataObject">
import type { DataTableColumns } from 'naive-ui'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import type { Ref } from 'vue'
import type { DataObject } from '../../composables/useDataRequest'
import type { PresetPickerEmits, PresetPickerExpose, PresetPickerProps, PresetPickerValue } from './index'
import { cloneDeep } from 'es-toolkit/object'
import { NBadge, NButton, NButtonGroup, NModal, NTooltip } from 'naive-ui'
import { computed, reactive, ref, toRaw, toValue, watch } from 'vue'
import MageMultiplyCircleFill from '../icons/MageMultiplyCircleFill.vue'

const {
  value,
  fallbackLabel,
  multiple,
  disabled,
  clearable,
  placeholder = '请选择',
  type,
  columns,
  selectionOptions,
  fields,
  buttonProps,
  clearButtonProps,
  badgeProps,
  modalProps,
} = defineProps<PresetPickerProps<V, R>>()

const emit = defineEmits<PresetPickerEmits<V, R>>()

const _fields = { label: 'label', value: 'value', ...fields }

const checkedRowKeys = ref<(string | number)[]>([])
const checkedRows: Ref<R[]> = ref([])
const selectionColumn: TableColumn<any> = reactive({
  type: 'selection',
  multiple,
  width: 60,
  fixed: 'left',
  ...selectionOptions,
})
watch(() => multiple, () => {
  selectionColumn.multiple = multiple
})
const _columns: DataTableColumns<any> = reactive([
  selectionColumn,
  ...columns ?? [],
])
const showModalFlag = ref(false)
function showModal() {
  checkedRowKeys.value = cloneDeep(Array.isArray(value) ? value : value ? [value] : []) as (string | number)[]
  showModalFlag.value = true
}
function clickRowEffect(row: R) {
  if (multiple) {
    if (checkedRowKeys.value.includes(row?.[_fields.value])) {
      checkedRowKeys.value = checkedRowKeys.value.filter(f => f !== row?.[_fields.value])
      checkedRows.value = checkedRows.value.filter(f => f?.[_fields.value] !== row?.[_fields.value])
    }
    else {
      checkedRowKeys.value.push(row?.[_fields.value])
      checkedRows.value.push(row as R)
    }
  }
  else {
    checkedRowKeys.value = [row?.[_fields.value]]
    checkedRows.value = [row]
  }
}
function updateCheckedRowKeysEffect(
  keys: (string | number)[],
  rows: (R | undefined)[],
  meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' },
  currentData: R[],
) {
  if (meta.action === 'checkAll') {
    const allKeys = keys.filter(f => !checkedRowKeys.value.includes(f))
    checkedRowKeys.value.push(...allKeys)
    const allRows = rows.filter(f => !checkedRows.value.some(s => s?.[_fields.value] === f?.[_fields.value]))
    checkedRows.value.push(...allRows as R[])
    return
  }
  if (meta.action === 'uncheckAll') {
    const excludedKeys = checkedRowKeys.value.filter(f => !currentData?.some(s => s?.[_fields.value] === f))
    checkedRowKeys.value = excludedKeys
    const excludedRows = checkedRows.value.filter(f => !currentData?.some(s => s?.[_fields.value] === f?.[_fields.value]))
    checkedRows.value = excludedRows
  }
}
function onNegativeClick() {
  emit('negativeClick')
  showModalFlag.value = false
}
function onPositiveClick() {
  emit('positiveClick')
  if (multiple) {
    const keys = toRaw(toValue(checkedRowKeys))
    const rows = keys.map(m => toRaw(toValue(checkedRows.value.find(f => f?.[_fields.value] === m))))
    emit('update:value', keys as V | null, rows as R[] | null)
  }
  else {
    const key = checkedRowKeys.value[0] ?? null
    const row = toRaw(toValue(checkedRows.value.find(f => f?.[_fields.value] === key)))
    emit('update:value', key as V | null, row as R | null)
  }
  showModalFlag.value = false
}
function clearValue() {
  emit('update:value', null, null)
}
const _label = computed(() => {
  if (Array.isArray(value) && value.length > 0) {
    return typeof fallbackLabel === 'string'
      ? fallbackLabel
      : value.map((m) => {
          const item = checkedRows.value.find(f => f?.[_fields.value] === m)
          return item && item?.[_fields.label] ? item[_fields.label] : typeof fallbackLabel === 'function' ? fallbackLabel(m) : m
        }).join(',')
  }
  if (value && !Array.isArray(value)) {
    const item = checkedRows.value.find(f => f?.[_fields.value] === value)
    return item && item?.[_fields.label] ? item?.[_fields.label] : typeof fallbackLabel === 'function' ? fallbackLabel(value) : (fallbackLabel ?? value)
  }
  return placeholder
})
const showClearButton = computed(() => {
  return clearable && (Array.isArray(value) ? value.length > 0 : !!value)
})
const checkedCount = computed(() => Array.isArray(value) ? value.length : undefined)

const expose: PresetPickerExpose<R> = {
  showModalFlag,
  checkedRowKeys,
  checkedRows,
  columns: _columns,
  showModal,
  updateCheckedRowKeysEffect,
  clickRowEffect,
  clearValue,
  setCheckedRowKeys: (keys: (string | number)[]) => {
    checkedRowKeys.value = keys
  },
  setCheckedRows: (rows: R[]) => {
    checkedRows.value = rows
  },
}
const templateBind = computed(() => {
  return {
    ...expose,
    showModalFlag: toValue(showModalFlag),
    checkedRowKeys: toValue(checkedRowKeys),
    checkedRows: toValue(checkedRows),
    columns: toValue(_columns),
  }
})

defineExpose(expose)
</script>

<template>
  <NBadge :value="checkedCount" v-bind="badgeProps">
    <NButtonGroup>
      <NTooltip :disabled="Array.isArray(value) ? false : true" :trigger="Array.isArray(value) ? 'hover' : 'manual'">
        <template #trigger>
          <NButton :type="type" :disabled="disabled" v-bind="buttonProps" @click="showModal">
            <template #icon>
              <slot name="button-icon" />
            </template>
            <slot name="button">
              <span>{{ Array.isArray(value) ? '已选择' : _label }}</span>
            </slot>
          </NButton>
        </template>
        <div>{{ Array.isArray(value) ? _label : '' }}</div>
      </NTooltip>
      <slot name="clear-button">
        <NButton v-if="showClearButton" circle :type="type" v-bind="clearButtonProps" @click.stop="clearValue">
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
        :title="placeholder"
        positive-text="确认"
        negative-text="取消"
        v-bind="modalProps"
        @positive-click="onPositiveClick"
        @negative-click="onNegativeClick"
        @close="emit('close')"
        @after-enter="emit('afterEnter')"
        @after-leave="emit('afterLeave')"
        @esc="emit('esc')"
        @mask-click="emit('maskClick')"
        @update:show="(val) => emit('update:show', val)"
      >
        <slot v-bind="templateBind" />
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

<style scoped>

</style>
