<script setup lang='ts'>
import type { OptionFormat } from '@oiij/naive-ui/components'
import type { SelectOption } from 'naive-ui'
import { NPresetSelect } from '@oiij/naive-ui/components'
import { NButton, NFlex } from 'naive-ui'
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
const optionFormat: OptionFormat<Row> = (row) => {
  return row.id === 3
    ? null
    : {
        name: row.name,
        id: row.id,
      }
}
function onUpdateValue(val: Row['id'] | null, option: SelectOption | SelectOption[] | null, raw: Row | Row[] | null) {
  // eslint-disable-next-line no-console
  console.log(val, option, raw)
}
function onSuccess(res: Res, params: Params[]) {
  // eslint-disable-next-line no-console
  console.log(res, params)
}
</script>

<template>
  <NFlex vertical>
    <!-- @vue-generic {number,Params,Res,Row} -->
    <NPresetSelect
      v-model:value="value"
      :api="api"
      :default-params="params"
      pagination
      :option-format="optionFormat"
      :fields="{ label: 'name', value: 'id' }"
      fallback-label="伍Ⅹ"
      @update:value="onUpdateValue"
      @success="onSuccess"
    >
      <template #footer-extra>
        <NButton>新增</NButton>
      </template>
    </NPresetSelect>
    <pre>{{ value }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
