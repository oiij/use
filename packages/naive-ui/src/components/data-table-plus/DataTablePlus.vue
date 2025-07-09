<script setup lang='ts'
  generic="
    P extends  Record<string, any> = Record<string, any>,
    D extends  Record<string, any> = Record<string, any>,
    R extends Record<string, any> = Record<string, any>
  "
>
import type { DataTableBaseColumn, DataTableColumns, DataTableFilterState, DataTableInst, DataTableSortState, DropdownOption, PaginationProps } from 'naive-ui'
import type { FilterState, TableBaseColumn } from 'naive-ui/es/data-table/src/interface'
import type { ContextMenuSelectType, DataTablePlusClickRowType, DataTablePlusExposeActions, DataTablePlusExposeRefs, DataTablePlusPagination, DataTablePlusProps, OnUpdateCheckedRowKeysParams, OnUpdateExpandedRowKeysParams } from '.'
import { NButton, NCollapseTransition, NDataTable, NDivider, NDropdown, NFlex, NGi, NGrid, NPagination } from 'naive-ui'
import { computed, nextTick, reactive, ref, toValue, useTemplateRef } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'
import { NPresetInput } from '..'
import { renderLabel } from '../preset-input/_utils'

const {
  api,
  defaultParams: propsParams,
  manual,
  columns,
  filterOptions,
  filterGridProps,
  contextMenuOptions,
  fields,
  pagination,
  dataTableProps,
  requestOptions,
  requestPlugins,
  customStyle,
  customClass,
} = defineProps<DataTablePlusProps<P, D, R>>()
const emit = defineEmits<{
  (e: 'before', params: P[]): void
  (e: 'success', data: D, params: P[]): void
  (e: 'error', err: Error, params: P[]): void
  (e: 'finally', params: P[], data?: D, err?: Error): void
  (e: 'clickRow', data: DataTablePlusClickRowType<R>): void
  (e: 'contextMenuRow', data: DataTablePlusClickRowType<R>): void
  (e: 'contextMenuSelect', data: ContextMenuSelectType<R>): void
  (e: 'load', row: R): Promise<void>
  (e: 'scroll', ev: Event): void
  (e: 'update:checkedRowKeys', keys: keyof R[], rows: R[], meta: { row: R | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }): void
  (e: 'update:expandedRowKeys', keys: R[]): void
  (e: 'update:filters', filterState: FilterState, sourceColumn: TableBaseColumn): void
  (e: 'update:sorter', options: DataTableSortState | DataTableSortState[] | null): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}>()
const columnsReactive = reactive<DataTableColumns<R>>(columns ?? [])
const dataTableRef = useTemplateRef<DataTableInst>('data-table-ref')
const _fields = { page: 'page', pageSize: 'pageSize', filter: 'filter', sorter: 'sorter', list: 'list', count: 'count', rowKey: 'id', ...fields }
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
  onUpdateCheckedRowKeys: (...args: any) => {
    emit('update:checkedRowKeys', ...args as Parameters<OnUpdateCheckedRowKeysParams<R>>)
  },
  onUpdateExpandedRowKeys: (...args: any) => {
    emit('update:expandedRowKeys', ...args as Parameters<OnUpdateExpandedRowKeysParams<R>>)
  },
}

const showDropdownFlag = ref(false)
const templateRow = ref<R>()
const dropdownPosition = ref({
  x: 0,
  y: 0,
})
function onSelect(key: string | number, option: DropdownOption) {
  showDropdownFlag.value = false
  emit('contextMenuSelect', {
    key,
    option,
    row: toValue(templateRow),
  })
}

function rowProps(row: R, index: number) {
  return {
    onClick: (event: MouseEvent) => {
      emit('clickRow', { row, index, event })
    },
    onContextmenu: (event: MouseEvent) => {
      emit('contextMenuRow', { row, index, event })
      if (contextMenuOptions) {
        event.preventDefault()
        showDropdownFlag.value = false
        templateRow.value = row
        nextTick(() => {
          showDropdownFlag.value = true
          dropdownPosition.value = {
            x: event.x,
            y: event.y,
          }
        })
      }
    },
  }
}

const filterCollapsed = ref(false)

function filterItemUpdate(val: any, key?: keyof P) {
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
  setParam: (_params: Partial<P>) => {
    Object.assign(params.value[0], _params)
  },
  runParam: (_params: Partial<P>) => {
    return run(Object.assign(params.value[0], _params))
  },
  runParamAsync: async (_params: Partial<P>) => {
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
    <slot name="filter" :refs="exposeRefs" :actions="exposeActions">
      <NFlex vertical>
        <NGrid v-bind="filterGridProps">
          <NGi
            v-for="({ key, gridItemProps, render, ...options }, _index) in filterOptions?.filter(f => !f.collapsed)"
            :key="_index"
            :span="12"
            v-bind="gridItemProps"
          >
            <component
              :is="renderLabel(render(exposeRefs, exposeActions), options.label, key as string)"
              v-if="render"
            />
            <NPresetInput
              v-else
              :options="options"
              :value="key ? params[0][key] : undefined"
              :path="(key as string)"
              @update:value="(val) => filterItemUpdate(val, key) "
            />
          </NGi>
        </NGrid>
        <NDivider v-if="filterOptions?.filter(f => f.collapsed) && filterOptions?.filter(f => f.collapsed)?.length > 0" style="margin:0;">
          <NButton size="tiny" @click="filterCollapsed = !filterCollapsed">
            {{ filterCollapsed ? '折叠' : '展开' }}
          </NButton>
        </NDivider>
        <NCollapseTransition :show="filterCollapsed">
          <NGrid v-bind="filterGridProps">
            <NGi
              v-for="({ key, gridItemProps, render, ...options }, _index) in filterOptions?.filter(f => f.collapsed)"
              :key="_index"
              :span="12"
              v-bind="gridItemProps"
            >
              <component
                :is="renderLabel(render(exposeRefs, exposeActions), options.label, key as string)"
                v-if="render"
              />
              <NPresetInput
                v-else
                :options="options"
                :value="key ? params[0][key] : undefined"
                :path="(key as string)"
                @update:value="(val) => filterItemUpdate(val, key) "
              />
            </NGi>
          </NGrid>
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
        <slot name="empty" />
      </template>
      <template #loading>
        <slot name="loading" />
      </template>
    </NDataTable>
    <slot name="actions">
      <NFlex>
        <slot name="extra" />
        <slot name="pagination">
          <NPagination
            v-if="pagination"
            :style="{ marginLeft: 'auto' }"
            :disabled="loading"
            v-bind="{ ...paginationProps, ...paginationRef }"
            @update:page="vOn.onUpdatePage"
            @update:page-size="vOn.onUpdatePageSize"
          />
        </slot>
      </NFlex>
    </slot>
    <NDropdown
      v-if="contextMenuOptions"
      placement="bottom-start"
      trigger="manual"
      :x="dropdownPosition.x"
      :y="dropdownPosition.y"
      :show="showDropdownFlag"
      :options="contextMenuOptions"
      @clickoutside="showDropdownFlag = false"
      @select="onSelect"
    />
  </NFlex>
</template>

<style scoped>

</style>
