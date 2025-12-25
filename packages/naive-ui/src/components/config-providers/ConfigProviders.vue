<script setup lang="ts">
import type { ConfigProvidersProps } from './index'
import { NConfigProvider, NDialogProvider, NGlobalStyle, NLoadingBarProvider, NMessageProvider, NModalProvider, NNotificationProvider, useDialog, useLoadingBar, useMessage, useModal, useNotification } from 'naive-ui'
import { defineComponent, onMounted } from 'vue'
import { useLoading } from '../../composables'
import { NLoadingProvider } from '../loading-provider'

const { globalStyle = false, configProviderProps, loadingBarProviderProps, loadingProviderProps, dialogProviderProps, modalProviderProps, notificationProviderProps, messageProviderProps } = defineProps<ConfigProvidersProps>()

// 挂载naive组件的方法至window, 以便在路由钩子函数和请求函数里面调用
function registerNaiveTools() {
  window.$dialog = useDialog()
  window.$loadingBar = useLoadingBar()
  window.$message = useMessage()
  window.$modal = useModal()
  window.$notification = useNotification()
  window.$loading = useLoading()
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
    <NLoadingBarProvider v-bind="loadingBarProviderProps">
      <NLoadingProvider v-bind="loadingProviderProps">
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
      </NLoadingProvider>
    </NLoadingBarProvider>
    <NGlobalStyle v-if="globalStyle" />
  </NConfigProvider>
</template>

<style scoped></style>
