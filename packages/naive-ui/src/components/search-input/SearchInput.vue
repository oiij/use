<script setup lang='ts'>
import type { SearchInputProps } from './index'
import { useDebounceFn, useTimeoutFn } from '@vueuse/core'
import { NButton, NInput, NInputGroup } from 'naive-ui'
import { ref, watch } from 'vue'
import RiSearch2Line from '../icons/RiSearch2Line.vue'

const { value, type, autoTrigger = true, searchButton = true, inputProps, buttonProps } = defineProps<SearchInputProps>()
const emit = defineEmits<{
  (e: 'update:value', v: typeof value): void
}>()
const _value = ref(value)
const { isPending, start } = useTimeoutFn(() => {}, 500)
watch(() => value, (v) => {
  _value.value = v
})
const debounceEmit = useDebounceFn(() => {
  emit('update:value', _value.value)
}, typeof autoTrigger === 'number' ? autoTrigger : 500)
watch(_value, () => {
  start()
  if (autoTrigger)
    debounceEmit()
})
function handleClick() {
  emit('update:value', _value.value)
}
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter')
    handleClick()
}
</script>

<template>
  <NInputGroup>
    <NInput v-model:value="_value" :loading="isPending" placeholder="搜索" v-bind="inputProps" @keydown="handleKeyDown">
      <template #prefix>
        <slot name="icon">
          <RiSearch2Line />
        </slot>
      </template>
    </NInput>
    <slot name="button">
      <NButton v-if="searchButton" :type="type" v-bind="buttonProps" @click="handleClick">
        <template #icon>
          <RiSearch2Line />
        </template>
      </NButton>
    </slot>
  </NInputGroup>
</template>

<style scoped lang='less'>

</style>
