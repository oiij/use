<script setup lang='ts'>
import { NPresetField } from '@oiij/naive-ui/components'
import { NFlex } from 'naive-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <NFlex vertical>
    <NPresetField v-model:value="value" type="input" />
    <pre>值：{{ value }}</pre>
    <NPresetField type="button" :options="{ props: { label: '按钮' } }" />
    <NPresetField type="color-picker" />
    <NPresetField type="checkbox" :options="{ props: { options: [{ label: '1', value: 1 }, { label: '2', value: 2 }] } }" />
    <NPresetField type="date-picker" />
    <NPresetField type="dynamic-tags" />
    <NPresetField type="input-number" />
    <NPresetField type="radio" :options="{ props: { options: [{ label: '1', value: 1 }, { label: '2', value: 2 }] } }" />
    <NPresetField type="rate" />
    <NPresetField type="search" />
    <NPresetField type="select" />
    <NPresetField type="slider" />
    <NPresetField type="switch" />
    <NPresetField type="time-picker" />
  </NFlex>
</template>

<style scoped lang='less'>

</style>
