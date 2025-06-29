<script setup lang='ts'
generic="
  P extends  Record<string, any>,
  D extends  Record<string, any>,
  R extends Record<string, any>
  "
>
import type { DataTableBaseColumn, DataTableColumns, DataTableFilterState, DataTableInst, DataTableProps, DataTableSortState, DropdownOption, PaginationProps } from 'naive-ui'
import type { CSSProperties } from 'vue'
import type { UseRequestOptions, UseRequestPlugin } from 'vue-hooks-plus/es/useRequest/types'
import type { ClickRowType, ContextMenuSelectType, DataTableFilterOptions } from './index'
import { NButton, NCollapseTransition, NDataTable, NDivider, NDropdown, NFlex } from 'naive-ui'
import { computed, nextTick, reactive, ref, toValue, useTemplateRef } from 'vue'
import useRequest from 'vue-hooks-plus/es/useRequest'
import FilterTemplate from './FilterTemplate.vue'

const {
  api,
  defaultParams: propsParams,
  columns,
  filterOptions,
  contextMenuOptions,
  fields = { page: 'page', pageSize: 'pageSize', filter: 'filter', sorter: 'sorter', list: 'list', count: 'count', rowKey: 'id' },
  pagination,
  dataTableProps,
  requestOptions,
  requestPlugins,
  customStyle,
  customClass,
} = defineProps<{
  api: (params: P) => Promise<D>
  defaultParams?: P
  columns?: DataTableColumns<R>
  filterOptions?: DataTableFilterOptions<P, D>
  contextMenuOptions?: DropdownOption[]
  fields?: Record<'page' | 'pageSize' | 'filter' | 'sorter' | 'list' | 'count' | 'rowKey', string>
  pagination?: Omit<PaginationProps, 'page' | 'pageSize'>
  dataTableProps?: DataTableProps
  requestOptions?: UseRequestOptions<D, P[]>
  requestPlugins?: UseRequestPlugin<D, P[]>[]
  customStyle?: CSSProperties
  customClass?: string
}>()
const emit = defineEmits<{
  (e: 'loaded', data: D): void
  (e: 'clickRow', data: ClickRowType<R>): void
  (e: 'contextMenuRow', data: ClickRowType<R>): void
  (e: 'contextMenuSelect', data: ContextMenuSelectType<R>): void
  (e: 'load', rowData: object): Promise<void>
  (e: 'scroll', ev: Event): void
  (e: 'update:checkedRowKeys', keys: (number | string)[], rows: object[], meta: { row: object | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }): void
  (e: 'update:expandedRowKeys', keys: (number | string)[]): void
  (e: 'update:filters', filters: DataTableFilterState, initiatorColumn: DataTableBaseColumn): void
  (e: 'update:sorter', options: DataTableSortState | DataTableSortState[] | null): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}>()
const columnsReactive = reactive<DataTableColumns<R>>(columns ?? [])

const dataTableRef = useTemplateRef<DataTableInst>('dataTableRef')
const _pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30],
  pageSlot: 5,
  prefix: (info) => {
    return `共${info.itemCount}条数据`
  },
  ...pagination,
})
const scrollX = computed(() => {
  return columns?.reduce((pre, cur) => {
    return pre + Number(cur.width ?? 100)
  }, 0)
})
const { data, error, loading, params, run, runAsync, refresh, refreshAsync, cancel, mutate } = useRequest<D, P[]>(api, {
  defaultParams: [
    {
      [fields.page]: 1,
      [fields.pageSize]: 10,
      [fields.filter]: {},
      [fields.sorter]: {},
      ...propsParams as P,
    },
  ],
  ...requestOptions,
  onSuccess: (data, params) => {
    requestOptions?.onSuccess?.(data, params)
    emit('loaded', data)

    _pagination.page = fields.page in params[0] ? Number(params[0][fields.page]) : 1
    _pagination.pageSize = fields.pageSize in params[0] ? Number(params[0][fields.pageSize]) : 10
    _pagination.itemCount = fields.count in data ? Number(data[fields.count]) : 0

    const filterParam = params[0]?.[fields.filter] as Record<string | number, (string | number)[] | string | number> | undefined
    const sorterParam = params[0]?.[fields.sorter] as Record<string | number, 'ascend' | 'descend' | false>

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
  },

}, requestPlugins)
const list = computed(() => {
  if (!data.value)
    return undefined
  if (Array.isArray(data.value[fields.list])) {
    return data.value[fields.list] as any[]
  }
  console.warn(`DataTablePlus: data[${fields.list}] must be an array`)
  return undefined
})
function _run(_params?: Partial<P>) {
  return run({
    ...params.value[0],
    ..._params,
  })
}
function onUpdatePage(page: number) {
  emit('update:page', page)
  if (loading.value)
    return
  _run({
    [fields.page]: page,
  } as P)
}
function onUpdatePageSize(pageSize: number) {
  emit('update:pageSize', pageSize)
  if (loading.value)
    return
  _run({
    [fields.pageSize]: pageSize,
  } as P)
}

function onUpdateFilters(filters: DataTableFilterState, initiatorColumn: DataTableBaseColumn) {
  emit('update:filters', filters, initiatorColumn)
  _run({
    [fields.filter]: filters,
  } as P)
}
function onUpdateSorter(options: DataTableSortState | DataTableSortState[] | null) {
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
    [fields.sorter]: _sorter,
  } as P)
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

const expose = {
  data,
  params,
  error,
  actions: {
    run: (_params: Partial<P>) => {
      _run(_params)
    },
    runAsync: (_params: Partial<P>) => {
      return runAsync({ ...params.value[0], ..._params })
    },
    refresh,
    refreshAsync,
    cancel,
    mutate,
    setParams: (_params: Partial<P>) => {
      params.value[0] = { ...params.value[0], ..._params }
    },
  },
  dataTableRef,
}
defineExpose(expose)

function filterItemUpdate(val: any, key?: keyof P) {
  if (key) {
    _run({
      [key]: val,
    } as P)
  }
}
</script>

<template>
  <NFlex vertical>
    <slot name="filter" :params="params[0]" :data="data" :actions="expose.actions" :data-table-ref="dataTableRef">
      <NFlex vertical>
        <NFlex>
          <template v-for="(item, _index) in filterOptions?.filter(f => !f.collapsed)" :key="_index">
            <component :is="item.render({ params: params[0], data, actions: expose.actions, dataTableRef })" v-if="item.render" />
            <FilterTemplate v-else :options="item" :value="item.key ? params[0][item.key] : undefined" :loading="loading" @update:value="(val) => filterItemUpdate(val, item.key) " />
          </template>
        </NFlex>
        <NDivider v-if="filterOptions?.filter(f => f.collapsed) && filterOptions?.filter(f => f.collapsed)?.length > 0">
          <NButton size="tiny" @click="filterCollapsed = !filterCollapsed">
            {{ filterCollapsed ? '折叠' : '展开' }}
          </NButton>
        </NDivider>
        <NCollapseTransition :show="filterCollapsed">
          <NFlex>
            <template v-for="(item, _index) in filterOptions?.filter(f => f.collapsed)" :key="_index">
              <component :is="item.render({ params: params[0], data, actions: expose.actions, dataTableRef })" v-if="item.render" />
              <FilterTemplate v-else :options="item" :value="item.key ? params[0][item.key] : undefined" :loading="loading" @update:value="(val) => filterItemUpdate(val, item.key) " />
            </template>
          </NFlex>
        </NCollapseTransition>
      </NFlex>
    </slot>
    <NDataTable
      ref="dataTableRef"
      remote
      flex-height
      :single-line="false"
      :scroll-x="scrollX"
      :style="{ flex: 1, ...customStyle }"
      :class="customClass"
      :row-key="row => row[fields.rowKey]"
      :loading="loading"
      :columns="columnsReactive"
      :data="list"
      :pagination="_pagination"
      :row-props="rowProps"
      v-bind="dataTableProps"
      @load="(...args) => emit('load', ...args)"
      @scroll="(...args) => emit('scroll', ...args)"
      @update:checked-row-keys="(...args) => emit('update:checkedRowKeys', ...args)"
      @update:expanded-row-keys="(...args) => emit('update:expandedRowKeys', ...args)"
      @update:page="onUpdatePage"
      @update:page-size="onUpdatePageSize"
      @update:filters="onUpdateFilters"
      @update:sorter="onUpdateSorter"
    />
    <NDropdown v-if="contextMenuOptions" placement="bottom-start" trigger="manual" :x="dropdownPosition.x" :y="dropdownPosition.y" :show="showDropdownFlag" :options="contextMenuOptions" @clickoutside="showDropdownFlag = false" @select="onSelect" />
  </NFlex>
</template>

<style scoped>

</style>
