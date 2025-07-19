<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { NaiveFormRules, PresetFormOptions } from '@oiij/naive-ui/components'
import { NPresetForm } from '@oiij/naive-ui/components'
import { NButton, NDivider, NFlex } from 'naive-ui'
import { h, ref, useTemplateRef } from 'vue'

interface Values {
  id?: string
  num?: number
}
const presetForm = useTemplateRef('preset-form')
const values = ref<Values>({
  id: '1',
})
const options: PresetFormOptions<Values> = [
  {
    type: 'input',
    label: 'ID',
    key: 'id',
  },
  {
    type: 'input-number',
    label: 'Num',
    key: 'num',
    rules: {
      required: true,
    },
  },
  {
    gridItemProps: {
      span: 24,
    },
    render: () => {
      return h(NDivider)
    },
  },
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
    />
    <pre>值：{{ values }}</pre>
    <NButton @click="handleValidate">
      验证
    </NButton>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
