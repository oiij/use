<script setup lang='ts'
  generic="
    V extends PresetPickerValue,
    P extends RObject,
    D extends RObject,
    R extends RObject,
  "
>
import type { DataTableColumns, DataTableSortState } from 'naive-ui'
import type { FilterState, TableBaseColumn } from 'naive-ui/es/data-table/src/interface'
import type { Ref } from 'vue'
import type { RObject } from '../remote-request/index'
import type { PresetPickerEmits, PresetPickerProps, PresetPickerValue } from './index'
import { NBadge, NButton, NButtonGroup, NModal } from 'naive-ui'
import { computed, ref, toRaw, toValue, useTemplateRef } from 'vue'
import { NDataTablePlus } from '../data-table-plus/index'
import MageMultiplyCircleFill from '../icons/MageMultiplyCircleFill.vue'

const {
  value,
  fallbackLabel,
  multiple,
  disabled,
  clearable,
  placeholder = '请选择',
  type,
  selectionOptions,
  fields,
  columns,
  buttonProps,
  badgeProps,
  modalProps,
  dataTableProps,
  ...dataTablePlusProps
} = defineProps<PresetPickerProps<V, P, D, R>>()

const emit = defineEmits<PresetPickerEmits<V, P, D, R>>()

const _fields = { page: 'page', pageSize: 'pageSize', filter: 'filter', sorter: 'sorter', list: 'list', count: 'count', rowKey: 'id', search: 'search', children: 'children', ...fields }

const dataTablePlusRef = useTemplateRef('data-table-plus')

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
const showModal = ref(false)
function handleShowModal() {
  checkedRowKeys.value = structuredClone(Array.isArray(value) ? toRaw(value) : value ? [value] : []) as (string | number)[]
  showModal.value = true
}
function onClickRow(row: R, index: number, event: MouseEvent) {
  emit('clickRow', row, index, event)
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
function onUpdateCheckedRowKeys(keys: (string | number)[], rows: (R | undefined)[], meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }) {
  emit('update:checkedRowKeys', keys, rows, meta)
  if (meta.action === 'checkAll') {
    const allKeys = keys.filter(f => !checkedRowKeys.value.includes(f))
    checkedRowKeys.value.push(...allKeys)
    const allRows = rows.filter(f => !checkedRows.value.some(s => s?.[_fields.rowKey] === f?.[_fields.rowKey]))
    checkedRows.value.push(...allRows as R[])
    return
  }
  if (meta.action === 'uncheckAll') {
    const currentData = dataTablePlusRef.value?.refs.rawList.value
    const excludedKeys = checkedRowKeys.value.filter(f => !currentData?.some(s => s?.[_fields.rowKey] === f))
    checkedRowKeys.value = excludedKeys
    const excludedRows = checkedRows.value.filter(f => !currentData?.some(s => s?.[_fields.rowKey] === f?.[_fields.rowKey]))
    checkedRows.value = excludedRows
  }
}
function onNegativeClick() {
  showModal.value = false
}
function onPositiveClick() {
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
  showModal.value = false
}
function handleClear() {
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
</script>

<template>
  <NBadge :value="checkedCount" v-bind="badgeProps">
    <NButtonGroup>
      <NButton :type="type" v-bind="buttonProps" @click="handleShowModal">
        <span>{{ _label }}</span>

        <NModal
          v-model:show="showModal"
          style="width:auto;"
          preset="dialog"
          :title="placeholder"
          positive-text="确认"
          negative-text="取消"
          v-bind="modalProps"
          @positive-click="onPositiveClick"
          @negative-click="onNegativeClick"
        >
          <NDataTablePlus
            ref="data-table-plus"
            style="width:900px;height:600px;"
            :fields="_fields"
            :columns="_columns"
            :data-table-props="{
              checkedRowKeys,
              ...dataTableProps,
            }"
            v-bind="dataTablePlusProps"
            @click-row="onClickRow"
            @update:checked-row-keys="onUpdateCheckedRowKeys"
            @before="(params: P[]) => emit('before', params) "
            @success="(data: D, params: P[]) => emit('success', data, params)"
            @error="(err: Error, params: P[]) => emit('error', err, params)"
            @finally="(params: P[], data?: D, err?: Error) => emit('finally', params, data, err)"
            @context-menu-row="(row: R, index: number, event: MouseEvent) => emit('contextMenuRow', row, index, event)"
            @load="(row: R) => emit('load', row)"
            @scroll="(ev: Event) => emit('scroll', ev)"
            @update:expanded-row-keys="(keys: (string | number)[]) => emit('update:expandedRowKeys', keys)"
            @update:filters="(filterState: FilterState, sourceColumn: TableBaseColumn) => emit('update:filters', filterState, sourceColumn)"
            @update:sorter="(options: DataTableSortState | DataTableSortState[] | null) => emit('update:sorter', options)"
            @update:page="(page: number) => emit('update:page', page)"
            @update:page-size="(pageSize: number) => emit('update:pageSize', pageSize)"
          />
        </NModal>
      </NButton>
      <NButton v-if="showClearButton" circle :type="type" @click.stop="handleClear">
        <template #icon>
          <MageMultiplyCircleFill />
        </template>
      </NButton>
    </NButtonGroup>
  </NBadge>
</template>

<style scoped>

</style>
