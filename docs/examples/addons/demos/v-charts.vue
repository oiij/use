<script setup lang='ts'>
import type { ISpec } from '@oiij/v-charts'
import { useVCharts } from '@oiij/v-charts'
import { NButton, NFlex } from 'naive-ui'
import { computed, ref, useTemplateRef } from 'vue'

const darkMode = ref(false)
const value = ref(20)

const options = computed(() => {
  return {
    type: 'pie',
    data: [
      {
        id: 'id0',
        values: [
          { type: 'oxygen', value: value.value * 1.2 },
          { type: 'silicon', value: value.value * 2 },
          { type: 'aluminum', value: '8.13' },
          { type: 'iron', value: '5' },
          { type: 'calcium', value: '3.63' },
          { type: 'sodium', value: '2.83' },
          { type: 'potassium', value: '2.59' },
          { type: 'others', value: '3.5' },
        ],
      },
    ],
    outerRadius: 0.8,
    innerRadius: 0.5,
    padAngle: 0.6,
    valueField: 'value',
    categoryField: 'type',
    pie: {
      style: {
        cornerRadius: 10,
      },
      state: {
        hover: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1,
        },
        selected: {
          outerRadius: 0.85,
          stroke: '#000',
          lineWidth: 1,
        },
      },
    },
    title: {
      visible: true,
      text: 'Statistics of Surface Element Content',
    },
    legends: {
      visible: true,
      orient: 'left',
    },
    label: {
      visible: true,
    },
    tooltip: {
      mark: {
        content: [
          {
            key: datum => datum?.type,
            value: datum => `${datum?.value}%`,
          },
        ],
      },
    },
  } as ISpec
})
useVCharts(useTemplateRef('dom-ref'), {
  chartOption: options,
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
