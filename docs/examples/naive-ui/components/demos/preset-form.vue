<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { NaiveFormRules, PresetFormOptions } from '@oiij/naive-ui/components'
import { NPresetForm } from '@oiij/naive-ui/components'
import { NButton, NFlex } from 'naive-ui'
import { h, ref } from 'vue'

interface Values {
  id?: string
}
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
    render: (refs, actions) => {
      return h(NButton, { onClick: () => {
        actions.validate()?.then(() => {
          console.log(values)
        })
      } }, {
        default: () => '验证',
      })
    },
  },
]
const rules: NaiveFormRules<Values> = {
  id: { required: true },
}
</script>

<template>
  <NFlex vertical>
    <!-- @vue-generic {Values} -->
    <NPresetForm :values="values" :options="options" :rules="rules" />
    <pre>值：{{ values }}</pre>
  </NFlex>
</template>

<style scoped lang='less'>

</style>
