<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { PresetFormOptions, UseNaiveFormRules } from '@oiij/naive-ui/components'
import { NPresetForm } from '@oiij/naive-ui/components'
import { NAlert, NButton, NCard, NDivider, NForm, NFormItem, NInput, NSpace, NTag, useMessage } from 'naive-ui'
import { h, ref, useTemplateRef } from 'vue'

const message = useMessage()

type UserForm = {
  name?: string
  age?: number | null
  gender?: 'male' | 'female' | 'other'
  hobbies?: string[]
  newsletter?: boolean
  joinDate?: number | null
  bio?: string
  avatarColor?: string | null
  tags?: string[]
  score?: number
  volume?: number
  nickname?: string
}

const formRef = useTemplateRef('user-form')
const initialValues: UserForm = {
  name: '张三',
  age: 25,
  gender: 'male',
  hobbies: ['code', 'music'],
  newsletter: true,
  joinDate: Date.now(),
  bio: '',
  avatarColor: '#18a058',
  tags: ['新用户'],
  score: 4,
  volume: 60,
  nickname: '',
}
const valuesRef = ref<UserForm>({ ...initialValues })

// 动态 hidden 演示：nickname 只在 newsletter=true 时显示
const showNickname = ref(true)

const options: PresetFormOptions<UserForm> = [
  // —— 基础字段 ——
  {
    type: 'input',
    label: '姓名',
    key: 'name',
    span: 12,
    props: { placeholder: '请输入姓名', maxlength: 20, showCount: true },
    required: true,
  },
  {
    type: 'input-number',
    label: '年龄',
    key: 'age',
    span: 12,
    props: { min: 0, max: 150, style: 'width: 100%' },
    rule: { required: true, type: 'number', min: 0, max: 150, message: '年龄需在 0-150 之间' },
  },
  {
    type: 'radio',
    label: '性别',
    key: 'gender',
    span: 12,
    props: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '其他', value: 'other' },
      ],
    },
  },
  {
    type: 'checkbox',
    label: '爱好',
    key: 'hobbies',
    span: 12,
    props: {
      options: [
        { label: '编程', value: 'code' },
        { label: '音乐', value: 'music' },
        { label: '运动', value: 'sport' },
        { label: '阅读', value: 'read' },
      ],
    },
  },
  {
    type: 'switch',
    label: '订阅邮件',
    key: 'newsletter',
    span: 12,
  },
  // —— 动态 hidden：nickname 只在 showNickname=true 时出现 ——
  {
    type: 'input',
    label: '昵称',
    key: 'nickname',
    span: 12,
    props: { placeholder: '显示/隐藏切换演示' },
    hidden: showNickname,
  },
  {
    type: 'select',
    label: '标签',
    key: 'tags',
    span: 24,
    props: {
      multiple: true,
      filterable: true,
      options: [
        { label: '新用户', value: '新用户' },
        { label: 'VIP', value: 'VIP' },
        { label: '活跃', value: '活跃' },
        { label: '沉睡', value: '沉睡' },
      ],
    },
  },
  {
    type: 'date-picker',
    label: '加入日期',
    key: 'joinDate',
    span: 12,
    props: { style: 'width: 100%' },
  },
  {
    type: 'dynamic-tags',
    label: '标签（动态）',
    key: 'tags',
    span: 12,
    props: {
      style: 'width: 100%',
    },
  },
  {
    type: 'rate',
    label: '满意度',
    key: 'score',
    span: 12,
    props: { count: 5 },
  },
  {
    type: 'slider',
    label: '音量',
    key: 'volume',
    span: 12,
    props: { min: 0, max: 100, step: 5 },
  },
  {
    type: 'color-picker',
    label: '头像色',
    key: 'avatarColor',
    span: 12,
    props: { modes: ['hex'] },
  },
  {
    type: 'input',
    label: '简介',
    key: 'bio',
    span: 24,
    props: { type: 'textarea', placeholder: '自我介绍...', rows: 3 },
  },
  // —— collapsed 折叠区：以下字段会被移到底部展开区 ——
  {
    type: 'divider',
    span: 24,
    collapsed: true,
  },
  {
    label: '自定义区域',
    span: 24,
    collapsed: true,
    render: ({ overflow }) => {
      return h(NCard, { size: 'small', title: 'render 自定义渲染' }, {
        default: () => [
          h(NForm, { labelPlacement: 'left' }, {
            default: () => [
              h(NFormItem, { label: '说明' }, {
                default: () => h(NInput, { placeholder: '这里完全自定义', style: 'width: 100%' }),
              }),
            ],
          }),
          h(NTag, { type: overflow ? 'warning' : 'success', size: 'small' }, () => `overflow: ${overflow}`),
        ],
      })
    },
  },
]

const rules: UseNaiveFormRules<UserForm> = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度 2-20', trigger: 'blur' },
  ],
  age: { type: 'number', min: 0, message: '年龄不能为负' },
  gender: { required: true, message: '请选择性别' },
}

function handleSubmit() {
  formRef.value?.validate()
    .then((res) => {
      message.success('校验通过，提交成功！')
      console.log('提交:', formRef.value?.formValues)
      console.log('validate 返回:', res)
    })
    .catch((err) => {
      message.error('校验失败，请检查红色字段')
      console.warn('校验错误:', err)
    })
}

function handleValidateField() {
  formRef.value?.validateField('age')
    .then(() => message.success('age 单字段校验通过'))
    .catch(() => message.warning('age 单字段校验失败'))
}

function handleClear() {
  formRef.value?.clear()
  message.info('clear()：按 clearRules 清空所有字段')
}

function handleResetForm() {
  formRef.value?.resetForm()
  message.info('resetForm()：恢复快照')
}

function handleReset() {
  formRef.value?.reset()
  message.info('reset()：恢复快照 + 清除校验态')
}

function handleUpdateCache() {
  formRef.value?.updateCache()
  message.success('updateCache()：当前值已存为新快照')
}

function handleCollapseToggle() {
  if (formRef.value) {
    formRef.value.collapsed = !formRef.value.collapsed
  }
}

function handleShowNicknameToggle() {
  showNickname.value = !showNickname.value
}
</script>

<template>
  <NCard title="完整 PresetForm 示例" :bordered="false" size="large">
    <!-- @vue-generic {UserForm} -->
    <NPresetForm
      ref="user-form"
      :values="valuesRef"
      :options="options"
      :rules="rules"
      :form-props="{ labelPlacement: 'left', labelWidth: '80px' }"
      @validated="(v) => console.log('validated 事件:', v)"
    >
      <template #header>
        <NSpace justify="space-between" align="center" style="width: 100%">
          <NAlert type="info" :bordered="false" :show-icon="false" closable>
            Vue 3.5+ slot 自动 ref 解包 — 作用域 v-bind 里拿纯值，不用 .value
          </NAlert>
        </NSpace>
      </template>

      <template #footer>
        <NDivider style="margin: 12px 0" />
        <NSpace wrap justify="space-between" align="center">
          <!-- 左侧：状态显示 -->
          <NSpace align="center" size="medium">
            <NTag :bordered="false" type="info">
              dirty: <b>{{ formRef?.dirty }}</b>
            </NTag>
            <NTag :bordered="false" type="warning">
              collapsed: <b>{{ formRef?.collapsed }}</b>
            </NTag>
          </NSpace>

          <!-- 右侧：操作按钮（演示全部 API） -->
          <NSpace wrap>
            <NButton size="small" @click="handleShowNicknameToggle">
              切换 nickname hidden {{ showNickname }}
            </NButton>
            <NButton size="small" @click="handleCollapseToggle">
              外部控制折叠
            </NButton>
            <NButton size="small" @click="handleUpdateCache">
              保存快照
            </NButton>
            <NButton size="small" @click="handleValidateField">
              只校验 age
            </NButton>
            <NButton size="small" @click="handleClear">
              clear() 清空
            </NButton>
            <NButton size="small" @click="handleResetForm">
              resetForm()
            </NButton>
            <NButton size="small" @click="handleReset">
              reset() 全重置
            </NButton>
            <NButton type="primary" size="small" @click="handleSubmit">
              validate + 提交
            </NButton>
          </NSpace>
        </NSpace>
      </template>
    </NPresetForm>

    <NDivider>实时 formValues</NDivider>
    <pre style="margin: 0; background: #f8f8f8; padding: 12px; border-radius: 4px; font-size: 13px; max-height: 300px; overflow: auto"><code>{{ JSON.stringify(valuesRef, null, 2) }}</code></pre>
  </NCard>
</template>

<style scoped lang='less'>

</style>
