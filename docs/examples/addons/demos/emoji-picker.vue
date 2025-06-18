<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useEmojiPicker } from '@oiij/emoji-picker'

const { domRef, onRender } = useEmojiPicker()
onRender(() => {
  console.log('render')
})
</script>

<template>
  <div ref="domRef" />
</template>

<style scoped>

</style>
