<script setup lang='ts'>
import { NBubble } from '@oiij/naive-ui/components'
import { NButton, NFlex } from 'naive-ui'
import { computed, ref } from 'vue'

const num = ref(1)
const value = computed(() => '按钮用来触发一些操作。'.repeat(num.value))
function typeNext() {
  num.value += 1
}
</script>

<template>
  <NFlex vertical>
    <NBubble :content="value" typing />
    <NFlex>
      <NButton @click="typeNext">
        typeNext
      </NButton>
    </NFlex>
  </NFlex>
</template>

<style scoped>

</style>
