import type { PaginationProps, SelectGroupOption, SelectInst, SelectOption, SelectProps } from 'naive-ui'
import type { ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from '../../composables/use-data-request'
import type { ClassStyle } from '../data-table-plus/index'
import type { RemoteRequestEmits, RemoteRequestProps } from '../remote-request/index'
import type PresetSelect from './PresetSelect.vue'

export { default as NPresetSelect } from './PresetSelect.vue'

/**
 * 数组感知类型
 * @template V 值类型
 * @template T 目标类型
 */
export type ArrayAwareType<V, T> = V extends null ? null : (V extends any[] ? T[] : T) | null

/**
 * 选项格式化函数
 * @template R 列表项类型
 */
export type OptionFormat<R extends DataObject = DataObject> = (row: R) => SelectOption | SelectGroupOption | false | undefined | null

/**
 * 预设选择器值类型
 */
export type PresetSelectValue = string | number | (string | number)[] | null

/**
 * 预设选择器字段配置
 */
export type PresetSelectFields = DataRequestFields & {
  /** 标签字段名 */
  label?: string
  /** 值字段名 */
  value?: string
  /** 行键字段名 */
  rowKey?: string
  /** 搜索字段名 */
  search?: string
  /** 子节点字段名 */
  children?: string
}

/**
 * 预设选择器暴露的方法
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type PresetSelectExpose<P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = UseDataRequestReturns<P, D, R> & {
  /** 选择器实例 */
  selectInst: Readonly<ShallowRef<SelectInst | null>>
}

/**
 * 预设选择器属性
 * @template V 值类型
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type PresetSelectProps<V extends PresetSelectValue, P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestProps<P, D> & {
  /** 值 */
  value?: V
  /** 回退标签 */
  fallbackLabel?: string | ((val: string | number) => SelectOption)
  /** 是否多选 */
  multiple?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 防抖配置 */
  debounce?: boolean | number
  /** 选项格式化函数 */
  optionFormat?: OptionFormat<R>
  /** 字段配置 */
  fields?: PresetSelectFields
  /** 选择器属性 */
  selectProps?: SelectProps & ClassStyle
  /** 分页配置 */
  pagination?: Omit<PaginationProps, 'page' | 'pageSize'> & ClassStyle | boolean
}

/**
 * 预设选择器事件
 * @template V 值类型
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type PresetSelectEmits<V extends PresetSelectValue, P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestEmits<P, D> & {
  /** 失去焦点事件 */
  (e: 'blur', ev: FocusEvent): void
  /** 清空事件 */
  (e: 'clear'): void
  /** 创建选项事件 */
  (e: 'create', label: string): SelectOption
  /** 获得焦点事件 */
  (e: 'focus', ev: FocusEvent): void
  /** 滚动事件 */
  (e: 'scroll', ev: Event): void
  /** 搜索事件 */
  (e: 'search', value: string): void
  /** 更新值事件 */
  (e: 'update:value', val: V | null, option: SelectOption | SelectOption[] | null, raw: R | R[] | null): void
  /** 更新页码事件 */
  (e: 'update:page', page: number): void
  /** 更新每页大小事件 */
  (e: 'update:pageSize', pageSize: number): void
}

/**
 * 预设选择器实例类型
 */
export type PresetSelectInst = ComponentExposed<typeof PresetSelect>
