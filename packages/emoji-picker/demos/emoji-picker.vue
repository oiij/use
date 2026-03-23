<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useEmojiPicker } from '@oiij/emoji-picker'
import { useTemplateRef } from 'vue'

const { onRendered } = useEmojiPicker(useTemplateRef('dom-ref'))
onRendered(() => {
  console.log('render')
})
</script>

<template>
  <div ref="dom-ref" />
</template>

<style scoped>

</style>
