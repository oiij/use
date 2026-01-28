<script setup lang='ts'>
import type { EChartsOption } from '@oiij/e-charts'
import { useECharts } from '@oiij/e-charts'
import { NButton, NFlex } from 'naive-ui'
import { computed, ref, useTemplateRef } from 'vue'

const darkMode = ref(false)
const value = ref(200)
const opt = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: value.value, name: 'Search Engine' },
          { value: value.value + 20, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  } as EChartsOption
})

useECharts(useTemplateRef('dom-ref'), {
  chartOption: opt,
  darkMode,
  debug: true,
})
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NButton @click="() => value += value">
        Change Value
      </NButton>
      <NButton @click="() => darkMode = !darkMode">
        Change Dark Mode
      </NButton>
    </NFlex>
    <div ref="dom-ref" style="width:100%;height:400px" />
  </NFlex>
</template>

<style scoped>

</style>
