import type { BadgeProps, ButtonProps, DataTableColumns, ModalProps } from 'naive-ui'
import type { TableSelectionColumn } from 'naive-ui/es/data-table/src/interface'
import type { Ref } from 'vue'
import type { RObject } from '../remote-request/index'

export { default as NPresetPicker } from './PresetPicker.vue'

export type PresetPickerValue = string | number | (string | number)[] | null

export type PresetPickerExposeRefs<R extends RObject> = & {
  showModalFlag: Ref<boolean, boolean>
  checkedRowKeys: Ref<(string | number)[], (string | number)[]>
  checkedRows: Ref<R[], R[]>
  columns: DataTableColumns<any>
}
export type PresetPickerExposeActions<R extends RObject> = & {
  showModal: () => void
  updateCheckedRowKeysEffect: (keys: (string | number)[], rows: (R | undefined)[], meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }, currentData: R[]) => void
  clickRowEffect: (row: R) => void
  clearValue: () => void
}

export type PresetPickerProps<V extends PresetPickerValue, R extends RObject> = & {
  value?: V
  fallbackLabel?: string | ((val: string | number) => string)
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  type?: ButtonProps['type']
  columns?: DataTableColumns<R>
  selectionOptions?: TableSelectionColumn
  fields?: { label?: string, value?: string }
  buttonProps?: ButtonProps
  clearButtonProps?: ButtonProps
  badgeProps?: BadgeProps
  modalProps?: ModalProps
}
export type PresetPickerEmits<V extends PresetPickerValue, R extends RObject> = & {
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
