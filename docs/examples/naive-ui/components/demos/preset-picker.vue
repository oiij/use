<script setup lang='ts'>
import type { DataTableColumns } from 'naive-ui'
import { NPresetPicker } from '@oiij/naive-ui/components'
import { NFlex } from 'naive-ui'
import { ref } from 'vue'

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
function api(params?: Params) {
  const { page = 1, pageSize = 10, search = '' } = params ?? {}
  return new Promise<Res>((resolve) => {
    setTimeout(() => {
      return resolve({
        list: Array.from({ length: pageSize }).map((_, i) => {
          return {
            id: (page - 1) * pageSize + i,
            name: `一${(page - 1) * pageSize + i}`,
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
const value = ref(50)
const params = {
  page: 1,
  pageSize: 20,
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
function onUpdateValue(val: Row['id'] | null, raw: Row | Row[] | null) {
  // eslint-disable-next-line no-console
  console.log(val, raw)
}
function onSuccess(res: Res, params: Params[]) {
  // eslint-disable-next-line no-console
  console.log(res, params)
}
</script>

<template>
  <NFlex vertical>
    <div>
      <!-- @vue-generic {number,Params,Res,Row} -->

      <NPresetPicker
        v-model:value="value"
        :api="api"
        :default-params="params"
        pagination
        search
        :columns="columns"
        :fields="{ }"
        fallback-label="伍Ⅹ"
        type="primary"
        clearable
        :multiple="true"
        :button-props="{

        }"
        @update:value="onUpdateValue"
        @success="onSuccess"
      />
    </div>
    <pre>{{ value }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
