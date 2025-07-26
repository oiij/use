<script setup lang='ts'
  generic="
    V extends PresetPickerValue,
    R extends RObject,
  "
>
import type { DataTableColumns } from 'naive-ui'
import type { Ref } from 'vue'
import type { RObject } from '../remote-request/index'
import type { PresetPickerEmits, PresetPickerProps, PresetPickerValue } from './index'
import { NBadge, NButton, NButtonGroup, NModal } from 'naive-ui'
import { computed, ref, toRaw, toValue } from 'vue'
import MageMultiplyCircleFill from '../icons/MageMultiplyCircleFill.vue'

const {
  value,
  fallbackLabel,
  multiple,
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

const _fields = { rowKey: 'id', ...fields }

const checkedRowKeys = ref<(string | number)[]>([])
const checkedRows: Ref<R[]> = ref([])
const _columns: DataTableColumns<any> = [
  {
    type: 'selection',
    multiple,
    width: 60,
    fixed: 'left',
    ...selectionOptions,
  },
  ...columns ?? [],
]
const showModalFlag = ref(false)
function showModal() {
  checkedRowKeys.value = structuredClone(Array.isArray(value) ? toRaw(value) : value ? [value] : []) as (string | number)[]
  showModalFlag.value = true
}
function onClickRow(row: R, _index: number, _event: MouseEvent, _currentData: R[], rowKey?: string) {
  if (rowKey) {
    _fields.rowKey = rowKey
  }
  if (multiple) {
    if (checkedRowKeys.value.includes(row?.[_fields.rowKey])) {
      checkedRowKeys.value = checkedRowKeys.value.filter(f => f !== row?.[_fields.rowKey])
      checkedRows.value = checkedRows.value.filter(f => f?.[_fields.rowKey] !== row?.[_fields.rowKey])
    }
    else {
      checkedRowKeys.value.push(row?.[_fields.rowKey])
      checkedRows.value.push(row as R)
    }
  }
  else {
    checkedRowKeys.value = [row?.[_fields.rowKey]]
    checkedRows.value = [row]
  }
}
function onUpdateCheckedRowKeys(
  keys: (string | number)[],
  rows: (R | undefined)[],
  meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' },
  currentData: R[],
  rowKey?: string,
) {
  if (rowKey) {
    _fields.rowKey = rowKey
  }
  if (meta.action === 'checkAll') {
    const allKeys = keys.filter(f => !checkedRowKeys.value.includes(f))
    checkedRowKeys.value.push(...allKeys)
    const allRows = rows.filter(f => !checkedRows.value.some(s => s?.[_fields.rowKey] === f?.[_fields.rowKey]))
    checkedRows.value.push(...allRows as R[])
    return
  }
  if (meta.action === 'uncheckAll') {
    const excludedKeys = checkedRowKeys.value.filter(f => !currentData?.some(s => s?.[_fields.rowKey] === f))
    checkedRowKeys.value = excludedKeys
    const excludedRows = checkedRows.value.filter(f => !currentData?.some(s => s?.[_fields.rowKey] === f?.[_fields.rowKey]))
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
    const rows = keys.map(m => toRaw(toValue(checkedRows.value.find(f => f?.[_fields.rowKey] === m))))
    emit('update:value', keys as V | null, rows as R[] | null)
  }
  else {
    const key = checkedRowKeys.value[0] ?? null
    const row = toRaw(toValue(checkedRows.value.find(f => f?.[_fields.rowKey] === key)))
    emit('update:value', key as V | null, row as R | null)
  }
  showModalFlag.value = false
}
function clearValue() {
  emit('update:value', null, null)
}
const _label = computed(() => {
  if (!multiple && value) {
    const item = checkedRows.value.find(f => f?.[_fields.rowKey] === value)
    return item ? item.name : fallbackLabel ?? value
  }
  return Array.isArray(value) ? value.length > 0 ? '已选择' : placeholder : placeholder
})
const showClearButton = computed(() => {
  return clearable && (Array.isArray(value) ? value.length > 0 : !!value)
})
const checkedCount = computed(() => Array.isArray(value) ? value.length : undefined)
const exposeRefs = {
  showModalFlag,
  checkedRowKeys,
  checkedRows,
  columns: _columns,
}
const exposeActions = {
  showModal,
  onUpdateCheckedRowKeys,
  onClickRow,
  onNegativeClick,
  onPositiveClick,
  clearValue,
}
defineExpose({
  refs: exposeRefs,
  actions: exposeActions,
})
</script>

<template>
  <NBadge :value="checkedCount" v-bind="badgeProps">
    <NButtonGroup>
      <NButton :type="type" v-bind="buttonProps" @click="showModal">
        <template #icon>
          <slot name="button-icon" />
        </template>
        <slot name="button-icon">
          <span>{{ _label }}</span>
        </slot>
      </NButton>
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
        <slot :refs="exposeRefs" :actions="exposeActions" />
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
