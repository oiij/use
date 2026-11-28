import type { DataTableColumns } from 'naive-ui'
import type { TableColumn } from 'naive-ui/lib/data-table/src/interface'
import type { Ref } from 'vue'
import type { DataObject } from '../../composables/use-data-request'
import type { PresetPickerEmits, PresetPickerExpose, PresetPickerProps, PresetPickerValue } from './index'
import { computed, reactive, ref, toRaw, watch, watchEffect } from 'vue'
import { createExpose } from '../_utils/expose'
import { mergeFields } from '../_utils/fields'

/**
 * PresetPicker 的选择器逻辑
 * 负责选中行状态、值同步、表格列、标签展示与弹窗确认
 * @template V 值类型
 * @template R 列表项类型
 * @param props 组件属性
 * @param emit 组件事件
 * @returns 选择器状态、事件处理器与暴露对象
 * @example
 * ```ts
 * const { label, expose, slotProps } = usePresetPicker(props, emit)
 * defineExpose(expose)
 * ```
 */
export function usePresetPicker<V extends PresetPickerValue, R extends DataObject>(
  props: PresetPickerProps<V, R>,
  emit: PresetPickerEmits<V, R>,
) {
  const fields = mergeFields<{ label: string, value: string }>({
    label: 'label',
    value: 'value',
  }, props.fields)

  const checkedRowKeys = ref<(string | number)[]>([])
  const checkedRows: Ref<R[]> = ref([])

  function syncKeysFromValue() {
    const current = props.value
    const keys = Array.isArray(current)
      ? [...current]
      : current === null || current === undefined
        ? []
        : [current]
    checkedRowKeys.value = keys as (string | number)[]
    checkedRows.value = checkedRows.value.filter(row => keys.includes(row?.[fields.value]))
  }

  watch(() => props.value, syncKeysFromValue, { immediate: true, deep: true })

  const selectionColumn = computed<TableColumn<any>>(() => ({
    type: 'selection',
    width: 60,
    fixed: 'left',
    ...props.selectionOptions,
    multiple: props.multiple,
  }))

  const columns = reactive<DataTableColumns<any>>([])

  watchEffect(() => {
    columns.splice(0, columns.length, selectionColumn.value, ...props.columns ?? [])
  })

  const showModalFlag = ref(false)

  function showModal() {
    syncKeysFromValue()
    showModalFlag.value = true
  }

  function clickRowEffect(row: R) {
    const rowValue = row?.[fields.value]
    if (props.multiple) {
      const index = checkedRowKeys.value.indexOf(rowValue)
      if (index > -1) {
        checkedRowKeys.value.splice(index, 1)
        checkedRows.value = checkedRows.value.filter(item => item?.[fields.value] !== rowValue)
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
      const allKeys = keys.filter(key => !checkedRowKeys.value.includes(key))
      checkedRowKeys.value.push(...allKeys)
      const allRows = rows.filter(row => row && !checkedRows.value.some(item => item?.[fields.value] === row?.[fields.value]))
      checkedRows.value.push(...allRows as R[])
      return
    }
    if (meta.action === 'uncheckAll') {
      checkedRowKeys.value = checkedRowKeys.value.filter(key => !currentData?.some(item => item?.[fields.value] === key))
      checkedRows.value = checkedRows.value.filter(row => !currentData?.some(item => item?.[fields.value] === row?.[fields.value]))
    }
  }

  function onNegativeClick() {
    emit('negativeClick')
    showModalFlag.value = false
  }

  function onPositiveClick() {
    emit('positiveClick')
    if (props.multiple) {
      const keys = [...checkedRowKeys.value]
      const rows = keys
        .map(key => checkedRows.value.find(row => row?.[fields.value] === key))
        .filter((row): row is R => !!row)
        .map(row => toRaw(row))
      emit('update:value', keys as V | null, rows)
    }
    else {
      const key = checkedRowKeys.value[0] ?? null
      const row = checkedRows.value.find(item => item?.[fields.value] === key)
      emit('update:value', key as V | null, row ? toRaw(row) : null)
    }
    showModalFlag.value = false
  }

  function clearValue() {
    emit('update:value', null, null)
  }

  function handleLoadedRows(rows: R[]) {
    const newRows = rows.filter(row => checkedRowKeys.value.includes(row?.[fields.value]) && !checkedRows.value.some(item => item?.[fields.value] === row?.[fields.value]))
    checkedRows.value.push(...newRows)
  }

  const label = computed(() => {
    const { placeholder = '请选择', fallbackLabel, value } = props
    if (Array.isArray(value)) {
      if (value.length === 0)
        return placeholder
      if (typeof fallbackLabel === 'string')
        return fallbackLabel
      return value.map((item) => {
        const row = checkedRows.value.find(row => row?.[fields.value] === item)
        return row?.[fields.label] ?? (typeof fallbackLabel === 'function' ? fallbackLabel(item) : item)
      }).join(',')
    }
    if (value !== undefined && value !== null) {
      const row = checkedRows.value.find(item => item?.[fields.value] === value)
      return row?.[fields.label] ?? (typeof fallbackLabel === 'function' ? fallbackLabel(value as string | number) : (fallbackLabel ?? value))
    }
    return placeholder
  })

  const showClearButton = computed(() => {
    return !!props.clearable && (Array.isArray(props.value) ? props.value.length > 0 : !!props.value)
  })

  const checkedCount = computed(() => Array.isArray(props.value) ? props.value.length : undefined)

  const expose: PresetPickerExpose<R> = {
    showModalFlag,
    checkedRowKeys,
    checkedRows,
    columns,
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
    runPositiveClick: onPositiveClick,
  }

  const { slotProps } = createExpose(expose)

  return {
    ...expose,
    expose,
    label,
    showClearButton,
    checkedCount,
    onPositiveClick,
    onNegativeClick,
    handleLoadedRows,
    slotProps,
  }
}
