<script setup lang='ts'>
import { NBubble } from '@oiij/naive-ui/components'
import { NSwitch } from 'naive-ui'
import { ref } from 'vue'

const value = ref('Bubble 内容！')
const loading = ref(false)
</script>

<template>
  <div style="display: flex; flex-direction: column;gap: 10px;align-items: start;">
    <NBubble :content="value" :loading="loading" />
    <NSwitch v-model:value="loading" />
  </div>
</template>

<style scoped>

</style>
