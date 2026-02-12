<script setup lang='ts' generic="P extends DataObject, D extends DataObject, R extends DataObject">
import type { DataTableBaseColumn, DataTableColumns, DataTableFilterState, DataTableInst, DataTableSortState, PaginationProps } from 'naive-ui'

import type { InternalRowData, RowKey } from 'naive-ui/es/data-table/src/interface'
import type { DataObject } from '../../composables/index'
import type { DataTablePlusEmits, DataTablePlusExpose, DataTablePlusFields, DataTablePlusProps } from './index'
import { NDataTable, NFlex, NPagination } from 'naive-ui'
import { computed, reactive, ref, toRaw, useTemplateRef, watchEffect } from 'vue'
import { useDataRequest } from '../../composables/use-data-request'
import { NSearchInput } from '../search-input/index'

const { api, defaultParams, title, manual, columns, fields, search, pagination: propsPagination, columnsFilterOptions, columnsSorterOptions, requestOptions, requestPlugins, dataTableProps } = defineProps<DataTablePlusProps<P, D, R>>()
const emit = defineEmits<DataTablePlusEmits<P, D, R>>()

const columnsReactive = reactive<DataTableColumns<R>>(columns ?? [])
const dataTableInst = useTemplateRef<DataTableInst>('data-table-ref')

const _fields: Required<DataTablePlusFields> = {
  page: 'page',
  pageSize: 'pageSize',
  filter: 'filter',
  sorter: 'sorter',
  list: 'list',
  count: 'count',
  rowKey: 'id',
  search: 'search',
  children: 'children',
  ...fields,
}
const searchProps = {
  ...(search && typeof search === 'boolean' ? {} : search),
}
const paginationProps = reactive<PaginationProps>({
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  pageSlot: 5,
  prefix: info => `共${info.itemCount}条数据`,
  ...(propsPagination && typeof propsPagination === 'boolean' ? {} : propsPagination),
})

const filtersRef = ref<DataTableFilterState>()
const sortersRef = ref<Record<string, DataTableSortState>>()

const { loading, data, error, params, list, pagination: paginationRef, run, runAsync, refresh, refreshAsync, cancel, mutate, setParams, runParams, runParamsAsync, onBefore, onSuccess, onError, onFinally } = useDataRequest<P, D, R>(api, {
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
  updateColumnFiltersAndSorters()
})
onError((err, params) => {
  emit('error', err, params)
})
onFinally((params, data, err) => {
  emit('finally', params, data, err)
})
function getRawList() {
  return toRaw(list.value)
}
watchEffect(() => {
  emit('loadedRows', getRawList())
})
const scrollX = computed(() => {
  function nanAble(val?: number | string) {
    return Number.isNaN(Number(val)) ? 0 : Number(val)
  }
  return columns?.reduce((sum, column) => sum + (nanAble(column.width ?? 100)), 0) ?? 0
})

function isBaseColumnWithKey(column: any): column is DataTableBaseColumn {
  return column && 'key' in column
}

function updateColumnFilters(column: DataTableBaseColumn) {
  if (!filtersRef.value || !isBaseColumnWithKey(column) || !('filter' in column) || !column.filter)
    return

  const filterValues = filtersRef.value[column.key]
  if (!filterValues)
    return

  if (column.filterMultiple) {
    column.filterOptionValues = Array.isArray(filterValues) ? filterValues : [filterValues]
  }
  else {
    column.filterOptionValue = Array.isArray(filterValues) ? filterValues[0] : filterValues
  }
}

function updateColumnSorter(column: DataTableBaseColumn) {
  if (!sortersRef.value || !isBaseColumnWithKey(column) || !('sorter' in column) || !column.sorter)
    return

  const sorterValue = sortersRef.value[column.key]
  if (sorterValue) {
    column.sortOrder = sorterValue.order
  }
}

function updateColumnFiltersAndSorters() {
  if (!columnsReactive)
    return

  for (const item of columnsReactive) {
    if (!isBaseColumnWithKey(item))
      continue

    if ('sorter' in item && typeof item.sorter === 'boolean') {
      item.sortOrder = false
    }

    updateColumnFilters(item)
    updateColumnSorter(item)
  }
}

const eventHandlers = {
  handlePageUpdate: (page: number) => {
    emit('update:page', page)
    if (!loading.value) {
      runParams({ [_fields.page]: page } as P)
    }
  },
  handlePageSizeUpdate: (pageSize: number) => {
    emit('update:pageSize', pageSize)
    if (!loading.value) {
      runParams({ [_fields.pageSize]: pageSize } as P)
    }
  },
  handleFiltersUpdate: (filters: DataTableFilterState, initiatorColumn: DataTableBaseColumn) => {
    emit('update:filters', filters, initiatorColumn)
    filtersRef.value = filters
    runParams({
      [_fields.page]: 1,
      ...(columnsFilterOptions ? columnsFilterOptions(filters) : { [_fields.filter]: filters }),
    } as P)
  },
  handleSorterUpdate: (options: DataTableSortState | DataTableSortState[] | null) => {
    emit('update:sorter', options)
    const sorter: Record<string, DataTableSortState> = {}
    if (Array.isArray(options)) {
      options.forEach((item) => {
        sorter[item.columnKey] = item
      })
    }
    else if (options) {
      sorter[options.columnKey] = options
    }
    sortersRef.value = sorter
    runParams({
      [_fields.page]: 1,
      ...(columnsSorterOptions ? columnsSorterOptions(sorter) : { [_fields.sorter]: sorter }),
    } as P)
  },
  handleCheckedRowKeysUpdate: (keys: RowKey[], rows: InternalRowData[], meta: {
    row: InternalRowData | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }) => {
    emit('update:checkedRowKeys', keys, rows as R[], { row: meta.row as R | undefined, action: meta.action }, getRawList())
  },
}

function rowProps(row: R, index: number) {
  const rawRow = toRaw(row)
  const rawList = getRawList()
  return {
    onClick: (event: MouseEvent) => {
      emit('clickRow', rawRow, index, event, rawList)
    },
    onContextmenu: (event: MouseEvent) => {
      emit('contextMenuRow', rawRow, index, event, rawList)
    },
  }
}

function handleSearch(val: any) {
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
  pagination: paginationRef,
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
  dataTableInst,
}
const templateBind = computed(() => {
  return {
    ...expose,
    loading: loading.value,
    data: data.value,
    error: error.value,
    params: params.value,
    list: list.value,
    pagination: paginationRef.value,
    filters: filtersRef.value,
    sorters: sortersRef.value,
    dataTableInst: dataTableInst.value,
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
          :value="params?.[0]?.[_fields.search]"
          :loading="loading"
          v-bind="searchProps"
          @update:value="(val?:string | null) => handleSearch(val) "
        />
        <slot name="header-extra" v-bind="templateBind" />
      </NFlex>
    </slot>
    <slot name="filter" v-bind="templateBind" />
    <div :style="{ flex: 1, position: 'relative' }">
      <NDataTable
        ref="data-table-ref"
        remote
        flex-height
        :single-line="false"
        :scroll-x="scrollX"
        :style="{ width: '100%', height: '100%' }"
        :row-key="(row:R) => row?.[_fields.rowKey]"
        :children-key="_fields.children"
        :loading="loading"
        :columns="columnsReactive"
        :data="list"
        :row-props="rowProps"
        v-bind="dataTableProps"
        @update:filters="eventHandlers.handleFiltersUpdate"
        @update:sorter="eventHandlers.handleSorterUpdate"
        @update:checked-row-keys="eventHandlers.handleCheckedRowKeysUpdate"
      >
        <template #empty>
          <slot name="empty" v-bind="templateBind" />
        </template>
        <template #loading>
          <slot name="loading" v-bind="templateBind" />
        </template>
      </NDataTable>
    </div>
    <slot name="footer" v-bind="templateBind">
      <NFlex>
        <slot name="footer-extra" v-bind="templateBind" />
        <NPagination
          v-if="propsPagination"
          :style="{ marginLeft: 'auto' }"
          :disabled="loading"
          v-bind="{ ...paginationProps, ...paginationRef }"
          @update:page="eventHandlers.handlePageUpdate"
          @update:page-size="eventHandlers.handlePageSizeUpdate"
        />
      </NFlex>
    </slot>
  </NFlex>
</template>

<style scoped>

</style>
