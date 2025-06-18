<script setup lang='ts'>
import { useShiki } from '@oiij/shiki'
import { NFlex } from 'naive-ui'

const { value, domRef } = useShiki(`export const foo = 'foo'`)
</script>

<template>
  <NFlex vertical>
    <div ref="domRef" />
    <textarea v-model="value" style="border: 1px solid #000;" />
  </NFlex>
</template>

<style scoped>

</style>
