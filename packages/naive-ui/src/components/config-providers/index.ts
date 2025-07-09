import type { ConfigProviderProps, DialogProviderInst, DialogProviderProps, LoadingBarProviderInst, LoadingBarProviderProps, MessageProviderInst, MessageProviderProps, ModalProviderInst, ModalProviderProps, NotificationProviderInst, NotificationProviderProps } from 'naive-ui'
import type { FullLoadingProps } from '../full-loading'

export { default as NConfigProviders } from './ConfigProviders.vue'
export interface ConfigProvidersProps {
  globalStyle?: boolean
  configProviderProps?: ConfigProviderProps
  loadingBarProps?: LoadingBarProviderProps
  fullLoadingProps?: FullLoadingProps
  dialogProviderProps?: DialogProviderProps
  modalProviderProps?: ModalProviderProps
  notificationProviderProps?: NotificationProviderProps
  messageProviderProps?: MessageProviderProps
}

export interface LoadingIns {
  start: () => void
  finish: () => void
}
declare global {
  interface Window {
    $dialog: DialogProviderInst
    $loading: LoadingIns
    $loadingBar: LoadingBarProviderInst
    $message: MessageProviderInst
    $modal: ModalProviderInst
    $notification: NotificationProviderInst
  }
}
