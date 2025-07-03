<script setup lang='ts'>
import type { TypeWriterProps } from '.'
import { useStyle } from '@oiij/css-render'
import { useMarkdownIt } from '@oiij/markdown-it'
import { useTypeWriter } from '@oiij/use'
import { NEl } from 'naive-ui'
import { computed } from 'vue'
import { highlight } from '../_utils'
import { cName, typeWriterCssr } from './type-writer.cssr'

const { value, typing = true, markdown, step, interval, suffix = '|' } = defineProps<TypeWriterProps>()
const emit = defineEmits<{
  (e: 'start'): void
  (e: 'update', v: { index: number, value: string }): void
  (e: 'stop', v: string): void
}>()
useStyle(cName, typeWriterCssr())

const { typedValue, isTyping, onStat, onUpdate, onStop } = useTypeWriter(computed(() => value ?? ''), {
  step,
  interval,
  enabled: typing,
})
onStat(() => {
  emit('start')
})
onUpdate((v) => {
  emit('update', v)
})
onStop((v) => {
  emit('stop', v)
})
const { html } = useMarkdownIt(typedValue, {
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight,
})
const renderValue = computed(() => markdown ? html.value : typedValue.value)
</script>

<template>
  <NEl tag="div" :class="[cName]">
    <div :class="[isTyping && !markdown ? `${cName}__cursor` : undefined, markdown ? `${cName}__markdown` : undefined]" :style="[!markdown ? { '--cursor-content': `'${suffix}'` } : undefined]" v-html="renderValue" />
  </NEl>
</template>

<style scoped>

</style>
