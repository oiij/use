<script setup lang='ts'
generic="
  P extends  Record<string, any>,
  D extends Record<string, any>,
  "
>
import type { VNode } from 'vue'
import type { DataTableFilterOptions } from './index'
import { NDatePicker, NFormItem, NInput, NSelect, NSwitch, NTimePicker } from 'naive-ui'
import { h } from 'vue'
import { NSearchInput } from '../index'

const { options, value, loading } = defineProps<{
  options?: DataTableFilterOptions<P, D>[0]
  value?: unknown
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:value', val?: typeof value): void
}>()

function packageComponent() {
  const { title, type, props, labelProps } = options ?? {}
  function renderLabel(children: VNode) {
    return h(NFormItem, {
      label: title,
      labelPlacement: 'left',
      ...labelProps,
    }, {
      default: () => children,
    })
  }
  switch (type) {
    case 'date-picker':
      return renderLabel(h(NDatePicker, {
        'value': value as number,
        'onUpdate:value': (val) => {
          emit('update:value', val)
        },

        ...props,
      }))

      break
    case 'input':
      return renderLabel(h(NInput, {
        'value': value as never,
        'onUpdate:value': (val) => {
          emit('update:value', val)
        },
        loading,
        ...props,
      }))
      break

    case 'search':
      return renderLabel(h(NSearchInput, {
        'value': value as never,
        'onUpdate:value': (val) => {
          emit('update:value', val)
        },
        ...props,
      }))
      break
    case 'select':
      return renderLabel(h(NSelect, {
        'value': value as never,
        'onUpdate:value': (val) => {
          emit('update:value', val)
        },
        ...props,
      }))
      break
    case 'switch':
      return renderLabel(h(NSwitch, {
        'value': value as never,
        'onUpdate:value': (val) => {
          emit('update:value', val)
        },
        ...props,
      }))
      break
    case 'time-picker':
      return renderLabel(h(NTimePicker, {
        'value': value as never,
        'onUpdate:value': (val) => {
          emit('update:value', val)
        },
        ...props,
      }))
      break

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
