<script setup lang='ts'>
import type { EChartsOption } from '@oiij/e-charts'
import { useECharts } from '@oiij/e-charts'
import { useData } from 'vitepress'
import { computed, useTemplateRef } from 'vue'

const { isDark } = useData()
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
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  } as EChartsOption
})

useECharts(useTemplateRef('dom-ref'), opt, isDark)
</script>

<template>
  <div ref="dom-ref" style="width:100%;height:400px" />
</template>

<style scoped>

</style>
