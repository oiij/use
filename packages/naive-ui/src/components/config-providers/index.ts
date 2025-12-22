import type { ConfigProviderProps, DialogProviderInst, DialogProviderProps, LoadingBarProviderInst, LoadingBarProviderProps, MessageProviderInst, MessageProviderProps, ModalProviderInst, ModalProviderProps, NotificationProviderInst, NotificationProviderProps } from 'naive-ui'
import type { useLoading } from '../../composables'
import type { ClassStyle } from '../data-table-plus'
import type { LoadingProviderProps } from '../loading-provider'

export { default as NConfigProviders } from './ConfigProviders.vue'
export type ConfigProvidersProps = & {
  globalStyle?: boolean
  configProviderProps?: ConfigProviderProps & ClassStyle
  loadingBarProps?: LoadingBarProviderProps & ClassStyle
  loadingProviderProps?: LoadingProviderProps & ClassStyle
  dialogProviderProps?: DialogProviderProps & ClassStyle
  modalProviderProps?: ModalProviderProps & ClassStyle
  notificationProviderProps?: NotificationProviderProps & ClassStyle
  messageProviderProps?: MessageProviderProps & ClassStyle
}

declare global {
  interface Window {
    $dialog: DialogProviderInst
    $loading: ReturnType<typeof useLoading>
    $loadingBar: LoadingBarProviderInst
    $message: MessageProviderInst
    $modal: ModalProviderInst
    $notification: NotificationProviderInst
  }
}
