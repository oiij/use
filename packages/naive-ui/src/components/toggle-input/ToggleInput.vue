<script setup lang='ts'>
import type { InputProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'
import { NInput } from 'naive-ui'
import { nextTick, ref, useTemplateRef, watchEffect } from 'vue'

const { trigger = 'click', inputProps } = defineProps<{
  trigger?: 'click' | 'dblclick'
  inputProps?: InputProps & ClassStyle
}>()
const emit = defineEmits<{
  (e: 'trigger'): void
}>()
const value = defineModel<string | number>('value')
const showInput = ref(false)
const inputRef = useTemplateRef('input-ref')
const inputValue = ref(value.value)
watchEffect(() => {
  inputValue.value = value.value
})
function onTrigger() {
  inputValue.value = value.value
  showInput.value = true
  emit('trigger')
  nextTick(() => {
    inputRef.value?.focus()
  })
}
function onUpdateValue(val: string | number) {
  inputValue.value = val
}
function hideInput() {
  showInput.value = false
}
function onEmit() {
  hideInput()
  value.value = inputValue.value
}
</script>

<template>
  <div @click="trigger === 'click' && onTrigger()" @dblclick="trigger === 'dblclick' && onTrigger()">
    <slot v-if="showInput" name="input" v-bind="{ onUpdateValue, hideInput, onEmit, inputValue }">
      <NInput
        ref="input-ref"
        :value="typeof inputValue === 'string' ? inputValue : inputValue?.toString()"
        v-bind="inputProps"
        @update:value="onUpdateValue"
        @blur="onEmit"
      />
    </slot>
    <slot v-else name="default" v-bind="{ value: inputValue }">
      {{ inputValue }}
    </slot>
  </div>
</template>

<style scoped>

</style>
