import type { BadgeProps, ButtonProps, DataTableColumns, ModalProps } from 'naive-ui'
import type { TableSelectionColumn } from 'naive-ui/es/data-table/src/interface'
import type { Ref } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject } from '../../composables/use-data-request'
import type { ClassStyle } from '../data-table-plus/index'
import type PresetPicker from './PresetPicker.vue'

export { default as NPresetPicker } from './PresetPicker.vue'

/**
 * 预设选择器值类型
 */
export type PresetPickerValue = string | number | (string | number)[] | null

/**
 * 预设选择器暴露的方法
 * @template R 列表项类型
 */
export type PresetPickerExpose<R extends DataObject = DataObject> = {
  /** 显示模态框标志 */
  showModalFlag: Ref<boolean, boolean>
  /** 选中行键 */
  checkedRowKeys: Ref<(string | number)[], (string | number)[]>
  /** 选中行数据 */
  checkedRows: Ref<R[], R[]>
  /** 表格列配置 */
  columns: DataTableColumns<any>
  /** 显示模态框 */
  showModal: () => void
  /** 更新选中行键效果 */
  updateCheckedRowKeysEffect: (keys: (string | number)[], rows: (R | undefined)[], meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }, currentData: R[]) => void
  /** 点击行效果 */
  clickRowEffect: (row: R) => void
  /** 清空值 */
  clearValue: () => void
  /** 设置选中行键 */
  setCheckedRowKeys: (keys: (string | number)[]) => void
  /** 设置选中行数据 */
  setCheckedRows: (rows: R[]) => void
}

/**
 * 预设选择器属性
 * @template V 值类型
 * @template R 列表项类型
 */
export type PresetPickerProps<V extends PresetPickerValue, R extends DataObject = DataObject> = {
  /** 值 */
  value?: V
  /** 回退标签 */
  fallbackLabel?: string | ((val: string | number) => string)
  /** 是否多选 */
  multiple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 是否显示提示 */
  tooltip?: boolean
  /** 占位符 */
  placeholder?: string
  /** 按钮类型 */
  type?: ButtonProps['type']
  /** 表格列配置 */
  columns?: DataTableColumns<R>
  /** 选择列选项 */
  selectionOptions?: TableSelectionColumn
  /** 字段映射 */
  fields?: { label?: string, value?: string }
  /** 按钮属性 */
  buttonProps?: ButtonProps & ClassStyle
  /** 清空按钮属性 */
  clearButtonProps?: ButtonProps & ClassStyle
  /** 徽标属性 */
  badgeProps?: BadgeProps & ClassStyle
  /** 模态框属性 */
  modalProps?: ModalProps & ClassStyle
}

/**
 * 预设选择器事件
 * @template V 值类型
 * @template R 列表项类型
 */
export type PresetPickerEmits<V extends PresetPickerValue, R extends DataObject = DataObject> = {
  /** 更新值事件 */
  (e: 'update:value', val: V | null, raw: R | R[] | null): void
  /** 进入后事件 */
  (e: 'afterEnter'): void
  /** 离开后事件 */
  (e: 'afterLeave'): void
  /** 按下 Esc 键事件 */
  (e: 'esc'): void
  /** 点击遮罩层事件 */
  (e: 'maskClick'): void
  /** 更新显示状态事件 */
  (e: 'update:show', value: boolean): void
  /** 关闭事件 */
  (e: 'close'): void
  /** 点击取消按钮事件 */
  (e: 'negativeClick'): void
  /** 点击确认按钮事件 */
  (e: 'positiveClick'): void
}

/**
 * 预设选择器实例类型
 */
export type PresetPickerInst = ComponentExposed<typeof PresetPicker>
