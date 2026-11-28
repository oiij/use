<script setup lang='ts'>
import { NBubble } from '@oiij/naive-ui/components'
import { NAvatar, NFlex, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const loading = ref(false)
const typing = ref(false)
</script>

<template>
  <NFlex vertical size="large">
    <NFlex align="center" size="small">
      <span>加载中</span>
      <NSwitch v-model:value="loading" />
      <span>打字光标</span>
      <NSwitch v-model:value="typing" />
    </NFlex>
    <NBubble
      placement="start"
      name="Vue 助手"
      datetime="10:24"
      :loading="loading"
      :typing="typing"
    >
      <template #avatar>
        <NAvatar round>
          V
        </NAvatar>
      </template>
      你好，我是基于 Vue 3 的对话助手，有什么可以帮你？
    </NBubble>
    <NBubble placement="end" name="我" datetime="10:25" content="介绍一下对话气泡组件的用法" />
  </NFlex>
</template>

<style scoped lang='less'>

</style>
