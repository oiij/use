<script setup lang='ts'>
import type { SearchInputProps } from './index'
import { useDebounceFn, useTimeoutFn } from '@vueuse/core'
import { NButton, NInput, NInputGroup } from 'naive-ui'
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue'
import MageSearch from '../icons/MageSearch.vue'

const { value, type, placeholder = 'Type A Search', autoTrigger = true, searchButton, inputProps, buttonProps, loading } = defineProps<SearchInputProps>()
const emit = defineEmits<{
  (e: 'update:value', v: typeof value): void
}>()
const inputRef = useTemplateRef('input-ref')
const _value = ref(value ?? null)
const _searchButtonType = computed(() => typeof searchButton === 'boolean' ? 'text' : searchButton)
const { start } = useTimeoutFn(() => {}, typeof autoTrigger === 'number' ? autoTrigger : 500)
watchEffect(() => {
  _value.value = value ?? null
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
    <NInput
      ref="input-ref"
      v-model:value="_value"
      clearable
      :placeholder="placeholder"
      v-bind="inputProps"
      @keydown="handleKeyDown"
    >
      <template #prefix>
        <slot name="prefix">
          <slot name="prefix-icon">
            <MageSearch style="width: 18px;height:18px;" />
          </slot>
        </slot>
      </template>
    </NInput>
    <slot name="button" :value :loading>
      <NButton v-if="_searchButtonType" :type="type" :loading="loading" v-bind="buttonProps" @click="handleClick">
        <template v-if="_searchButtonType === 'text'">
          搜索
        </template>
        <template v-if="_searchButtonType === 'icon'" #icon>
          <slot name="button-icon">
            <MageSearch />
          </slot>
        </template>
      </NButton>
    </slot>
  </NInputGroup>
</template>

<style scoped lang='less'>

</style>
