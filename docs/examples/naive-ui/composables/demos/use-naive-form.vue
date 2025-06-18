<script setup lang='ts'>
import { useNaiveForm } from '@oiij/naive-ui'
import { NButton, NCard, NDynamicInput, NDynamicTags, NFlex, NForm, NFormItem, NInput, NInputNumber, NSwitch } from 'naive-ui'

const { validate, formValue, formProps, resetValidation, resetForm, reset, clear } = useNaiveForm({
  foo: {
    bar: 'bar',
  },
  bar: 1,
  args: [
    'a',
  ],
  boolean: false,
  argObjs: [],
}, {
  rules: {
    foo: {
      bar: {
        required: true,
        message: '请输入foo',
        trigger: ['blur', 'change'],
      },
    },
    bar: {
      type: 'number',
      required: true,
      message: '请输入bar',
      trigger: ['blur', 'change'],
    },
    args: {
      type: 'array',
      required: true,
      message: '请输入',
      trigger: ['blur', 'change'],
    },
    boolean: {
      type: 'boolean',
      required: true,
      message: '请输入',
      trigger: ['blur', 'change'],
    },
    argObjs: {
      type: 'array',
      required: true,
      message: '请输入',
      trigger: ['blur', 'change'],
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
    <NForm v-bind="formProps">
      <NFormItem label="foo.bar" path="foo.bar">
        <NInput v-model:value="formValue.foo.bar" placeholder="输入foo" />
      </NFormItem>
      <NFormItem label="bar" path="bar">
        <NInputNumber v-model:value="formValue.bar" placeholder="输入bar" />
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
    </NForm>
  </NCard>
</template>

<style scoped lang='less'>

</style>
