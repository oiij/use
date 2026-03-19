<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { NRemoteRequest } from '@oiij/naive-ui/components'
import { NButton } from 'naive-ui'

type Params = {
  id?: number
  page?: number
  pageSize?: number
  search?: string
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
function onSuccess(data: Res, params: Params[]) {
  console.log(data, params)
}
</script>

<template>
  <!-- @vue-generic {Params,Res,Row} -->
  <NRemoteRequest :api="api" @success="onSuccess">
    <template #default="{ params, loading, list, runParams }">
      <pre v-for="(item, index) in list" :key="index">{{ JSON.stringify(item) }}</pre>
      <NButton :loading="loading" @click="() => runParams({ page: (params[0].page ?? 1) - 1 })">
        上一页
      </NButton>
      <NButton :loading="loading" @click="() => runParams({ page: (params[0].page ?? 1) + 1 })">
        下一页
      </NButton>
    </template>
  </NRemoteRequest>
</template>

<style scoped lang='less'>

</style>
