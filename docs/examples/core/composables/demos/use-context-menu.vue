<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useContextMenu } from '@oiij/use'
import { NDropdown } from 'naive-ui'

const { domRef, show, x, y, hide } = useContextMenu()
const options = [
  { label: '选项1', key: '1' },
  { label: '选项2', key: '2' },
  { label: '选项3', key: '3' },
]
</script>

<template>
  <div ref="domRef" style="width: 100%;height: 200px;display: flex;flex-direction: column;align-items: center;justify-content: center;font-size: 20px;">
    <p>点击鼠标右键</p>
    <pre>x:{{ x }} y:{{ y }} show:{{ show }}</pre>
  </div>
  <NDropdown trigger="manual" :x="x" :y="y" :show="show" :options="options" :on-clickoutside="hide" />
</template>

<style scoped lang='less'>

</style>
