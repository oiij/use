<script setup lang='ts'>
import { exportSheet, transform } from '@oiij/xlsx'
import { NButton, NCard, NFlex } from 'naive-ui'

const data = Array.from({ length: 5 }).map((m, i) => {
  return {
    name: `oiij${i}`,
    age: `${i}`,
    sex: '男',
    phone: '13800138000',
    address: '广州市天河区',
  }
})
const result = transform(data, [
  {
    key: 'name',
    title: '姓名',
  },
  {
    key: 'age',
    title: '年龄',
  },
  {
    key: 'sex',
    title: '性别',
    transform: (v) => {
      return `transform-${v.rawValue}`
    },
  },
])
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NButton @click="exportSheet(result, '导出xls', 'xls')">
        导出xls
      </NButton>
      <NButton @click="exportSheet(result, '导出xlsx', 'xlsx')">
        导出xlsx
      </NButton>
      <NButton @click="exportSheet(result, '导出csv', 'csv')">
        导出csv
      </NButton>
    </NFlex>
    <NFlex>
      <NCard title="input" style="flex:1;">
        <pre>{{ data }}</pre>
      </NCard>
      <NCard title="output" style="flex:1;">
        <pre>{{ result }}</pre>
      </NCard>
    </NFlex>
  </NFlex>
</template>

<style scoped>

</style>
