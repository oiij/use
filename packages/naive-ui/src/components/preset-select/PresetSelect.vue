<script setup lang='ts'
  generic="
    V extends PresetSelectValue,
    P extends RObject,
    D extends RObject,
    R extends RObject,
  "
>
import type { PaginationProps, SelectGroupOption, SelectOption } from 'naive-ui'
import type { RObject } from '../remote-request/index'
import type { PresetSelectEmits, PresetSelectExposeActions, PresetSelectExposeRefs, PresetSelectPagination, PresetSelectProps, PresetSelectValue } from './index'
import { useDebounceFn } from '@vueuse/core'
import { NFlex, NPagination, NSelect } from 'naive-ui'
import { computed, reactive, ref, toRaw, toValue, useTemplateRef } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'

const {
  api,
  value,
  fallbackLabel,
  defaultParams: propsParams,
  manual = true,
  multiple = false,
  disabled,
  clearable,
  debounce = true,
  optionFormat,
  fields,
  selectProps,
  pagination,
  requestOptions,
  requestPlugins,
} = defineProps<PresetSelectProps<V, P, D, R>>()

const emit = defineEmits<PresetSelectEmits<V, P, D, R>>()
const selectRef = useTemplateRef('select-ref')
const _fields = { page: 'page', pageSize: 'pageSize', search: 'search', list: 'list', count: 'count', label: 'label', value: 'value', children: 'children', ...fields }
const paginationProps = reactive<PaginationProps>({
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  pageSlot: 5,
  prefix: (info) => {
    return `共${info.itemCount}条数据`
  },
  ...(pagination && typeof pagination === 'boolean' ? {} : pagination),
})
const paginationRef = ref<PresetSelectPagination>({
  page: 1,
  pageSize: 10,
  itemCount: 0,
})
const _defaultParams = {
  [_fields.page]: paginationRef.value.page,
  [_fields.pageSize]: paginationRef.value.pageSize,
  [_fields.search]: '',
  ...propsParams,
} as P

const { data, error, loading, params, run, runAsync, refresh, refreshAsync, cancel, mutate } = useRequest<D, P[]>(api, {
  defaultParams: [
    _defaultParams,
  ],
  manual,
  ...requestOptions,
  onBefore: (params) => {
    requestOptions?.onBefore?.(params)
    emit('before', params)
  },
  onSuccess: (data, params) => {
    requestOptions?.onSuccess?.(data, params)
    emit('success', data, params)
    onSuccessEffect(data, params)
  },
  onError: (err, params) => {
    requestOptions?.onError?.(err, params)
    emit('error', err, params)
  },
  onFinally: (params, data, err) => {
    requestOptions?.onFinally?.(params, data, err)
    emit('finally', params, data, err)
  },

}, requestPlugins)
const rawList = computed(() => {
  if (!data.value)
    return []
  if (!Array.isArray(data.value[_fields.list])) {
    console.warn(`DataTablePlus: data[${_fields.list}] must be an array`)
    return []
  }
  const list = data.value[_fields.list] as R[]
  return list
})
const optionsReactive = computed<(SelectOption | SelectGroupOption)[]>(() => {
  return typeof optionFormat === 'function'
    ? rawList.value.map(m => optionFormat(m)).filter(f => !!f) as (SelectOption | SelectGroupOption)[]
    : rawList.value.map((m) => {
        return {
          [_fields.label]: m[_fields.label],
          [_fields.value]: m[_fields.value],
          [_fields.children]: m[_fields.children],
        }
      })
})

function onSuccessEffect(data: D, params: P[]) {
  paginationRef.value.page = params[0] && _fields.page in params[0] ? Number(params[0][_fields.page]) : 1
  paginationRef.value.pageSize = params[0] && _fields.pageSize in params[0] ? Number(params[0][_fields.pageSize]) : 10
  paginationRef.value.itemCount = _fields.count in data ? Number(data[_fields.count]) : 0
}
function _run(_params?: Partial<P>) {
  return run({
    ...params.value[0],
    ..._params,
  })
}
const searchValue = ref('')
const debounceSearch = useDebounceFn(() => {
  _run({
    [_fields.page]: 1,
    [_fields.search]: searchValue.value,
  } as P)
}, typeof debounce === 'number' ? debounce : 500)
const vOnSelect = {
  onBlur: (ev: FocusEvent) => {
    emit('blur', ev)
  },
  onClear: () => {
    emit('clear')
  },
  onCreate: (label: string) => {
    return emit('create', label)
  },
  onFocus: (ev: FocusEvent) => {
    emit('focus', ev)
  },
  onScroll: (ev: Event) => {
    emit('scroll', ev)
  },

  onUpdateValue: (val: V | null, option: SelectOption | SelectOption[] | null) => {
    const rawSelectValue = Array.isArray(val) ? rawList.value.filter(f => val.includes(f[_fields.value])) : rawList.value.find(f => f[_fields.value] === val) ?? null
    emit('update:value', val, option, toRaw(toValue(rawSelectValue)))
  },
  onSearch: (val: string) => {
    searchValue.value = val
    if (loading.value)
      return
    debounce
      ? debounceSearch()
      : _run({
          [_fields.page]: 1,
          [_fields.search]: searchValue.value,
        } as P)
  },
  onUpdateShow: (show: boolean) => {
    if (show) {
      if (!data.value) {
        if (manual) {
          run(_defaultParams)
        }
      }
    }
  },
}
const vOnPagination = {
  onUpdatePage: (page: number) => {
    emit('update:page', page)
    if (loading.value)
      return
    _run({
      [_fields.page]: page,
    } as P)
  },
  onUpdatePageSize: (pageSize: number) => {
    emit('update:pageSize', pageSize)
    if (loading.value)
      return
    _run({
      [_fields.pageSize]: pageSize,
    } as P)
  },
}
function fallbackOption(val: string | number): SelectOption {
  return typeof fallbackLabel === 'function'
    ? fallbackLabel(val)
    : {
        [_fields.label]: fallbackLabel ?? `${val}`,
        [_fields.value]: val,
      }
}

const exposeRefs: PresetSelectExposeRefs<P, D, R> = {
  loading,
  data,
  error,
  params,
  pagination: paginationRef,
  rawList,
  selectRef,
}
const exposeActions: PresetSelectExposeActions<P, D> = {
  run,
  runAsync,
  refresh,
  refreshAsync,
  cancel,
  mutate,
  setParams: (_params: Partial<P>) => {
    Object.assign(params.value[0], _params)
  },
  runParams: (_params: Partial<P>) => {
    return run(Object.assign(params.value[0], _params))
  },
  runParamsAsync: async (_params: Partial<P>) => {
    return runAsync(Object.assign(params.value[0], _params))
  },
}
defineExpose({
  refs: exposeRefs,
  actions: exposeActions,
})
</script>

<template>
  <NSelect
    ref="select-ref"
    remote
    filterable
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :options="optionsReactive"
    :label-field="_fields.label"
    :value-field="_fields.value"
    :children-field="_fields.children"
    :value="value"
    :fallback-option="fallbackOption"
    :loading="loading"
    v-bind="selectProps"
    @blur="vOnSelect.onBlur"
    @clear="vOnSelect.onClear"
    @create="vOnSelect.onCreate"
    @focus="vOnSelect.onFocus"
    @scroll="vOnSelect.onScroll"
    @search="vOnSelect.onSearch"
    @update:show="vOnSelect.onUpdateShow"
    @update:value="vOnSelect.onUpdateValue"
  >
    <template #header>
      <slot name="header" :refs="exposeRefs" :actions="exposeActions" />
    </template>
    <template #action>
      <slot name="footer" :refs="exposeRefs" :actions="exposeActions">
        <NFlex>
          <slot name="footer-extra" :refs="exposeRefs" :actions="exposeActions" />
          <NPagination
            v-if="pagination"
            style="margin-left: auto;"
            simple
            :disabled="loading"
            v-bind="{ ...paginationProps, ...paginationRef }"
            @update:page="vOnPagination.onUpdatePage"
            @update:page-size="vOnPagination.onUpdatePageSize"
          />
        </NFlex>
      </slot>
    </template>
    <template #empty>
      <slot name="empty" />
    </template>
    <template #arrow>
      <slot name="arrow" />
    </template>
  </NSelect>
</template>

<style scoped>

</style>
