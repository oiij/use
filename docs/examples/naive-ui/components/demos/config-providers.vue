<script setup lang='ts'>
import { NConfigProviders } from '@oiij/naive-ui/components'
import { darkTheme, NButton, NCard, NFlex, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const dark = ref(false)
function onClick() {
  window.$message.success('点击了按钮')
}
function handleGlobalLoading() {
  window.$loading?.show()
  setTimeout(() => {
    window.$loading?.hide()
  }, 2000)
}
</script>

<template>
  <NConfigProviders :config-provider-props="{ theme: dark ? darkTheme : undefined }">
    <NCard>
      <NFlex vertical>
        <div>
          <NSwitch v-model:value="dark">
            <template #checked>
              dark
            </template>
            <template #unchecked>
              light
            </template>
          </NSwitch>
        </div>
        <div>
          <NButton @click="onClick">
            Message
          </NButton>
          <NButton @click="handleGlobalLoading">
            GlobalLoading
          </NButton>
        </div>
      </NFlex>
    </NCard>
  </NConfigProviders>
</template>

<style scoped lang='less'>

</style>
