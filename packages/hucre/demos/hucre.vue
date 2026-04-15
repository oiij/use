<script setup lang='ts'>
import type { SheetColumns } from '@oiij/hucre'
import { createCsv, createSheet, createXlsx, exportWorkbook } from '@oiij/hucre'
import { NButton, NCard, NFlex, NSelect } from 'naive-ui'
import { ref } from 'vue'

const data = Array.from({ length: 99 }).map((_, i) => ({
  name: `员工-${i}`,
  age: 20 + (i % 30),
  sex: i % 2 === 0 ? '男' : '女',
  profile: {
    gender: i % 2 === 0 ? '男性' : '女性',
  },
  phone: '13800138000',
  address: '广州市天河区',
  createTime: new Date(),
}))

const columns = [
  {
    header: '姓名',
    key: 'name',
  },
  {
    header: '性别',
    key: 'sex',
    value: item => `[${item.sex}]`,
  },
  {
    header: '嵌套值',
    value: 'profile.gender',
  },
  {
    header: '创建时间',
    key: 'createTime',
  },
] as SheetColumns<typeof data[0]>

const sheet = createSheet('员工信息', [
  {
    header: '姓名',
    key: 'name',
  },
  {
    header: '性别',
    key: 'sex',
    value: item => `[${item.sex}]`,
  },
  {
    header: '创建时间',
    key: 'createTime',
    value: item => item.createTime.toLocaleDateString(),
  },
], data)

const exportType = ref<'xlsx' | 'csv'>('xlsx')

async function handleExport() {
  const type = exportType.value

  if (type === 'csv') {
    const csv = createCsv(columns, data)
    exportWorkbook(csv, `导出${type}`, type)
    return
  }

  if (type === 'xlsx') {
    const workbook = await createXlsx([sheet])
    exportWorkbook(workbook, `导出${type}`, type)
  }
}
</script>

<template>
  <NFlex vertical>
    <NFlex align="center">
      <span>导出格式：</span>
      <NSelect
        v-model:value="exportType"
        :options="[
          { label: 'XLSX', value: 'xlsx' },
          { label: 'CSV', value: 'csv' },
        ]"
        style="width: 120px;"
      />
      <NButton @click="handleExport">
        导出{{ exportType.toUpperCase() }}
      </NButton>
    </NFlex>
    <NFlex>
      <NCard header="数据" style="flex: 1;">
        <pre>{{ data.slice(0, 5) }}</pre>
      </NCard>
      <NCard header="工作表" style="flex: 1;">
        <pre>{{ sheet }}</pre>
      </NCard>
    </NFlex>
  </NFlex>
</template>

<style scoped>

</style>
