<script setup lang='ts' generic="V">
import type { Component } from 'vue'
import type { PresetInputProps, PresetInputType } from './index'
import { NButton, NCheckbox, NCheckboxGroup, NColorPicker, NDatePicker, NDivider, NDynamicTags, NInput, NInputNumber, NRadio, NRadioGroup, NRate, NSelect, NSlider, NSwitch, NTimePicker } from 'naive-ui'
import { h } from 'vue'
import { NSearchInput } from '../search-input/index'

const { value, options } = defineProps<PresetInputProps<V>>()
const emit = defineEmits<{
  (e: 'update:value', val?: V): void
}>()
const components: Record<keyof PresetInputType, Component> = {
  'button': NButton,
  'color-picker': NColorPicker,
  'checkbox': NCheckboxGroup,
  'divider ': NDivider,
  'date-picker': NDatePicker,
  'dynamic-tags': NDynamicTags,
  'input': NInput,
  'input-number': NInputNumber,
  'search': NSearchInput,
  'radio': NRadioGroup,
  'rate': NRate,
  'select': NSelect,
  'slider': NSlider,
  'switch': NSwitch,
  'time-picker': NTimePicker,
}
function packageComponent() {
  const { type, props } = options ?? {}

  if (type === 'checkbox') {
    const { options, ..._props } = props ?? {}
    return h(components[type], {
      'value': value as any,
      'onUpdate:value': (val: any) => {
        emit('update:value', val as any)
      },
      ..._props,
    }, {
      default: () => options?.map(m => h(NCheckbox, { ...m })),
    })
  }
  if (type === 'divider ') {
    const { ..._props } = props ?? {}
    return h(components[type], {
      ..._props,
    })
  }
  if (type === 'radio') {
    const { options, ..._props } = props ?? {}
    return h(components[type], {
      'value': value as any,
      'onUpdate:value': (val: any) => {
        emit('update:value', val as any)
      },
      ..._props,
    }, {
      default: () => options?.map(m => h(NRadio, { ...m })),
    })
  }
  if (type && components[type]) {
    return h(components[type], {
      'value': value as any,
      'onUpdate:value': (val: any) => {
        emit('update:value', val as any)
      },
      ...props,
    })
  }
}
</script>

<template>
  <component :is="packageComponent()" />
</template>

<style scoped>

</style>
