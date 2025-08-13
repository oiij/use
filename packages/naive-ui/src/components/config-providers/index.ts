import type { ConfigProviderProps, DialogProviderInst, DialogProviderProps, LoadingBarProviderInst, LoadingBarProviderProps, MessageProviderInst, MessageProviderProps, ModalProviderInst, ModalProviderProps, NotificationProviderInst, NotificationProviderProps } from 'naive-ui'
import type { ClassStyle } from '../data-table-plus'
import type { FullLoadingProps } from '../full-loading/index'

export { default as NConfigProviders } from './ConfigProviders.vue'
export type ConfigProvidersProps = & {
  globalStyle?: boolean
  configProviderProps?: ConfigProviderProps & ClassStyle
  loadingBarProps?: LoadingBarProviderProps & ClassStyle
  fullLoadingProps?: FullLoadingProps & ClassStyle
  dialogProviderProps?: DialogProviderProps & ClassStyle
  modalProviderProps?: ModalProviderProps & ClassStyle
  notificationProviderProps?: NotificationProviderProps & ClassStyle
  messageProviderProps?: MessageProviderProps & ClassStyle
}

export type LoadingIns = & {
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
