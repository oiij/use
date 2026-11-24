<script setup lang='ts'>
import { useAutoRouter } from '@oiij/auto-router'
import { NCard, NFlex, NList, NListItem, NTag, NThing } from 'naive-ui'

const { loading, routes, flattenRoutes } = useAutoRouter()
</script>

<template>
  <NFlex vertical>
    <NCard title="加载状态">
      <NTag :type="loading ? 'warning' : 'success'">
        {{ loading ? '加载中...' : '加载完成' }}
      </NTag>
    </NCard>

    <NCard title="排序后的路由">
      <NList bordered>
        <NListItem v-for="route in routes" :key="route.path">
          <NThing>
            <template #header>
              {{ route.meta?.title || route.path }}
            </template>
            <template #description>
              <NTag size="small">
                {{ route.path }}
              </NTag>
              <NTag v-if="route.meta?.sort" size="small" type="info" style="margin-left: 8px;">
                排序: {{ route.meta.sort }}
              </NTag>
            </template>
          </NThing>
        </NListItem>
      </NList>
    </NCard>

    <NCard title="扁平化路由">
      <NList bordered>
        <NListItem v-for="route in flattenRoutes" :key="route.path">
          <NThing>
            <template #header>
              {{ route.path }}
            </template>
            <template #description>
              <NTag v-if="route.meta?.sort" size="small" type="info">
                排序: {{ route.meta.sort }}
              </NTag>
            </template>
          </NThing>
        </NListItem>
      </NList>
    </NCard>
  </NFlex>
</template>

<style scoped>

</style>
