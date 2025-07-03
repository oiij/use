<script setup lang='ts' generic="V extends any">
import type { VNode } from 'vue'
import type { PresetInputOptions } from '.'
import { NButton, NDatePicker, NFormItem, NInput, NSelect, NSwitch, NTimePicker } from 'naive-ui'
import { h } from 'vue'
import { NSearchInput } from '..'

const { value, path, options } = defineProps<{
  value?: V
  path?: string
  options?: PresetInputOptions
}>()
const emit = defineEmits<{
  (e: 'update:value', val?: V): void
}>()
function packageComponent() {
  const { label, type, props } = options ?? {}
  const labelProps = typeof label === 'string'
    ? {
        label,
      }
    : typeof label === 'boolean' ? {} : label
  function renderLabel(children: VNode) {
    return label
      ? h(NFormItem, {
          labelPlacement: 'left',
          path,
          ...labelProps,
        }, {
          default: () => children,
        })
      : children
  }
  switch (type) {
    case 'date-picker':
      return renderLabel(h(NDatePicker, {
        'value': value as any,
        'onUpdate:value': (val) => {
          emit('update:value', val as any)
        },
        ...props,
      }))

    case 'input':
      return renderLabel(h(NInput, {
        'value': value as any,
        'onUpdate:value': (val) => {
          emit('update:value', val as any)
        },
        ...props,
      }))

    case 'search':
      return renderLabel(h(NSearchInput, {
        'value': value as any,
        'onUpdate:value': (val) => {
          emit('update:value', val as any)
        },
        ...props,
      }))
    case 'select':
      return renderLabel(h(NSelect, {
        'value': value as any,
        'onUpdate:value': (val) => {
          emit('update:value', val as any)
        },
        ...props,
      }))
    case 'switch':
      return renderLabel(h(NSwitch, {
        'value': value as any,
        'onUpdate:value': (val) => {
          emit('update:value', val as any)
        },
        ...props,
      }))
    case 'time-picker':
      return renderLabel(h(NTimePicker, {
        'value': value as any,
        'onUpdate:value': (val) => {
          emit('update:value', val as any)
        },
        ...props,
      }))
    case 'button':
      return renderLabel(h(NButton, {
        ...props,
      }))
    default:
      break
  }
}
</script>

<template>
  <component :is="packageComponent()" />
</template>

<style scoped>

</style>
