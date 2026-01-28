<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { PresetFormOptions, UseNaiveFormRules } from '@oiij/naive-ui/components'
import { NPresetForm } from '@oiij/naive-ui/components'
import { NButton, NFlex, NInput, NSwitch } from 'naive-ui'
import { h, ref, useTemplateRef } from 'vue'

type Values = {
  id?: string
  num?: number
  hidden?: boolean
}
const presetForm = useTemplateRef('preset-form')
const values = ref<Values>({
  id: '1',
  hidden: false,
})
const temValue = ref('value')
const flag = ref(true)
const options: PresetFormOptions<Values> = [
  {
    type: 'input',
    label: 'ID',
    key: 'id',
    span: 12,
  },
  {
    type: 'input-number',
    label: 'Num',
    key: 'num',
    required: true,
    rule: {
      type: 'number',
    },
    span: 12,
  },
  {
    type: 'switch',
    label: 'Hidden',
    key: 'hidden',
    span: 12,
  },
  {
    type: 'input',
    label: 'Input',
    key: 'id',
    span: 12,
    hidden: () => values.value.hidden ?? true,
  },
  {
    span: 24,
    render: () => {
      return flag.value ? h(NInput, { 'value': temValue.value, 'onUpdate:value': val => temValue.value = val }) : null
    },
  },
  {
    label: 'overflow',
    itemProps: {
      suffix: true,
    },
    render: ({ overflow }) => {
      return h('span', {}, { default: () => overflow })
    },
  },
  ...(Array.from({ length: 5 }).map(() => {
    return {
      type: 'divider' as any,
      span: 24,
    }
  })),
]
const rules: UseNaiveFormRules<Values> = {
  id: { required: true },
}
function handleValidate() {
  presetForm.value?.validate()
}
function onValidated(values: any) {
  console.log(values)
}
</script>

<template>
  <NFlex vertical>
    <!-- @vue-generic {Values} -->
    <NPresetForm
      ref="preset-form"
      :values="values"
      :options="options"
      :rules="rules"
      :form-props="{ labelPlacement: 'top' }"
      @validated="onValidated"
    >
      <template #header>
        <h1>Header Slot</h1>
        <NFlex>
          <NSwitch v-model:value="flag" />
        </NFlex>
      </template>
      <template #footer>
        <NFlex>
          <NButton @click="handleValidate">
            验证
          </NButton>
        </NFlex>
      </template>
    </NPresetForm>
    <pre>值：{{ values }}</pre>
    <pre>{{ options }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
