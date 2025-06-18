<script setup lang='ts'>
import { NTypeWriter } from '@oiij/naive-ui/components'
import { NButton, NFlex } from 'naive-ui'
import { nextTick, ref } from 'vue'

const value = ref('Tooltip Content.')
const mdValue = ref(`\`\`\`javascript \n console.log('Hello, world!'); \n \`\`\` `)
function onClick() {
  value.value = ''
  mdValue.value = ''
  nextTick(() => {
    value.value = 'Tooltip Content.'
    mdValue.value = `\`\`\`javascript \n console.log('Hello, world!'); \n \`\`\` `
  })
}
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NButton @click="onClick">
        打字
      </NButton>
    </NFlex>
    <NTypeWriter :value="value" suffix="✨" />
    <NTypeWriter :value="mdValue" suffix="✨" markdown />
  </NFlex>
</template>

<style scoped lang='less'>

</style>
