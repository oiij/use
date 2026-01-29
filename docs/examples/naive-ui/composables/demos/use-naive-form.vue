<script setup lang='ts'>
import type { FormInst } from 'naive-ui'
import { useNaiveForm } from '@oiij/naive-ui'
import { NButton, NCard, NDynamicInput, NDynamicTags, NFlex, NForm, NFormItem, NInput, NInputNumber, NSwitch } from 'naive-ui'
import { ref, useTemplateRef } from 'vue'

const _formValue = ref({
  foo: {
    bar: 'bar',
  },
  bar: 1,
  args: [
    'a',
  ],
  boolean: false,
  argObjs: [{
    key: '1',
    value: '一',
  }],
})
const { validate, formValue, formProps, resetValidation, resetForm, reset, clear } = useNaiveForm(useTemplateRef<FormInst>('form-ref'), {
  value: _formValue,
  rules: {
    foo: {
      bar: {
        required: true,
      },
    },
    bar: {
      required: true,
      type: 'number',
    },
  },
  clearRules: {
    string: null,
    number: null,
    boolean: null,
  },
})
</script>

<template>
  <NCard>
    <NForm v-bind="formProps" ref="form-ref">
      <NFormItem label="foo.bar" path="foo.bar">
        <NInput v-model:value="formValue.foo.bar" placeholder="输入foo" />
      </NFormItem>
      <NFormItem label="bar" path="bar">
        <NInputNumber v-model:value="_formValue.bar" placeholder="输入bar" />
      </NFormItem>
      <NFormItem label="args" path="args">
        <NDynamicTags v-model:value="formValue.args" />
      </NFormItem>
      <NFormItem label="boolean" path="boolean">
        <NSwitch v-model:value="formValue.boolean" />
      </NFormItem>
      <NFormItem label="argObjs" path="argObjs">
        <NDynamicInput v-model:value="formValue.argObjs" preset="pair" />
      </NFormItem>
      <NFlex>
        <NButton @click="validate">
          验证表单
        </NButton>
        <NButton @click="resetValidation">
          重置验证
        </NButton>
        <NButton @click="resetForm">
          重置表单
        </NButton>
        <NButton @click="reset">
          重置所有
        </NButton>
        <NButton @click="clear">
          清除表单
        </NButton>
      </NFlex>
      <pre>{{ JSON.stringify(formValue, null, 2) }}   </pre>
      <pre>{{ JSON.stringify(_formValue, null, 2) }}   </pre>
    </NForm>
  </NCard>
</template>

<style scoped lang='less'>

</style>
