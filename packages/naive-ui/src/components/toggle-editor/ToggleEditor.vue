<script setup lang='ts'>
import type { InputProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'
import { NInput } from 'naive-ui'
import { nextTick, ref, useTemplateRef } from 'vue'

const { inputProps } = defineProps<{
  inputProps?: InputProps & ClassStyle
}>()
const value = defineModel<string>('value')
const editorFlag = ref(false)
const inputRef = useTemplateRef('inputRef')
const inputValue = ref(value.value)
function onClick() {
  editorFlag.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}
function onChange() {
  editorFlag.value = false
  value.value = inputValue.value
}
</script>

<template>
  <div @click="onClick">
    <NInput v-if="editorFlag" ref="inputRef" :value="inputValue" v-bind="inputProps" @update:value="(val) => inputValue = val" @change="onChange" @blur="onChange" />
    <template v-else>
      {{ inputValue }}
    </template>
  </div>
</template>

<style scoped>

</style>
