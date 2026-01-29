<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useScanCode } from '@oiij/use'
import { NButton, NCard, NFlex, NInput, NInputGroup } from 'naive-ui'
import { ref } from 'vue'

const text = ref('123456789')
function mock() {
  text.value.split('').forEach((char) => {
    const keydownEvent = new KeyboardEvent('keydown', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
    })
    window.dispatchEvent(keydownEvent)
  })
  const keydownEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true,
  })
  window.dispatchEvent(keydownEvent)
}
const { value, pending } = useScanCode()
</script>

<template>
  <NFlex vertical>
    <NInputGroup>
      <NInput v-model:value="text" />
      <NButton @click="mock">
        模拟
      </NButton>
    </NInputGroup>
  </NFlex>
  <NCard>
    <pre>code:{{ value }}</pre>
    <pre>pending:{{ pending }}</pre>
  </NCard>
</template>

<style scoped lang='less'>

</style>
