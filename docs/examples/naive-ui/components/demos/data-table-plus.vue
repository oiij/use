<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { DataTablePlusFilterOptions } from '@oiij/naive-ui/components'
import type { DataTableColumns } from 'naive-ui'
import { NDataTablePlus } from '@oiij/naive-ui/components'
import { NButton, NFlex, NInput } from 'naive-ui'
import { h, useTemplateRef } from 'vue'

interface Params {
  id?: number
  page?: number
  pageSize?: number
  search?: string
  timeRange?: number[]

}
interface Row {
  id: number
  name: string
  page: number
  pageSize: number
  search: string
}
interface Res {
  list: Row[]
  params: any
  count: number
}
const tableRef = useTemplateRef('tableRef')
function api(params?: Params) {
  const { page = 1, pageSize = 10, search = '' } = params ?? {}
  return new Promise<Res>((resolve) => {
    setTimeout(() => {
      return resolve({
        list: Array.from({ length: pageSize }).map((_, i) => {
          return {
            id: (page - 1) * pageSize + i,
            name: '一',
            page,
            pageSize,
            search,
          }
        }),
        count: 34,
        params,
      } as const)
    }, 100)
  })
}
const filterOptions: DataTablePlusFilterOptions<Params, Res, Row> = [
  {
    key: 'search',
    label: '搜索1',
    type: 'search',
    gridSpan: 12,
    collapsed: true,
  },
  {
    key: 'search',
    label: '搜索2',
    type: 'search',
    gridSpan: 12,
    collapsed: true,
  },
  {
    key: 'id',
    type: 'input',
    label: true,
    gridSpan: 12,
    collapsed: true,
  },
  {
    key: 'timeRange',
    type: 'date-picker',
    label: '时间范围',
    gridSpan: 12,
    collapsed: true,
    props: {
      type: 'daterange',

    },
  },
  {
    collapsed: true,
    gridSpan: 12,
    render: (refs, actions) => {
      return h(NButton, {
        onClick: () => {
          console.log(refs.data, actions)
        },
      }, { default: () => 'Button' })
    },
  },
]
function onLoaded(data: Res) {
  console.log(data)
}
const columns: DataTableColumns<Row> = [
  {
    type: 'selection',
    multiple: true,
  },
  {
    key: 'id',
    title: 'ID',
    sorter: true,
  },
  {
    key: 'name',
    title: '姓名',
    sorter: true,
    filter: true,
    filterMultiple: false,
    filterOptions: [
      {
        label: 'Value1',
        value: 1,
      },
      {
        label: 'Value2',
        value: 2,
      },
    ],
  },
  {
    key: 'page',
    title: '页码',
    sorter: true,
    filter: true,
    filterMultiple: true,
    filterOptionValues: [1, 2],
    filterOptions: [
      {
        label: 'Value1',
        value: 1,
      },
      {
        label: 'Value2',
        value: 2,
      },
    ],
  },
  {
    key: 'pageSize',
    title: '每页数量',
  },
  {
    key: 'search',
    title: '搜索',
    render: (row) => {
      return `搜索：${row.search}`
    },
  },
]

function onClickRow(data: any) {
  console.log(data)
}
function onContextMenuRow(data: any) {
  console.log(data)
}
function onUpdateCheckedRowKeys(key: any, rows: any, meta: any) {
  console.log(key, rows, meta)
}
function onScrollBottom() {
  console.log('bottom')
}
</script>

<template>
  <NFlex vertical>
    <!-- @vue-generic {Params,Res,Row} -->
    <NDataTablePlus
      ref="tableRef"
      pagination
      search
      infinite-scroll
      title="数据表格"
      :style="{ width: '100%', height: '500px' }"
      :api="api"
      :filter-options="filterOptions"
      filter-collapsed-type="modal"
      filter-modal-trigger="manual"
      :filter-modal-props="{ contentStyle: { width: '600px' } }"
      :clearable="true"
      :columns="columns"
      :columns-filter-options="(filters) => ({ filterPage: filters.page, filters })"
      @click-row="onClickRow"
      @context-menu-row="onContextMenuRow"
      @success="onLoaded"
      @update:checked-row-keys="onUpdateCheckedRowKeys"
      @scroll-bottom="onScrollBottom"
    >
      <template #header-extra>
        <NInput style="width:100px;" />
        <!-- <NButton @click="tableRef?.actions.refresh()">
          Refresh
        </NButton> -->
      </template>
    </NDataTablePlus>
    <pre>{{ tableRef?.refs.params }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
