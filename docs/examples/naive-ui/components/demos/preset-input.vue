<script setup lang='ts'>
import { NPresetInput } from '@oiij/naive-ui/components'
import { NFlex } from 'naive-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <NFlex vertical>
    <NPresetInput v-model:value="value" :options="{ type: 'input' }" />
    <pre>值：{{ value }}</pre>
    <NPresetInput :options="{ type: 'button' }" />
    <NPresetInput :options="{ type: 'color-picker' }" />
    <NPresetInput :options="{ type: 'checkbox', props: { options: [{ label: '1', value: 1 }, { label: '2', value: 2 }] } }" />
    <NPresetInput :options="{ type: 'date-picker' }" />
    <NPresetInput :options="{ type: 'dynamic-tags' }" />
    <NPresetInput :options="{ type: 'input-number' }" />
    <NPresetInput :options="{ type: 'radio', props: { options: [{ label: '1', value: 1 }, { label: '2', value: 2 }] } }" />
    <NPresetInput :options="{ type: 'rate' }" />
    <NPresetInput :options="{ type: 'search' }" />
    <NPresetInput :options="{ type: 'select' }" />
    <NPresetInput :options="{ type: 'slider' }" />
    <NPresetInput :options="{ type: 'switch' }" />
    <NPresetInput :options="{ type: 'time-picker' }" />
  </NFlex>
</template>

<style scoped lang='less'>

</style>
