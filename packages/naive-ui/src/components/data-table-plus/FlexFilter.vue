<script setup lang='ts'
  generic="
    P extends RObject,
    D extends RObject,
    R extends RObject
  "
>
import type { FlexProps } from 'naive-ui'
import type { RObject } from '../remote-request/index'
import type { DataTablePlusExposeActions, DataTablePlusExposeRefs, DataTablePlusFilterOptionItem } from './index'
import { NFlex } from 'naive-ui'
import { h } from 'vue'
import { renderLabel } from '../preset-input/_utils'
import { NPresetInput } from '../preset-input/index'

const { options, exposeRefs, exposeActions, params, flexProps } = defineProps<{
  options?: DataTablePlusFilterOptionItem<P, D, R>[]
  exposeRefs: DataTablePlusExposeRefs<P, D, R>
  exposeActions: DataTablePlusExposeActions<P, D>
  params: P[]
  flexProps?: FlexProps
}>()
const emit = defineEmits<{
  (e: 'update:value', val: unknown, key: keyof P): void
}>()
</script>

<template>
  <NFlex v-if=" options && options.length > 0" v-bind="flexProps">
    <template
      v-for="({ key, render, label, ..._options }, _index) in options"
      :key="_index"
    >
      <component
        :is="renderLabel(render(exposeRefs, exposeActions), label, { path: key as string, labelPlacement: 'left' })"
        v-if="render"
      />
      <component
        :is="renderLabel(
          h(NPresetInput, {
            'options': _options,
            'value': key ? params[0][key] : undefined,
            'onUpdate:value': (val) => key && emit('update:value', val, key),
          }),
          label,
          { path: key as string, labelPlacement: 'left' })"
        v-else
      />
    </template>
  </NFlex>
</template>

<style scoped>

</style>
