<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { DataTablePlusFilterOptions } from '@oiij/naive-ui/components'
import type { DataTableColumns } from 'naive-ui'
import { NDataTablePlus, NPresetPicker } from '@oiij/naive-ui/components'
import { NButton, NFlex, NSwitch } from 'naive-ui'
import { h, ref } from 'vue'

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
const multiple = ref(true)
const params = {
  page: 1,
  pageSize: 20,
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
    <NFlex>
      <NFlex>
        <span>单选</span>
        <NSwitch v-model:value="multiple" />
        <span>多选</span>
      </NFlex>
    </NFlex>
    <div>
      <!-- @vue-generic {number,Row} -->
      <NPresetPicker
        v-model:value="value"
        :api="api"
        :default-params="params"
        pagination
        search
        :columns="columns"
        :fallback-label="(val:number) => `${val}找不到`"
        type="primary"
        clearable
        :multiple="multiple"
        :button-props="{
          secondary: true,
        }"
        :clear-button-props="{
          tertiary: true,
        }"
        :fields="{
          value: 'id',
          label: 'name',
        }"
        @update:value="onUpdateValue"
        @success="onSuccess"
      >
        <template #default="{ refs, actions }">
          <!-- @vue-generic {Params,Res,Row} -->
          <NDataTablePlus
            pagination
            search
            title="数据表格"
            :style="{ width: '900px', height: '600px' }"
            :api="api"
            :filter-options="filterOptions"
            :columns="refs.columns"
            :data-table-props="{
              checkedRowKeys: refs.checkedRowKeys.value,
            }"
            @click-row="actions.clickRowEffect"
            @success="onLoaded"
            @update:checked-row-keys="actions.updateCheckedRowKeysEffect"
          />
        </template>
      </NPresetPicker>
    </div>
    <pre>{{ value }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
