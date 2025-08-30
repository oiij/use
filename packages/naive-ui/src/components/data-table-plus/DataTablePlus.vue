<script setup lang='ts'
  generic="
    P extends DataObject,
    D extends DataObject,
    R extends DataObject
  "
>
import type { DataTableBaseColumn, DataTableColumns, DataTableFilterState, DataTableInst, DataTableSortState, PaginationProps } from 'naive-ui'

import type { InternalRowData, RowKey } from 'naive-ui/es/data-table/src/interface'
import type { DataObject } from '../../composables/index'
import type { DataTablePlusEmits, DataTablePlusExpose, DataTablePlusProps } from './index'
import { NDataTable, NFlex, NPagination } from 'naive-ui'
import { computed, reactive, ref, toRaw, toValue, useTemplateRef } from 'vue'
import { useDataRequest } from '../../composables/index'
import { NSearchInput } from '../search-input/index'

const {
  api,
  defaultParams,
  title,
  manual,
  columns,
  fields,
  search,
  pagination: propsPagination,
  columnsFilterOptions,
  columnsSorterOptions,
  requestOptions,
  requestPlugins,
  dataTableProps,
} = defineProps<DataTablePlusProps<P, D, R>>()
const emit = defineEmits<DataTablePlusEmits<P, D, R>>()

const columnsReactive = reactive<DataTableColumns<R>>(columns ?? [])
const dataTableRef = useTemplateRef<DataTableInst>('data-table-ref')

const _fields = { page: 'page', pageSize: 'pageSize', filter: 'filter', sorter: 'sorter', list: 'list', count: 'count', rowKey: 'id', search: 'search', children: 'children', ...fields }
const searchProps = {
  ...(search && typeof search === 'boolean' ? {} : search),
}
const paginationProps = reactive<PaginationProps>({
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  pageSlot: 5,
  prefix: (info) => {
    return `共${info.itemCount}条数据`
  },
  ...(propsPagination && typeof propsPagination === 'boolean' ? {} : propsPagination),
})

const filtersRef = ref<DataTableFilterState>()
const sortersRef = ref<Record<string, DataTableSortState>>()

const _dataCache: R[] = []

const { loading, data, error, params, list, pagination, run, runAsync, refresh, refreshAsync, cancel, mutate, setParams, runParams, runParamsAsync, onBefore, onSuccess, onError, onFinally } = useDataRequest<P, D, R>(api, {
  defaultParams,
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
  onSuccessEffect(data, params)
})
onError((err, params) => {
  emit('error', err, params)
})
onFinally((params, data, err) => {
  emit('finally', params, data, err)
})

const scrollX = computed(() => {
  return columns?.reduce((pre, cur) => {
    return pre + Number(cur.width ?? 100)
  }, 0)
})
function onSuccessEffect(data: D, _params: P[]) {
  data[_fields.list]?.forEach((f: any) => {
    if (!_dataCache.some(s => s[_fields.rowKey] === f[_fields.rowKey])) {
      _dataCache.push(f)
    }
  })
  if (columnsReactive) {
    for (const item of columnsReactive) {
      if ('key' in item) {
        if (filtersRef.value && item.key in filtersRef.value) {
          const filterValues = filtersRef.value[item.key]
          if (filterValues && 'filter' in item && item.filter) {
            if (item.filterMultiple) {
              if (Array.isArray(filterValues)) {
                item.filterOptionValues = filterValues
              }
              else {
                item.filterOptionValues = [filterValues]
              }
            }
            else {
              if (Array.isArray(filterValues)) {
                item.filterOptionValue = filterValues[0]
              }
              else {
                item.filterOptionValue = filterValues
              }
            }
          }
        }
        if ('sorter' in item) {
          if (typeof item.sorter === 'boolean') {
            item.sortOrder = false
          }
        }
        if (sortersRef.value && item.key in sortersRef.value) {
          const sorterValue = sortersRef.value[item.key]
          if (sorterValue && 'sorter' in item && item.sorter) {
            item.sortOrder = sorterValue.order
          }
        }
      }
    }
  }
}

const vOn = {
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
  onUpdateFilters: (filters: DataTableFilterState, initiatorColumn: DataTableBaseColumn) => {
    emit('update:filters', filters, initiatorColumn)
    filtersRef.value = filters
    runParams({
      [_fields.page]: 1,
      ...columnsFilterOptions ? columnsFilterOptions(filters) : { [_fields.filter]: filters },
    } as P)
  },
  onUpdateSorter: (options: DataTableSortState | DataTableSortState[] | null) => {
    emit('update:sorter', options)
    const sorter: Record<string, DataTableSortState> = {}
    if (Array.isArray(options)) {
      for (const item of options) {
        sorter[item.columnKey] = item
      }
    }
    else if (options) {
      sorter[options.columnKey] = options
    }
    sortersRef.value = sorter
    runParams({
      [_fields.page]: 1,
      ...columnsSorterOptions ? columnsSorterOptions(sorter) : { [_fields.sorter]: sorter },
    } as P)
  },
  onLoad: (row: any) => {
    return emit('load', row as R)
  },
  onScroll: (ev: Event) => {
    emit('scroll', ev)
  },
  onUpdateCheckedRowKeys: (keys: RowKey[], _rows: InternalRowData[], meta: {
    row: InternalRowData | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }) => {
    const rows = keys.map(m => _dataCache.find(f => f[_fields.rowKey] === m))
    emit('update:checkedRowKeys', keys, rows, { row: toRaw(meta.row) as R | undefined, action: meta.action }, toRaw(list.value))
  },
  onUpdateExpandedRowKeys: (keys: (string | number)[]) => {
    emit('update:expandedRowKeys', keys, toRaw(list.value))
  },
}

function rowProps(row: R, index: number) {
  return {
    onClick: (event: MouseEvent) => {
      emit('clickRow', toRaw(row), index, event, toRaw(list.value))
    },
    onContextmenu: (event: MouseEvent) => {
      emit('contextMenuRow', toRaw(row), index, event, toRaw(list.value))
    },
  }
}

function onSearch(val: any) {
  if (loading.value)
    return

  runParams({
    [_fields.page]: 1,
    [_fields.search]: val,
  } as P)
}

const expose: DataTablePlusExpose<P, D, R> = {
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
  filters: filtersRef,
  sorters: sortersRef,
  dataTableRef,
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
    filters: toValue(filtersRef),
    sorters: toValue(sortersRef),
    dataTableRef: toValue(dataTableRef),
  }
})

defineExpose(expose)
</script>

<template>
  <NFlex :style="{ width: '100%', height: '100%' }" vertical>
    <slot name="header" v-bind="templateBind">
      <NFlex>
        <slot name="title">
          <div :style="{ height: '100%', display: 'flex', alignItems: 'center' }">
            <span v-if="title" :style="{ fontSize: '16px' }">{{ title }}</span>
          </div>
        </slot>
        <NSearchInput
          v-if="search"
          :style="{ marginLeft: 'auto', width: '280px' }"
          :value="params[0][_fields.search]"
          :loading="loading"
          v-bind="searchProps"
          @update:value="(val) => onSearch(val) "
        />
        <slot name="header-extra" v-bind="templateBind" />
      </NFlex>
    </slot>
    <slot name="filter" v-bind="templateBind" />
    <NDataTable
      ref="data-table-ref"
      remote
      flex-height
      :single-line="false"
      :scroll-x="scrollX"
      :style="{ flex: 1 }"
      :row-key="row => row[_fields.rowKey]"
      :children-key="_fields.children"
      :loading="loading"
      :columns="columnsReactive"
      :data="list"
      :row-props="rowProps"
      v-bind="dataTableProps"
      @update:filters="vOn.onUpdateFilters"
      @update:sorter="vOn.onUpdateSorter"
      @load="vOn.onLoad"
      @scroll="vOn.onScroll"
      @update:checked-row-keys="vOn.onUpdateCheckedRowKeys"
      @update:expanded-row-keys="vOn.onUpdateExpandedRowKeys"
    >
      <template #empty>
        <slot name="empty" v-bind="templateBind" />
      </template>
      <template #loading>
        <slot name="loading" v-bind="templateBind" />
      </template>
    </NDataTable>
    <slot name="footer" v-bind="templateBind">
      <NFlex>
        <slot name="footer-extra" v-bind="templateBind" />
        <NPagination
          v-if="pagination"
          :style="{ marginLeft: 'auto' }"
          :disabled="loading"
          v-bind="{ ...paginationProps, ...pagination }"
          @update:page="vOn.onUpdatePage"
          @update:page-size="vOn.onUpdatePageSize"
        />
      </NFlex>
    </slot>
  </NFlex>
</template>

<style scoped>

</style>
