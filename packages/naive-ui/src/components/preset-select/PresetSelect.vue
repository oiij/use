<script setup lang='ts' generic="V extends PresetSelectValue, P extends DataObject, D extends DataObject, R extends DataObject">
import type { PaginationProps, SelectGroupOption, SelectInst, SelectOption } from 'naive-ui'
import type { DataObject } from '../../composables/useDataRequest'
import type { PresetSelectEmits, PresetSelectExpose, PresetSelectProps, PresetSelectValue } from './index'
import { useDebounceFn } from '@vueuse/core'
import { NFlex, NPagination, NSelect } from 'naive-ui'
import { computed, reactive, ref, toRaw, toValue, useTemplateRef } from 'vue'
import { useDataRequest } from '../../composables/useDataRequest'

const {
  api,
  value,
  fallbackLabel,
  defaultParams,
  manual = true,
  multiple = false,
  disabled,
  clearable,
  debounce = true,
  optionFormat,
  fields,
  selectProps,
  pagination: propsPagination,
  requestOptions,
  requestPlugins,
} = defineProps<PresetSelectProps<V, P, D, R>>()

const emit = defineEmits<PresetSelectEmits<V, P, D, R>>()
const selectRef = useTemplateRef<SelectInst>('select-ref')
const _fields = { page: 'page', pageSize: 'pageSize', search: 'search', list: 'list', count: 'count', label: 'label', value: 'value', rowKey: 'id', children: 'children', ...fields }
const paginationProps = reactive<PaginationProps>({
  ...(propsPagination && typeof propsPagination === 'boolean' ? {} : propsPagination),
})

const _dataCache: R[] = []

const { loading, data, error, params, list, pagination, run, runAsync, refresh, refreshAsync, cancel, mutate, setParams, runParams, runParamsAsync, onBefore, onSuccess, onError, onFinally } = useDataRequest<P, D, R>(api, {
  defaultParams: {
    [_fields.search]: null,
    ...defaultParams,
  } as P,
  manual,
  fields: _fields,
  requestOptions,
  requestPlugins,
})

onBefore((params) => {
  emit('before', params)
})
onSuccess((data, params) => {
  emit('success', data, params)
  data?.[_fields.list]?.forEach((f: any) => {
    if (!_dataCache.some(s => s?.[_fields.rowKey] === f?.[_fields.rowKey])) {
      _dataCache.push(f)
    }
  })
})
onError((err, params) => {
  emit('error', err, params)
})
onFinally((params, data, err) => {
  emit('finally', params, data, err)
})

const optionsReactive = computed<(SelectOption | SelectGroupOption)[]>(() => {
  return typeof optionFormat === 'function'
    ? list.value.map(m => optionFormat(m)).filter(f => !!f) as (SelectOption | SelectGroupOption)[]
    : list.value.map((m) => {
        return {
          [_fields.label]: m?.[_fields.label],
          [_fields.value]: m?.[_fields.value],
          [_fields.children]: m?.[_fields.children],
        }
      })
})

const searchValue = ref('')
const debounceSearch = useDebounceFn(() => {
  runParams({
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
    const rawSelectValue = Array.isArray(val) ? list.value.filter(f => val.includes(f?.[_fields.value])) : list.value.find(f => f?.[_fields.value] === val) ?? null
    emit('update:value', val, option, toRaw(toValue(rawSelectValue)))
  },
  onSearch: (val: string) => {
    searchValue.value = val
    if (loading.value)
      return
    debounce
      ? debounceSearch()
      : runParams({
          [_fields.page]: 1,
          [_fields.search]: searchValue.value,
        } as P)
  },
  onUpdateShow: (show: boolean) => {
    if (show) {
      if (!data.value) {
        if (manual) {
          runParams({
            [_fields.page]: 1,
            [_fields.pageSize]: 10,
            [_fields.search]: null,
            ...defaultParams ?? {} as P,
          })
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
    runParams({
      [_fields.page]: page,
    } as P)
  },
  onUpdatePageSize: (pageSize: number) => {
    emit('update:pageSize', pageSize)
    if (loading.value)
      return
    runParams({
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

const expose: PresetSelectExpose<P, D, R> = {
  loading,
  data,
  error,
  params,
  list,
  pagination,
  run,
  runAsync,
  refresh,
  refreshAsync,
  cancel,
  mutate,
  setParams,
  runParams,
  runParamsAsync,
  onBefore,
  onSuccess,
  onError,
  onFinally,
  selectRef,
}
const templateBind = computed(() => {
  return {
    ...expose,
    loading: toValue(loading),
    data: toValue(data),
    error: toValue(error),
    params: toValue(params),
    list: toValue(list),
    pagination: toValue(pagination),
    selectRef: toValue(selectRef),
  }
})

defineExpose(expose)
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
      <slot name="header" v-bind="templateBind" />
    </template>
    <template #action>
      <slot name="footer" v-bind="templateBind">
        <NFlex>
          <slot name="footer-extra" v-bind="templateBind" />
          <NPagination
            v-if="pagination"
            :style="{ marginLeft: 'auto' }"
            simple
            :disabled="loading"
            v-bind="{ ...paginationProps, ...pagination }"
            @update:page="vOnPagination.onUpdatePage"
            @update:page-size="vOnPagination.onUpdatePageSize"
          />
        </NFlex>
      </slot>
    </template>
    <template #empty>
      <slot name="empty" v-bind="templateBind" />
    </template>
    <template #arrow>
      <slot name="arrow" v-bind="templateBind" />
    </template>
  </NSelect>
</template>

<style scoped>

</style>
