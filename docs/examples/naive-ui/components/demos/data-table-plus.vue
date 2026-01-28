<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { PresetFormOptions } from '@oiij/naive-ui/components'
import type { DataTableColumns } from 'naive-ui'
import { NDataTablePlus, NPresetForm } from '@oiij/naive-ui/components'
import { NButton, NButtonGroup, NFlex } from 'naive-ui'
import { h, ref, useTemplateRef } from 'vue'

type Params = {
  id?: number
  page?: number
  pageSize?: number
  search?: string
  timeRange?: number[]

}
type Row = {
  id: number
  name: string
  page: number
  pageSize: number
  search: string
}
type Res = {
  list: Row[]
  params: any
  count: number
}
const dataTableRef = useTemplateRef('data-table-ref')
const presetFormRef = useTemplateRef('preset-form-ref')

function api(params?: Params) {
  const { page = 1, pageSize = 20, search = '' } = params ?? {}
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
const collapsed = ref(true)

const filterOptions: PresetFormOptions<Params> = [
  {
    key: 'search',
    label: '搜索1',
    type: 'search',
    span: 8,
  },
  {
    key: 'search',
    label: '搜索2',
    type: 'search',
    span: 8,
  },
  {
    key: 'id',
    type: 'input',
    span: 8,
  },
  {
    key: 'timeRange',
    type: 'date-picker',
    label: '时间范围',
    span: 8,
    props: {
      type: 'daterange',

    },
  },
  {
    span: 8,
    itemProps: {
      suffix: true,
    },
    render: ({ formValueRef, resetForm }) => {
      return h(NButtonGroup, {}, {
        default: () => [
          h(NButton, {
            onClick: () => {
              console.log(formValueRef.value)

              dataTableRef.value?.runParams({
                ...formValueRef.value,
              })
            },
          }, { default: () => '过滤' }),
          h(NButton, {
            onClick: () => {
              resetForm()
              dataTableRef.value?.runParams({
                ...formValueRef.value,
              })
            },
          }, { default: () => '重置' }),
          h(NButton, {
            onClick: () => {
              console.log(presetFormRef.value)

              collapsed.value = !collapsed.value
            },
          }, { default: () => collapsed.value ? '展开' : '收起' }),

        ],
      })
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
      ref="data-table-ref"
      pagination
      search
      scroll-top
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
      <template #filter>
        <NPresetForm ref="preset-form-ref" :options="filterOptions" :form-props="{ labelPlacement: 'top', showFeedback: true }" :grid-props="{ xGap: 10, collapsed }" />
      </template>
    </NDataTablePlus>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
