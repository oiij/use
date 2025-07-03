<script setup lang='ts'>
import { NButton } from 'naive-ui'
import { NRemoteRequest } from '~/naive-ui/src/components'

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
</script>

<template>
  <NRemoteRequest :api="api">
    <template #default="{ refs, actions }">
      <pre v-for="(item, index) in refs.data.value?.list" :key="index">{{ item.id }}</pre>
      <NButton @click="() => actions.run({ page: refs.params.value[0].page += 1 })">
        下一页
      </NButton>
    </template>
  </NRemoteRequest>
</template>

<style scoped lang='less'>

</style>
