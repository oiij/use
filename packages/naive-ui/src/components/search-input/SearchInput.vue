<script setup lang='ts'>
import type { SearchInputProps } from '.'
import { useDebounceFn, useTimeoutFn } from '@vueuse/core'
import { NButton, NInput, NInputGroup } from 'naive-ui'
import { ref, useTemplateRef, watch, watchEffect } from 'vue'
import EosIconsThreeDotsLoading from '../icons/EosIconsThreeDotsLoading.vue'
import RiSearch2Line from '../icons/RiSearch2Line.vue'

const { value = '', type = 'default', autoTrigger = true, searchButton = true, inputProps, buttonProps, loading } = defineProps<SearchInputProps>()
const emit = defineEmits<{
  (e: 'update:value', v: typeof value): void
}>()
const inputRef = useTemplateRef('inputRef')
const _value = ref(value)
const { isPending, start } = useTimeoutFn(() => {}, typeof autoTrigger === 'number' ? autoTrigger : 500)
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
watchEffect(() => {
  if (!loading && _value.value) {
    inputRef.value?.focus()
  }
})
</script>

<template>
  <NInputGroup>
    <NInput ref="inputRef" v-model:value="_value" :disabled="loading" clearable v-bind="inputProps" @keydown="handleKeyDown">
      <template #prefix>
        <slot name="prefix">
          <slot name="prefix-icon">
            <RiSearch2Line />
          </slot>
        </slot>
      </template>
      <template #suffix>
        <EosIconsThreeDotsLoading v-if="isPending" />
      </template>
    </NInput>
    <slot name="button">
      <NButton v-if="searchButton" :type="type" :loading="loading" v-bind="buttonProps" @click="handleClick">
        <template #icon>
          <slot name="button-icon">
            <RiSearch2Line />
          </slot>
        </template>
      </NButton>
    </slot>
  </NInputGroup>
</template>

<style scoped lang='less'>

</style>
