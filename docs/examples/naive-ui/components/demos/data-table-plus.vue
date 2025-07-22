<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { ContextMenuSelectType, DataTablePlusFilterOptions } from '@oiij/naive-ui/components'
import type { DataTableColumns } from 'naive-ui'
import { NDataTablePlus } from '@oiij/naive-ui/components'
import { NButton, NFlex } from 'naive-ui'
import { h, useTemplateRef } from 'vue'

interface Params {
  id?: number
  page?: number
  pageSize?: number
  search?: string
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
        count: 100,
        params,
      } as const)
    }, 1000)
  })
}
const filterOptions: DataTablePlusFilterOptions<Params, Res, Row> = [
  {
    key: 'search',
    label: '搜索',
    type: 'search',
    collapsed: true,
  },
  {
    key: 'id',
    type: 'input',
    label: true,
    collapsed: true,
  },
  {
    collapsed: true,
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
const contextMenuOptions = [
  {
    key: '1',
    label: '删除',
  },
]
function onContextMenuSelect(data: ContextMenuSelectType<Row>) {
  console.log(data)
}
function onClickRow(data: any) {
  console.log(data)
}
function onContextMenuRow(data: any) {
  console.log(data)
}
function onUpdateCheckedRowKeys(key: any, rows: any, meta: any) {
  console.log(key, rows, meta)
}
</script>

<template>
  <NFlex vertical>
    <!-- @vue-generic {Params,Res,Row} -->
    <NDataTablePlus
      ref="tableRef"
      pagination
      search
      title="数据表格"
      :style="{ width: '100%', height: '500px' }"
      :api="api"
      :filter-options="filterOptions"
      :columns="columns"
      :context-menu-options="contextMenuOptions"
      @context-menu-select="onContextMenuSelect"
      @click-row="onClickRow"
      @context-menu-row="onContextMenuRow"
      @success="onLoaded"
      @update:checked-row-keys="onUpdateCheckedRowKeys"
    >
      <template #header-extra>
        <NButton @click="tableRef?.actions.refresh()">
          Refresh
        </NButton>
      </template>
    </NDataTablePlus>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
