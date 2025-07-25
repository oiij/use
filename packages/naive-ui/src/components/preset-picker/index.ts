import type { BadgeProps, ButtonProps, ModalProps, SelectInst } from 'naive-ui'
import type { TableSelectionColumn } from 'naive-ui/es/data-table/src/interface'
import type { ShallowRef } from 'vue'
import type { DataTablePlusEmits, DataTablePlusExposeActions, DataTablePlusExposeRefsBase, DataTablePlusProps } from '../data-table-plus/index'
import type { RObject } from '../remote-request/index'

export { default as NPresetPicker } from './PresetPicker.vue'

export type PresetPickerValue = string | number | (string | number)[] | null

export type PresetPickerExposeRefs<P extends RObject, D extends RObject, R extends RObject> = DataTablePlusExposeRefsBase<P, D, R> & {
  selectRef: Readonly<ShallowRef<SelectInst | null>>
}
export type PresetPickerExposeActions<P extends RObject, D extends RObject> = DataTablePlusExposeActions<P, D>

export type PresetPickerProps<V extends PresetPickerValue, P extends RObject, D extends RObject, R extends RObject> = DataTablePlusProps<P, D, R> & {
  value?: V
  fallbackLabel?: string
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  type?: ButtonProps['type']
  selectionOptions?: TableSelectionColumn
  buttonProps?: ButtonProps
  badgeProps?: BadgeProps
  modalProps?: ModalProps
}
export type PresetPickerEmits<V extends PresetPickerValue, P extends RObject, D extends RObject, R extends RObject> = DataTablePlusEmits<P, D, R> & {
  (e: 'update:value', val: V | null, raw: R | R[] | null): void
}
