<script setup lang='ts'>
import { NBubble } from '@oiij/naive-ui/components'
import { ref } from 'vue'

const value = ref('Bubble 内容！')
</script>

<template>
  <div style="display: flex; flex-direction: column;gap: 10px;">
    <NBubble :content="value" :avatar="{}" />
    <NBubble :content="value" placement="end" />
  </div>
</template>

<style scoped>

</style>
