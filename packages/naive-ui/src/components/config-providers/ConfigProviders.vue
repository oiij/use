<script setup lang="ts">
import type { ConfigProvidersProps } from '.'
import { NConfigProvider, NDialogProvider, NGlobalStyle, NLoadingBarProvider, NMessageProvider, NModalProvider, NNotificationProvider, useDialog, useLoadingBar, useMessage, useModal, useNotification } from 'naive-ui'
import { defineComponent, onMounted } from 'vue'

const { globalStyle = false, configProviderProps, loadingBarProps, dialogProviderProps, modalProviderProps, notificationProviderProps, messageProviderProps } = defineProps<ConfigProvidersProps>()

// 挂载naive组件的方法至window, 以便在路由钩子函数和请求函数里面调用
function registerNaiveTools() {
  window.$dialog = useDialog()
  window.$loadingBar = useLoadingBar()
  window.$message = useMessage()
  window.$modal = useModal()
  window.$notification = useNotification()
}
const NaiveProviderContent = defineComponent({
  setup() {
    onMounted(() => {
      registerNaiveTools()
    })
  },
  render() {
    return null
  },
})
</script>

<template>
  <NConfigProvider v-bind="configProviderProps">
    <NLoadingBarProvider v-bind="loadingBarProps">
      <NDialogProvider v-bind="dialogProviderProps">
        <NModalProvider v-bind="modalProviderProps">
          <NNotificationProvider v-bind="notificationProviderProps">
            <NMessageProvider v-bind="messageProviderProps">
              <slot />
              <NaiveProviderContent />
            </NMessageProvider>
          </NNotificationProvider>
        </NModalProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
    <NGlobalStyle v-if="globalStyle" />
  </NConfigProvider>
</template>

<style scoped></style>
