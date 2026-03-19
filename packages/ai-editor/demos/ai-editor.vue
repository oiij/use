<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useAiEditor } from '@oiij/ai-editor'
import { NFlex, NInput, NSwitch } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

const darkMode = ref(false)
const language = ref<'zh' | 'en'>('zh')
const valueRef = ref('AA')
const { value, onUpdateValue } = useAiEditor(useTemplateRef('dom-ref'), {
  value: valueRef,
  darkMode,
  language,
})

onUpdateValue((v) => {
  console.log(v)
})
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <span>Dark Mode</span>
      <NSwitch v-model:value="darkMode" />
      <span>Language</span>
      <NSwitch v-model:value="language" checked-value="zh" unchecked-value="en" />
    </NFlex>
    <NInput v-model:value="valueRef" />
    <div ref="dom-ref" />
    <pre>{{ value }}</pre>
    <pre v-html="value" />
  </NFlex>
</template>

<style scoped>

</style>
