<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { NaiveFormRules, PresetFormOptions } from '@oiij/naive-ui/components'
import { NPresetForm } from '@oiij/naive-ui/components'
import { NButton, NFlex, NInput, NSwitch } from 'naive-ui'
import { h, ref, useTemplateRef } from 'vue'

interface Values {
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
    gridSpan: 12,
  },
  {
    type: 'input-number',
    label: 'Num',
    key: 'num',
    required: true,
    gridSpan: 12,
  },
  {
    type: 'switch',
    label: 'Hidden',
    key: 'hidden',
    gridSpan: 12,
  },
  {
    type: 'input',
    label: 'Input',
    key: 'id',
    gridSpan: 12,
    hidden: () => values.value.hidden ?? true,
  },
  {
    gridSpan: 24,
    render: () => {
      return flag.value ? h(NInput, { 'value': temValue.value, 'onUpdate:value': val => temValue.value = val }) : null
    },
  },
  ...(Array.from({ length: 5 }).map(() => {
    return {
      type: 'divider' as any,
      gridSpan: 24,
    }
  })),
]
const rules: NaiveFormRules<Values> = {
  id: { required: true },
}
function handleValidate() {
  presetForm.value?.actions.validate()
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
