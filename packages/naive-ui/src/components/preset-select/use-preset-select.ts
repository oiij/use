import type { SelectGroupOption, SelectInst, SelectOption } from 'naive-ui'
import type { ShallowRef } from 'vue'
import type { DataObject } from '../../composables/use-data-request'
import type { PresetSelectEmits, PresetSelectFields, PresetSelectProps, PresetSelectValue } from './index'
import { useDebounceFn } from '@vueuse/core'
import { computed, ref, shallowReactive, toRaw, watch } from 'vue'
import { useRemotePagination } from '../../composables/use-remote-pagination'
import { useRemoteRequest } from '../../composables/use-remote-request'
import { createExpose } from '../_utils/expose'
import { mergeFields } from '../_utils/fields'

/**
 * PresetSelect 的选择器逻辑
 * 负责字段配置、远程选项、已选项缓存、搜索防抖、分页与事件派发
 * @template V 值类型
 * @template P 请求参数类型
 * @template D 响应数据类型
 * @template R 列表项类型
 * @param props 组件属性
 * @param emit 组件事件
 * @param selectInstRef 选择器实例引用
 * @returns 选择器状态、事件处理器与暴露对象
 * @example
 * ```ts
 * const { fields, options, expose, slotProps } = usePresetSelect(props, emit, selectInstRef)
 * defineExpose(expose)
 * ```
 */
export function usePresetSelect<V extends PresetSelectValue, P extends DataObject, D extends DataObject, R extends DataObject>(
  props: PresetSelectProps<V, P, D, R>,
  emit: PresetSelectEmits<V, P, D, R>,
  selectInstRef: Readonly<ShallowRef<SelectInst | null>>,
) {
  const fields = mergeFields<Required<PresetSelectFields>>({
    page: 'page',
    pageSize: 'pageSize',
    search: 'search',
    list: 'list',
    count: 'count',
    label: 'label',
    value: 'value',
    children: 'children',
  }, props.fields)

  const request = useRemoteRequest<P, D, R>(props.api, {
    defaultParams: {
      [fields.search]: null,
      ...props.defaultParams,
    } as P,
    manual: props.manual ?? true,
    fields,
    requestOptions: props.requestOptions,
    requestPlugins: props.requestPlugins,
  }, emit)

  // 已选项缓存：跨页/搜索后仍能还原 label 与原始行
  const selectedCache = shallowReactive(new Map<string | number, R>())

  function formatRow(row: R): SelectOption | SelectGroupOption | null {
    if (typeof props.optionFormat === 'function')
      return props.optionFormat(row) || null
    return {
      [fields.label]: row?.[fields.label],
      [fields.value]: row?.[fields.value],
      [fields.children]: row?.[fields.children],
    } as SelectOption
  }

  function rememberRows(rows: R[]) {
    for (const row of rows) {
      const key = row?.[fields.value] as string | number | undefined
      if (key !== undefined && key !== null && !selectedCache.has(key))
        selectedCache.set(key, row)
    }
  }

  watch(request.list, rows => rememberRows(rows), { immediate: true })

  const options = computed<(SelectOption | SelectGroupOption)[]>(() => {
    return request.list.value
      .map(formatRow)
      .filter((item): item is SelectOption | SelectGroupOption => !!item)
  })

  function fallbackOption(val: string | number): SelectOption {
    const cached = selectedCache.get(val)
    if (cached) {
      const option = formatRow(cached)
      if (option)
        return option as SelectOption
    }
    return typeof props.fallbackLabel === 'function'
      ? props.fallbackLabel(val)
      : {
          [fields.label]: props.fallbackLabel ?? `${val}`,
          [fields.value]: val,
        }
  }

  const searchValue = ref('')
  const debounceSearch = useDebounceFn(() => {
    request.runParams({
      [fields.page]: 1,
      [fields.search]: searchValue.value,
    } as P)
  }, typeof props.debounce === 'number' ? props.debounce : 500)

  function onSearch(val: string) {
    emit('search', val)
    searchValue.value = val
    if (props.debounce ?? true) {
      debounceSearch()
    }
    else {
      request.runParams({
        [fields.page]: 1,
        [fields.search]: val,
      } as P)
    }
  }

  function createInitialQuery(): P {
    return {
      [fields.page]: 1,
      [fields.pageSize]: request.pagination.value.pageSize,
      [fields.search]: null,
      ...props.defaultParams,
    } as P
  }

  function onUpdateShow(show: boolean) {
    emit('update:show', show)
    if (show && !request.data.value && (props.manual ?? true))
      request.runParams(createInitialQuery())
  }

  function onUpdateValue(val: V | null, option: SelectOption | SelectOption[] | null) {
    rememberRows(request.list.value)
    const raw = Array.isArray(val)
      ? val.map(item => selectedCache.get(item)).filter((row): row is R => !!row)
      : val === null || val === undefined
        ? null
        : selectedCache.get(val) ?? null

    emit(
      'update:value',
      val,
      option,
      Array.isArray(raw) ? raw.map(item => toRaw(item)) : toRaw(raw),
    )
  }

  const pagination = useRemotePagination<P, D, R>(request, fields, () => props.pagination)
  const paginationHandlers = {
    onUpdatePage: (page: number) => {
      emit('update:page', page)
      pagination.handlers.onUpdatePage(page)
    },
    onUpdatePageSize: (pageSize: number) => {
      emit('update:pageSize', pageSize)
      pagination.handlers.onUpdatePageSize(pageSize)
    },
  }

  const { expose, slotProps } = createExpose({
    ...request,
    selectInst: selectInstRef,
  })

  return {
    ...request,
    fields,
    options,
    fallbackOption,
    handlers: {
      onSearch,
      onUpdateShow,
      onUpdateValue,
    },
    paginationBindings: pagination.bindings,
    paginationHandlers,
    expose,
    slotProps,
  }
}
