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
  },
  {
    key: 'id',
    type: 'input',
    label: true,
  },
  {
    render: (refs, actions) => {
      return h(NButton, {
        onClick: () => {
          console.log(refs.data, actions)
        },
      }, { default: () => 'Button' })
    },
  },
]
function onLoaded(data: any) {
  console.log(data)
}
const columns: DataTableColumns<Row> = [
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
function onContextMenuSelect(data: ContextMenuSelectType<any>) {
  console.log(data)
}
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NButton @click="tableRef?.actions.refresh()">
        Refresh
      </NButton>
    </NFlex>
    <NDataTablePlus
      ref="tableRef"
      pagination
      :style="{ width: '100%', height: '500px' }"
      :api="api"
      :filter-options="filterOptions"
      :columns="columns"
      :context-menu-options="contextMenuOptions"
      @context-menu-select="onContextMenuSelect"
      @loaded="onLoaded"
    />
  </NFlex>
</template>

<style scoped lang='less'>

</style>
