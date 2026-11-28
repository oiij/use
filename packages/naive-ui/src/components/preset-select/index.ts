import type { PaginationProps, SelectGroupOption, SelectInst, SelectOption, SelectProps } from 'naive-ui'
import type { ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { DataObject, DataRequestFields, UseDataRequestReturns } from '../../composables/use-data-request'
import type { ClassStyle, PresetValue } from '../_utils/types'
import type { RemoteRequestEmits, RemoteRequestProps } from '../remote-request/index'
import type PresetSelect from './PresetSelect.vue'

export { default as NPresetSelect } from './PresetSelect.vue'

/**
 * 选项格式化函数
 * @template R 列表项类型
 */
export type OptionFormat<R extends DataObject = DataObject> = (row: R) => SelectOption | SelectGroupOption | false | undefined | null

/**
 * 预设选择器值类型
 */
export type PresetSelectValue = PresetValue

/**
 * 预设选择器字段配置
 */
export type PresetSelectFields = DataRequestFields & {
  /** 标签字段名 */
  label?: string
  /** 值字段名 */
  value?: string
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
 * 选择器透传属性
 * 已排除组件内部受控的字段，避免透传属性覆盖组件核心行为
 */
export type PresetSelectPassThroughProps = Omit<SelectProps, 'value' | 'options' | 'multiple' | 'loading' | 'remote' | 'filterable' | 'labelField' | 'valueField' | 'childrenField' | 'fallbackOption' | 'show' | 'onSearch' | 'onUpdateShow' | 'onUpdateValue' | 'onUpdate:value'> & ClassStyle

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
  /** 选择器透传属性，受控字段不可覆盖 */
  selectProps?: PresetSelectPassThroughProps
  /** 分页配置，用户配置优先于内部默认值 */
  pagination?: Omit<PaginationProps, 'page' | 'pageSize' | 'itemCount'> & ClassStyle | boolean
}

/**
 * 预设选择器事件
 * @template V 值类型
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 */
export type PresetSelectEmits<V extends PresetSelectValue, P extends DataObject = DataObject, D extends DataObject = DataObject, R extends DataObject = DataObject> = RemoteRequestEmits<P, D> & {
  /** 搜索事件 */
  (e: 'search', val: string): void
  /** 更新显示事件 */
  (e: 'update:show', show: boolean): void
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
