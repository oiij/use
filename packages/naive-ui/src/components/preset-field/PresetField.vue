<script setup lang='ts' generic="K extends keyof PresetFieldType = keyof PresetFieldType">
import type { PresetFieldProps, PresetFieldType, PresetFieldValueMap } from './index'
import { computed, h } from 'vue'
import { presetFieldConfigs, resolveFieldBindings } from './_presets'

const { type, value, emptyValue, options } = defineProps<PresetFieldProps<K>>()
const emit = defineEmits<{
  (e: 'update:value', val?: PresetFieldValueMap[K]): void
}>()

const renderedInput = computed(() => {
  if (!type)
    return null

  const config = presetFieldConfigs[type]
  if (!config)
    return null

  const { props, slots } = options ?? {}
  const { bindings, slots: mergedSlots } = resolveFieldBindings(config, {
    value,
    emptyValue,
    props,
    slots,
    onUpdateValue: (val: any) => emit('update:value', val),
  })

  return h(config.component, bindings, mergedSlots)
})
</script>

<template>
  <component :is="renderedInput" />
</template>
