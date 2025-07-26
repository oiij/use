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
import { NButton, NCollapseTransition, NDataTable, NDivider, NFlex, NGi, NGrid, NPagination } from 'naive-ui'
import { computed, h, reactive, ref, toRaw, useTemplateRef } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'
import { renderLabel } from '../preset-input/_utils'
import { NPresetInput } from '../preset-input/index'
import { NSearchInput } from '../search-input/index'

const {
  api,
  defaultParams: propsParams,
  title,
  manual,
  columns,
  filterOptions,
  filterGridProps,
  filterFlexProps,
  filterLayout = 'grid',
  fields,
  search,
  pagination,
  dataTableProps,
  requestOptions,
  requestPlugins,
  customStyle,
  customClass,
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
const _defaultParams = {
  [_fields.page]: paginationRef.value.page,
  [_fields.pageSize]: paginationRef.value.pageSize,
  ...propsParams as P,
} as P

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
  const filterParam = params[0]?.[_fields.filter] as Record<string | number, (string | number)[] | string | number> | undefined
  const sorterParam = params[0]?.[_fields.sorter] as Record<string | number, 'ascend' | 'descend' | false>

  if (columnsReactive) {
    for (const item of columnsReactive) {
      if ('key' in item) {
        if (filterParam && item.key in filterParam) {
          const filterValues = filterParam[item.key]
          if ('filter' in item && item.filter) {
            if (item.filterMultiple) {
              if (Array.isArray(filterValues)) {
                item.filterOptionValues = filterValues
              }
            }
            else {
              if (!Array.isArray(filterValues)) {
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
        if (sorterParam && item.key in sorterParam) {
          const sorterValue = sorterParam[item.key]
          if ('sorter' in item && item.sorter) {
            item.sortOrder = sorterValue
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
    _run({
      [_fields.page]: 1,
      [_fields.filter]: filters,
    } as P)
  },
  onUpdateSorter: (options: DataTableSortState | DataTableSortState[] | null) => {
    emit('update:sorter', options)
    const _sorter: Record<string | number, any> = {}
    if (Array.isArray(options)) {
      for (const item of options) {
        _sorter[item.columnKey] = item.order
      }
    }
    else if (options) {
      _sorter[options.columnKey] = options.order
    }
    _run({
      [_fields.page]: 1,
      [_fields.sorter]: _sorter,
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

function onValueUpdate(val: any, key?: keyof P) {
  if (key) {
    _run({
      [key]: val,
    } as P)
  }
}

const exposeRefs: DataTablePlusExposeRefs<P, D, R> = {
  loading,
  data,
  error,
  params,
  pagination: paginationRef,
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
}
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
          @update:value="(val) => onValueUpdate(val, _fields.search)"
        />
        <slot name="header-extra" :refs="exposeRefs" :actions="exposeActions" />
      </NFlex>
    </slot>
    <slot name="filter" :refs="exposeRefs" :actions="exposeActions">
      <NFlex vertical>
        <NGrid v-if="_filterLayout.grid && (filterOptions?.filter(f => !f.collapsed).length ?? 0 > 0)" v-bind="filterGridProps">
          <NGi
            v-for="({ key, gridItemProps, render, label, ...options }, _index) in filterOptions?.filter(f => !f.collapsed)"
            :key="_index"
            :span="12"
            v-bind="gridItemProps"
          >
            <component
              :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string, labelPlacement: 'left' })"
              v-if="render"
            />
            <component
              :is="renderLabel(
                h(NPresetInput, {
                  'options': options,
                  'value': key ? params[0][key] : undefined,
                  'onUpdate:value': (val) => onValueUpdate(val, key),
                }),
                label,
                { path: key as string, labelPlacement: 'left' })"
              v-else
            />
          </NGi>
        </NGrid>
        <NFlex v-if="_filterLayout.flex && (filterOptions?.filter(f => !f.collapsed).length ?? 0 > 0)" v-bind="filterFlexProps">
          <template
            v-for="({ key, render, label, ...options }, _index) in filterOptions?.filter(f => !f.collapsed)"
            :key="_index"
          >
            <component
              :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string, labelPlacement: 'left' })"
              v-if="render"
            />
            <component
              :is="renderLabel(
                h(NPresetInput, {
                  'options': options,
                  'value': key ? params[0][key] : undefined,
                  'onUpdate:value': (val) => onValueUpdate(val, key),
                }),
                label,
                { path: key as string, labelPlacement: 'left' })"
              v-else
            />
          </template>
        </NFlex>
        <NDivider v-if="filterOptions?.filter(f => f.collapsed) && filterOptions?.filter(f => f.collapsed)?.length > 0" style="margin:5px 0;">
          <NButton size="tiny" @click="filterCollapsed = !filterCollapsed">
            {{ filterCollapsed ? '折叠' : '展开' }}
          </NButton>
        </NDivider>
        <NCollapseTransition :show="filterCollapsed">
          <NGrid v-if="_filterLayout.collapsedGrid && (filterOptions?.filter(f => f.collapsed)?.length ?? 0 > 0)" v-bind="filterGridProps">
            <NGi
              v-for="({ key, gridItemProps, render, label, ...options }, _index) in filterOptions?.filter(f => f.collapsed)"
              :key="_index"
              :span="12"
              v-bind="gridItemProps"
            >
              <component
                :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string, labelPlacement: 'left' })"
                v-if="render"
              />
              <component
                :is="renderLabel(
                  h(NPresetInput, {
                    'options': options,
                    'value': key ? params[0][key] : undefined,
                    'onUpdate:value': (val) => onValueUpdate(val, key),
                  }),
                  label,
                  { path: key as string, labelPlacement: 'left' })"
                v-else
              />
            </NGi>
          </NGrid>
          <NFlex v-if="_filterLayout.collapsedFlex && (filterOptions?.filter(f => f.collapsed)?.length ?? 0 > 0)" v-bind="filterFlexProps">
            <template
              v-for="({ key, render, label, ...options }, _index) in filterOptions?.filter(f => f.collapsed)"
              :key="_index"
            >
              <component
                :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string, labelPlacement: 'left' })"
                v-if="render"
              />
              <component
                :is="renderLabel(
                  h(NPresetInput, {
                    'options': options,
                    'value': key ? params[0][key] : undefined,
                    'onUpdate:value': (val) => onValueUpdate(val, key),
                  }),
                  label,
                  { path: key as string, labelPlacement: 'left' })"
                v-else
              />
            </template>
          </NFlex>
        </NCollapseTransition>
      </NFlex>
    </slot>
    <NDataTable
      ref="data-table-ref"
      remote
      flex-height
      :single-line="false"
      :scroll-x="scrollX"
      :style="{ flex: 1, ...customStyle }"
      :class="customClass"
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
  </NFlex>
</template>

<style scoped>

</style>
