<script setup lang='ts'
  generic="
    P extends RObject,
    D extends RObject,
    R extends RObject
  "
>
import type { DataTableBaseColumn, DataTableColumns, DataTableFilterState, DataTableInst, DataTableSortState, PaginationProps } from 'naive-ui'
import type { InternalRowData, RowKey } from 'naive-ui/es/data-table/src/interface'
import type { RObject } from '../remote-request/index'
import type { DataTablePlusEmits, DataTablePlusExposeActions, DataTablePlusExposeRefs, DataTablePlusPagination, DataTablePlusProps } from './index'
import { NBadge, NButton, NCollapseTransition, NDataTable, NDivider, NFlex, NModal, NPagination } from 'naive-ui'
import { computed, reactive, ref, toRaw, toValue, useTemplateRef } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'
import { NSearchInput } from '../search-input/index'
import FlexFilter from './FlexFilter.vue'
import GridFilter from './GridFilter.vue'

const {
  api,
  defaultParams,
  title,
  manual,
  columns,
  filterOptions,
  filterGridProps,
  filterFlexProps,
  filterLayout = 'grid',
  filterCollapsedType = 'collapsed',
  filterModalProps,
  filterModalTrigger = 'manual',
  filterLabel = '更多筛选',
  fields,
  search,
  pagination,
  clearable,
  columnsFilterOptions,
  columnsSorterOptions,
  dataTableProps,
  requestOptions,
  requestPlugins,
  style: _style,
  class: _class,
} = defineProps<DataTablePlusProps<P, D, R>>()
const emit = defineEmits<DataTablePlusEmits<P, D, R>>()
const _filterLayout = computed(() => {
  const _layout = typeof filterLayout === 'string' ? [filterLayout, filterLayout] : filterLayout
  return {
    grid: _layout[0] === 'grid',
    flex: _layout[0] === 'flex',
    collapsedGrid: _layout[1] === 'grid',
    collapsedFlex: _layout[1] === 'flex',
  }
})

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
  ...(pagination && typeof pagination === 'boolean' ? {} : pagination),
})
const paginationRef = ref<DataTablePlusPagination>({
  page: 1,
  pageSize: 10,
  itemCount: 0,
})
const filtersRef = ref<DataTableFilterState>()
const sortersRef = ref<Record<string, DataTableSortState>>()
const _defaultParams = {
  [_fields.page]: paginationRef.value.page,
  [_fields.pageSize]: paginationRef.value.pageSize,
  [_fields.search]: null,
  ...defaultParams,
} as P
const _defaultParamsCache = structuredClone(toRaw(toValue(_defaultParams)))
const { loading, data, error, params, run, runAsync, refresh, refreshAsync, cancel, mutate } = useRequest<D, P[]>(api, {
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
const _dataCache: R[] = []
const rawList = computed(() => {
  if (!data.value)
    return []
  if (!Array.isArray(data.value[_fields.list])) {
    console.warn(`DataTablePlus: data[${_fields.list}] must be an array`)
    return []
  }
  return data.value[_fields.list] as R[]
})
const scrollX = computed(() => {
  return columns?.reduce((pre, cur) => {
    return pre + Number(cur.width ?? 100)
  }, 0)
})
function onSuccessEffect(data: D, params: P[]) {
  data[_fields.list]?.forEach((f: any) => {
    if (!_dataCache.some(s => s[_fields.rowKey] === f[_fields.rowKey])) {
      _dataCache.push(f)
    }
  })
  paginationRef.value.page = _fields.page in params[0] ? Number(params[0][_fields.page]) : 1
  paginationRef.value.pageSize = _fields.pageSize in params[0] ? Number(params[0][_fields.pageSize]) : 10
  paginationRef.value.itemCount = _fields.count in data ? Number(data[_fields.count]) : 0

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

function _run(_params: Partial<P>) {
  return run({
    ...params.value[0],
    ..._params,
  })
}
const vOn = {
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
  onUpdateFilters: (filters: DataTableFilterState, initiatorColumn: DataTableBaseColumn) => {
    emit('update:filters', filters, initiatorColumn)
    filtersRef.value = filters
    _run({
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
    _run({
      [_fields.page]: 1,
      ...columnsSorterOptions ? columnsSorterOptions(sorter) : { [_fields.sorter]: sorter },
    } as P)
  },
  onLoad: (row: any) => {
    return emit('load', row as R)
  },
  onScroll: (e: Event) => {
    emit('scroll', e)
  },
  onUpdateCheckedRowKeys: (keys: RowKey[], _rows: InternalRowData[], meta: {
    row: InternalRowData | undefined
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }) => {
    const rows = keys.map(m => _dataCache.find(f => f[_fields.rowKey] === m))
    emit('update:checkedRowKeys', keys, rows, { row: toRaw(meta.row) as R | undefined, action: meta.action }, toRaw(rawList.value))
  },
  onUpdateExpandedRowKeys: (keys: (string | number)[]) => {
    emit('update:expandedRowKeys', keys, toRaw(rawList.value))
  },
}

function rowProps(row: R, index: number) {
  return {
    onClick: (event: MouseEvent) => {
      emit('clickRow', toRaw(row), index, event, toRaw(rawList.value))
    },
    onContextmenu: (event: MouseEvent) => {
      emit('contextMenuRow', toRaw(row), index, event, toRaw(rawList.value))
    },
  }
}

const filterCollapsed = ref(false)
const _paramsCache = ref<P>({} as P)

function onValueUpdate(val: any, key?: keyof P, manual?: boolean) {
  if (key) {
    if (manual) {
      if (filterModalTrigger === 'manual') {
        _paramsCache.value[key] = val
      }
      if (filterModalTrigger === 'auto') {
        _run({
          [key]: val,
        } as P)
      }
    }
    else {
      _run({
        [key]: val,
      } as P)
    }
  }
}
const modalFlag = ref(false)
function showFilterModal() {
  modalFlag.value = true
}
function resetParams() {
  _run(_defaultParamsCache)
}

function handlePositiveClick() {
  _run(_paramsCache.value)
}
const showBadgeFlag = computed(() => {
  const excludeKeys = [_fields.page, _fields.pageSize]
  return Object
    .entries(params.value[0])
    .filter(([key]) => !excludeKeys.includes(key))
    .some(([_key, val]) => !(
      val === undefined
      || val === null
      || (Array.isArray(val) && val.length === 0)
      || (typeof val === 'string' && val.trim() === '')
      || (typeof val === 'boolean' && val === true)
    ))
})
const exposeRefs: DataTablePlusExposeRefs<P, D, R> = {
  loading,
  data,
  error,
  params,
  pagination: paginationRef,
  filters: filtersRef,
  sorters: sortersRef,
  rawList,
  dataTableRef,
}
const exposeActions: DataTablePlusExposeActions<P, D> = {
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
  showFilterModal,
  resetParams,
}
const _options = computed(() => filterOptions?.filter(f => typeof f.hidden === 'function' ? !f.hidden(exposeRefs) : !f.hidden).filter(f => !f.collapsed))
const _collapsedOptions = computed(() => filterOptions?.filter(f => typeof f.hidden === 'function' ? !f.hidden(exposeRefs) : !f.hidden).filter(f => f.collapsed))

defineExpose({
  refs: exposeRefs,
  actions: exposeActions,
})
</script>

<template>
  <NFlex vertical>
    <slot name="header" :refs="exposeRefs" :actions="exposeActions">
      <NFlex>
        <slot name="title">
          <div style="height:100%;display:flex;align-items:center;">
            <span v-if="title" style="font-size:16px;">{{ title }}</span>
          </div>
        </slot>
        <NSearchInput
          v-if="search"
          style="margin-left: auto;width:260px"
          :value="params[0][_fields.search]"
          :loading="loading"
          v-bind="searchProps"
          @update:value="(val) => _run({ [ _fields.search]: val } as P) "
        />
        <NBadge :show="showBadgeFlag" dot>
          <NButton v-if="filterCollapsedType === 'modal'" @click="showFilterModal">
            {{ filterLabel }}
          </NButton>
        </NBadge>
        <NButton v-if="clearable" @click="resetParams">
          清除
        </NButton>
        <slot name="header-extra" :refs="exposeRefs" :actions="exposeActions" />
      </NFlex>
    </slot>
    <slot name="filter" :refs="exposeRefs" :actions="exposeActions">
      <NFlex vertical>
        <GridFilter
          v-if="_filterLayout.grid"
          :options="_options"
          :expose-refs="exposeRefs"
          :expose-actions="exposeActions"
          :params="params"
          :grid-props="filterGridProps"
          @update:value="(val, key) => onValueUpdate(val, key)"
        />
        <FlexFilter
          v-if="_filterLayout.flex"
          :options="_options"
          :expose-refs="exposeRefs"
          :expose-actions="exposeActions"
          :params="params"
          :grid-props="filterGridProps"
          @update:value="(val, key) => onValueUpdate(val, key)"
        />
        <NDivider v-if="_collapsedOptions && filterCollapsedType === 'collapsed' && _collapsedOptions.length > 0" style="margin:5px 0;">
          <NButton size="tiny" @click="filterCollapsed = !filterCollapsed">
            {{ filterCollapsed ? '折叠' : '展开' }}
          </NButton>
        </NDivider>
        <NCollapseTransition v-if="_collapsedOptions && filterCollapsedType === 'collapsed' && _collapsedOptions.length > 0" :show="filterCollapsed">
          <GridFilter
            v-if="_filterLayout.collapsedGrid"
            :options="_collapsedOptions"
            :expose-refs="exposeRefs"
            :expose-actions="exposeActions"
            :params="params"
            :grid-props="filterGridProps"
            @update:value="(val, key) => onValueUpdate(val, key)"
          />
          <FlexFilter
            v-if="_filterLayout.collapsedFlex"
            :options="_collapsedOptions"
            :expose-refs="exposeRefs"
            :expose-actions="exposeActions"
            :params="params"
            :grid-props="filterFlexProps"
            @update:value="(val, key) => onValueUpdate(val, key)"
          />
        </NCollapseTransition>
      </NFlex>
    </slot>
    <NDataTable
      ref="data-table-ref"
      remote
      flex-height
      :single-line="false"
      :scroll-x="scrollX"
      :style="{ flex: 1, ..._style }"
      :class="_class"
      :row-key="row => row[_fields.rowKey]"
      :children-key="_fields.children"
      :loading="loading"
      :columns="columnsReactive"
      :data="rawList"
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
        <slot name="empty" :refs="exposeRefs" :actions="exposeActions" />
      </template>
      <template #loading>
        <slot name="loading" :refs="exposeRefs" :actions="exposeActions" />
      </template>
    </NDataTable>
    <slot name="footer" :refs="exposeRefs" :actions="exposeActions">
      <NFlex>
        <slot name="footer-extra" :refs="exposeRefs" :actions="exposeActions" />
        <NPagination
          v-if="pagination"
          style="margin-left: auto;"
          :disabled="loading"
          v-bind="{ ...paginationProps, ...paginationRef }"
          @update:page="vOn.onUpdatePage"
          @update:page-size="vOn.onUpdatePageSize"
        />
      </NFlex>
    </slot>
    <NModal
      v-if="filterCollapsedType === 'modal'"
      v-model:show="modalFlag"
      style="width:auto;"
      preset="dialog"
      :title="filterLabel"
      :positive-text="filterModalTrigger === 'manual' ? '确定' : undefined"
      v-bind="filterModalProps"
      @positive-click="handlePositiveClick"
    >
      <slot name="filter-modal" :refs="exposeRefs" :actions="exposeActions">
        <GridFilter
          v-if="_filterLayout.collapsedGrid"
          :options="_collapsedOptions"
          :expose-refs="exposeRefs"
          :expose-actions="exposeActions"
          :params="params"
          :grid-props="filterGridProps"
          @update:value="(val, key) => onValueUpdate(val, key, true)"
        />
        <FlexFilter
          v-if="_filterLayout.collapsedFlex"
          :options="_collapsedOptions"
          :expose-refs="exposeRefs"
          :expose-actions="exposeActions"
          :params="params"
          :grid-props="filterFlexProps"
          @update:value="(val, key) => onValueUpdate(val, key, true)"
        />
      </slot>
    </NModal>
  </NFlex>
</template>

<style scoped>

</style>
