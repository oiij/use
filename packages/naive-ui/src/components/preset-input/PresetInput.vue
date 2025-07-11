<script setup lang='ts' generic="V">
import type { Component, VNode } from 'vue'
import type { PresetInputProps, PresetInputType } from '.'
import { NButton, NCheckbox, NCheckboxGroup, NColorPicker, NDatePicker, NDynamicTags, NInput, NInputNumber, NRadio, NRadioGroup, NRate, NSelect, NSlider, NSwitch, NTimePicker } from 'naive-ui'
import { h } from 'vue'
import { NSearchInput } from '..'
import { renderLabel as _renderLabel } from './_utils'

const { value, path, options } = defineProps<PresetInputProps<V>>()
const emit = defineEmits<{
  (e: 'update:value', val?: V): void
}>()
const components: Record<keyof PresetInputType, Component> = {
  'button': NButton,
  'color-picker': NColorPicker,
  'checkbox': NCheckboxGroup,
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
  const { label, type, props } = options ?? {}
  function renderLabel(children: VNode) {
    return _renderLabel(children, label, path)
  }
  if (type === 'checkbox') {
    const { options, ..._props } = props ?? {}
    return renderLabel(h(components[type], {
      'value': value as any,
      'onUpdate:value': (val: any) => {
        emit('update:value', val as any)
      },
      ..._props,
    }, {
      default: () => options?.map(m => h(NCheckbox, { ...m })),
    }))
  }
  if (type === 'radio') {
    const { options, ..._props } = props ?? {}
    return renderLabel(h(components[type], {
      'value': value as any,
      'onUpdate:value': (val: any) => {
        emit('update:value', val as any)
      },
      ..._props,
    }, {
      default: () => options?.map(m => h(NRadio, { ...m })),
    }))
  }
  if (type && components[type]) {
    return renderLabel(h(components[type], {
      'value': value as any,
      'onUpdate:value': (val: any) => {
        emit('update:value', val as any)
      },
      ...props,
    }))
  }
}
</script>

<template>
  <component :is="packageComponent()" />
</template>

<style scoped>

</style>
