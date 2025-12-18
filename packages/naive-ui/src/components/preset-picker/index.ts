import type { BadgeProps, ButtonProps, DataTableColumns, ModalProps } from 'naive-ui'
import type { TableSelectionColumn } from 'naive-ui/es/data-table/src/interface'
import type { Ref } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject } from '../../composables/useDataRequest'
import type { ClassStyle } from '../data-table-plus/index'
import type PresetPicker from './PresetPicker.vue'

export { default as NPresetPicker } from './PresetPicker.vue'

export type PresetPickerValue = string | number | (string | number)[] | null

export type PresetPickerExpose<R extends DataObject = DataObject> = & {
  showModalFlag: Ref<boolean, boolean>
  checkedRowKeys: Ref<(string | number)[], (string | number)[]>
  checkedRows: Ref<R[], R[]>
  columns: DataTableColumns<any>
  showModal: () => void
  updateCheckedRowKeysEffect: (keys: (string | number)[], rows: (R | undefined)[], meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }, currentData: R[]) => void
  clickRowEffect: (row: R) => void
  clearValue: () => void
  setCheckedRowKeys: (keys: (string | number)[]) => void
  setCheckedRows: (rows: R[]) => void
}

export type PresetPickerProps<V extends PresetPickerValue, R extends DataObject = DataObject> = & {
  value?: V
  fallbackLabel?: string | ((val: string | number) => string)
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  tooltip?: boolean
  placeholder?: string
  type?: ButtonProps['type']
  columns?: DataTableColumns<R>
  selectionOptions?: TableSelectionColumn
  fields?: { label?: string, value?: string }
  buttonProps?: ButtonProps & ClassStyle
  clearButtonProps?: ButtonProps & ClassStyle
  badgeProps?: BadgeProps & ClassStyle
  modalProps?: ModalProps & ClassStyle
}
export type PresetPickerEmits<V extends PresetPickerValue, R extends DataObject = DataObject> = & {
  (e: 'update:value', val: V | null, raw: R | R[] | null): void
  (e: 'afterEnter'): void
  (e: 'afterLeave'): void
  (e: 'esc'): void
  (e: 'maskClick'): void
  (e: 'update:show', value: boolean): void
  (e: 'close'): void
  (e: 'negativeClick'): void
  (e: 'positiveClick'): void

}
export type PresetPickerInst = ComponentExposed<typeof PresetPicker>
