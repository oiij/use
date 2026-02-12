<script setup lang='ts'  generic="V extends PresetPickerValue, R extends DataObject">
import type { DataTableColumns } from 'naive-ui'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import type { Ref } from 'vue'
import type { DataObject } from '../../composables/use-data-request'
import type { PresetPickerEmits, PresetPickerExpose, PresetPickerProps, PresetPickerValue } from './index'
import { cloneDeep } from 'es-toolkit/object'
import { NBadge, NButton, NButtonGroup, NModal, NTooltip } from 'naive-ui'
import { computed, reactive, ref, toRaw, toValue, watch } from 'vue'
import MageMultiplyCircleFill from '../icons/MageMultiplyCircleFill.vue'

const { value, fallbackLabel, multiple, disabled, clearable, tooltip = true, placeholder = '请选择', type, columns, selectionOptions, fields, buttonProps, clearButtonProps, badgeProps, modalProps } = defineProps<PresetPickerProps<V, R>>()

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
  const rowValue = row?.[_fields.value]
  if (multiple) {
    const index = checkedRowKeys.value.indexOf(rowValue)
    if (index > -1) {
      checkedRowKeys.value.splice(index, 1)
      checkedRows.value = checkedRows.value.filter(f => f?.[_fields.value] !== rowValue)
    }
    else {
      checkedRowKeys.value.push(rowValue)
      checkedRows.value.push(row)
    }
  }
  else {
    checkedRowKeys.value = [rowValue]
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
  if (Array.isArray(value)) {
    if (value.length === 0)
      return placeholder
    if (typeof fallbackLabel === 'string')
      return fallbackLabel
    return value.map((m) => {
      const item = checkedRows.value.find(f => f?.[_fields.value] === m)
      return item?.[_fields.label] ?? (typeof fallbackLabel === 'function' ? fallbackLabel(m) : m)
    }).join(',')
  }
  if (value !== undefined && value !== null) {
    const item = checkedRows.value.find(f => f?.[_fields.value] === value)
    return item?.[_fields.label] ?? (typeof fallbackLabel === 'function' ? fallbackLabel(value) : (fallbackLabel ?? value))
  }
  return placeholder
})
const showClearButton = computed(() => {
  return clearable && (Array.isArray(value) ? value.length > 0 : !!value)
})
const checkedCount = computed(() => Array.isArray(value) ? value.length : undefined)

function handleLoadedRows(rows: R[]) {
  const newRows = rows.filter((f) => {
    return checkedRowKeys.value.includes(f?.[_fields.value]) && !checkedRows.value.some(s => s?.[_fields.value] === f?.[_fields.value])
  })
  checkedRows.value.push(...newRows)
}
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
    showModalFlag: showModalFlag.value,
    checkedRowKeys: checkedRowKeys.value,
    checkedRows: checkedRows.value,
    columns: _columns,
  }
})

defineExpose(expose)
</script>

<template>
  <NBadge :value="checkedCount" v-bind="badgeProps">
    <NButtonGroup>
      <NTooltip :disabled="(!tooltip || !Array.isArray(value)) ? true : false" :trigger="Array.isArray(value) ? 'hover' : 'manual'">
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
      >
        <slot v-bind="templateBind" @loaded-rows="handleLoadedRows" />
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
