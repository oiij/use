import type { ConfigProviderProps, DialogProviderInst, DialogProviderProps, LoadingBarProviderInst, LoadingBarProviderProps, MessageProviderInst, MessageProviderProps, ModalProviderInst, ModalProviderProps, NotificationProviderInst, NotificationProviderProps } from 'naive-ui'

export { default as NConfigProviders } from './ConfigProviders.vue'
export interface ConfigProvidersProps {
  globalStyle?: boolean
  configProviderProps?: ConfigProviderProps
  loadingBarProps?: LoadingBarProviderProps
  dialogProviderProps?: DialogProviderProps
  modalProviderProps?: ModalProviderProps
  notificationProviderProps?: NotificationProviderProps
  messageProviderProps?: MessageProviderProps
}
declare global {
  interface Window {
    $dialog: DialogProviderInst
    $loadingBar: LoadingBarProviderInst
    $message: MessageProviderInst
    $modal: ModalProviderInst
    $notification: NotificationProviderInst
  }
}
